import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { CustomerDAO } from '../../dao/sales/customer.dao';
import { CustomerVisitDAO } from '../../dao/sales/customerVisit.dao';
import { ProductsInCustomerDAO } from '../../dao/sales/productsInCustomer.dao';
import { UserDAO } from '../../dao/user.dao';
import { SalesCustomer } from '../../datasources/entity/pgsql/sales/Customer.entity';
import {
  CreateSalesCustomersBody,
  GetSalesCustomersByIdResponseItem,
  GetSalesCustomersQuery,
  ProductItem,
  UpdateSalesCustomersBody,
} from '../../dto/sales/customer.dto';
import { APP_ID, ROLE_RANK_CONTEXT, USER_TYPE } from '../../libs/constants';
import { ERR_INVALID_PHONE_NUMBER_FORMAT } from '../../libs/constants/errors';
import { phoneNumberRegexp } from '../../libs/constants/regexp';
import { RequestUser } from '../../libs/types/index.d';
import { isRoleAllowed } from '../../libs/utils/helpers';
import { DecodedPlusCode, decodePlusCode } from '../../libs/utils/plusCode';
import { UserService as UserCoreService } from '../usermanagement/userCore.service';

@Service()
export class CustomersService {
  @Inject(CustomerDAO)
  private dao: CustomerDAO;

  @Inject(ProductsInCustomerDAO)
  private productsInCustomerDAO: ProductsInCustomerDAO;

  @Inject(CustomerVisitDAO)
  private visitDAO: CustomerVisitDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  async get(
    filter: GetSalesCustomersQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[SalesCustomer[], number]> {
    const roleNames = requestUser.roles?.map((role) => role.name) || [];

    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const baseFilter: FindOptionsWhere<SalesCustomer> = {
      businessName: filter.businessName && ILike(`%${filter.businessName}%`),
      businessType: filter.businessType,
      ownerName: filter.ownerName,
      phoneNumber: filter.phoneNumber,
      isArchived: filter.isArchived,
      salespersonId: filter.salespersonId || undefined,
      plusCode: filter.plusCode ? ILike(`%${filter.plusCode}%`) : undefined,
      latitude: filter.latitude,
      longitude: filter.latitude,
      provinceId: filter.provinceId,
      cityId: filter.cityId,
      supplier: filter.supplier,
      districtId: filter.districtId,
      branchId: filter.branchId,
    };

    // FIXME: remove !appId after release new version of sales app
    if (appId === APP_ID.DOWNSTREAM_APP || !appId) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: requestUser.id,
        },
        relations: {
          branch: {
            branchCities: true,
          },
        },
      });

      if (
        isRoleAllowed(roleNames, [
          USER_TYPE.OPERATIONAL_LEAD,
          USER_TYPE.ADMIN_UNIT,
          USER_TYPE.SHOPKEEPER,
        ])
      ) {
        baseFilter.cityId =
          filter.cityId ||
          (user.branch?.branchCities &&
            In(user.branch.branchCities.map((branchCities) => branchCities.cityId))) ||
          undefined;
      } else if (isRoleAllowed(roleNames, [USER_TYPE.SLSLD])) {
        const [subordinates] = await this.userCoreService.getSubordinates({
          query: { context: ROLE_RANK_CONTEXT.downstream },
          params: { userId: requestUser.userManagementId as string },
        });

        const subordinateIds = subordinates.map((item) => item.cmsId);
        subordinateIds.push(requestUser.id);

        baseFilter.salespersonId =
          filter.salespersonId && subordinateIds.some((id) => id === filter.salespersonId)
            ? filter.salespersonId
            : In(subordinateIds);
      } else if (isRoleAllowed(roleNames, [USER_TYPE.SLS])) {
        baseFilter.salespersonId = requestUser.id;
      }
    }

    const result = await this.dao.getMany({
      where: baseFilter,
      relations: {
        salesperson: true,
        province: true,
        city: true,
        district: true,
        branch: true,
        salesProducts: {
          salesProductItem: {
            category: true,
          },
        },
        salesCustomerVisits: {
          salesperson: true,
          salesProductsInVisit: {
            salesProductItem: {
              category: true,
            },
          },
        },
      },
      order: {
        salesCustomerVisits: {
          modifiedDate: 'DESC',
        },
      },
      skip,
      take: limit,
    });

    return result;
  }

  async getById(customerId: string): Promise<GetSalesCustomersByIdResponseItem> {
    const customer = await this.dao.getOneStrict({
      where: {
        id: customerId,
      },
      relations: {
        salesperson: true,
        province: true,
        city: true,
        district: true,
        branch: true,
        salesProducts: {
          salesProductItem: {
            category: true,
          },
        },
        salesCustomerVisits: true,
      },
      order: {
        salesCustomerVisits: {
          createdDate: 'DESC',
        },
      },
    });

    const latestVisit = await this.visitDAO.getLatestVisit(customerId);

    return {
      ...customer,
      province: {
        ...customer.province,
        name: customer.province.provinceName,
      },
      city: {
        ...customer.city,
        name: customer.city.cityName,
      },
      district: {
        ...customer.district,
        name: customer.district.districtName,
      },
      branch: customer.branch || null,
      latestVisit:
        (latestVisit && {
          ...latestVisit,
          createdDate: latestVisit.createdDate.toISOString(),
          products: latestVisit.salesProductsInVisit.map((product) => ({
            ...product,
            id: product.salesProductItem.id,
            name: product.salesProductItem.name,
            minValue: product.salesProductItem.minValue || undefined,
            maxValue: product.salesProductItem.maxValue || undefined,
            uom: product.salesProductItem.uom,
            value: product.salesProductItem.value,
            category: product.salesProductItem.category,
          })),
        }) ||
        undefined,
      products: customer.salesProducts.map((p) => ({
        ...p,
        id: p.salesProductItemId,
        name: p.salesProductItem.name,
        minValue: p.salesProductItem.minValue || undefined,
        maxValue: p.salesProductItem.maxValue || undefined,
        uom: p.salesProductItem.uom,
        value: p.salesProductItem.value,
        category: p.salesProductItem.category,
      })),
    };
  }

  async update(
    user: RequestUser,
    input: UpdateSalesCustomersBody,
    id: string,
  ): Promise<SalesCustomer> {
    if (!phoneNumberRegexp.test(input.phoneNumber)) {
      throw ERR_INVALID_PHONE_NUMBER_FORMAT();
    }

    const customer = await this.dao.getOneStrict({
      where: {
        id,
      },
    });

    let location: DecodedPlusCode = {
      lat: customer.latitude,
      lng: customer.longitude,
    };

    if (input.plusCode && customer.plusCode !== input.plusCode) {
      location = await decodePlusCode(input.plusCode);
    }

    const { products, ...customerInput } = input;

    const qr = await this.dao.startTransaction();

    try {
      await this.dao.updateOneWithTx(
        { id },
        {
          ...customerInput,
          latitude: location.lat,
          longitude: location.lng,
        },
        user,
        qr,
      );

      await this.productsInCustomerDAO.softDeleteManyWithTx(
        {
          salesCustomerId: id,
        },
        qr,
      );

      await this.productsInCustomerDAO.upsertMany(
        user,
        products.map((p) => ({
          ...p,
          salesCustomerId: id,
          salesProductItemId: p.id,
        })),
        {
          qr,
        },
      );

      await this.dao.commitTransaction(qr);

      return this.dao.getOneStrict({
        where: {
          id,
        },
        relations: {
          salesProducts: {
            salesProductItem: {
              category: true,
            },
          },
        },
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async archive(user: RequestUser, id?: string): Promise<SalesCustomer> {
    const updated = await this.dao.updateOne({ id }, { isArchived: true }, user);

    return updated;
  }

  async unarchive(user: RequestUser, id?: string): Promise<SalesCustomer> {
    const updated = await this.dao.updateOne({ id }, { isArchived: false }, user);

    return updated;
  }

  async create(input: CreateSalesCustomersBody, user: RequestUser): Promise<SalesCustomer> {
    if (!phoneNumberRegexp.test(input.phoneNumber)) {
      throw ERR_INVALID_PHONE_NUMBER_FORMAT();
    }

    const location = await decodePlusCode(input.plusCode);
    const qr = await this.dao.startTransaction();
    let branchId;

    if (!input.branchId) {
      const creator = await this.userDAO.getOne({
        where: {
          id: user.id,
        },
      });
      branchId = creator?.branchId || undefined;
    } else {
      branchId = input.branchId;
    }

    try {
      const created = await this.dao.createOneWithTx(
        {
          ...input,
          isArchived: input.isArchived || false,
          latitude: location.lat,
          longitude: location.lng,
          branchId,
        },
        user,
        qr,
      );

      await this.productsInCustomerDAO.createManyWithTx(
        input.products.map((p) => ({
          ...p,
          salesCustomerId: created.id,
          salesProductItemId: p.id,
        })),
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      return this.dao.getOneStrict({
        where: {
          id: created.id,
        },
        relations: {
          salesProducts: {
            salesProductItem: {
              category: true,
            },
          },
          branch: true,
        },
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async getLatestProducts(customerId: string): Promise<ProductItem[]> {
    const latestVisit = await this.visitDAO.getLatestVisit(customerId);

    if (latestVisit === null) return [];

    return latestVisit.salesProductsInVisit.map((p) => ({
      ...p,
      id: p.salesProductItemId,
      name: p.salesProductItem.name,
      minValue: p.salesProductItem.minValue || undefined,
      maxValue: p.salesProductItem.maxValue || undefined,
      uom: p.salesProductItem.uom,
      value: p.salesProductItem.value,
      category: p.salesProductItem.category,
    }));
  }
}
