import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, Like } from 'typeorm';
import { ProductsInVendorDAO } from '../../dao/sales/productsInVendor.dao';
import { VendorDAO } from '../../dao/sales/vendor.dao';
import { UserDAO } from '../../dao/user.dao';
import { Vendor, VendorTypeEnum } from '../../datasources/entity/pgsql/sales/Vendor.entity';
import {
  CreateSalesVendorBody,
  GetSalesVendorsQuery,
  UpdateSalesVendorBody,
} from '../../dto/sales/vendor.dto';
import { APP_ID } from '../../libs/constants';
import { RequestUser } from '../../libs/types/index.d';
import { checkAllUndefinedProperties } from '../../libs/utils/helpers';
import { DecodedPlusCode, decodePlusCode } from '../../libs/utils/plusCode';

@Service()
export class SalesVendorsService {
  @Inject(VendorDAO)
  private dao: VendorDAO;

  @Inject(ProductsInVendorDAO)
  private productsInVendorDAO: ProductsInVendorDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  async get(
    userRequest: RequestUser,
    filter: GetSalesVendorsQuery,
    appId?: string,
  ): Promise<[Vendor[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const baseQuery: FindOptionsWhere<Vendor> = {
      vendorName: filter.vendorName && ILike(`%${filter.vendorName}%`),
      priceBasis: filter.priceBasis,
      status: filter.status,
      plusCode: filter.plusCode ? Like(`%${filter.plusCode}%`) : undefined,
      provinceId: filter.provinceId,
      cityId: filter.cityId,
      districtId: filter.districtId,
      type: filter.type,
      branchId: filter.branchId,
    };

    const queries: FindOptionsWhere<Vendor>[] = [];

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: userRequest.id,
        },
        relations: {
          branch: {
            branchCities: true,
          },
        },
      });

      if (!user.branch) {
        throw new Error('User does not have branch');
      }

      queries.push({
        ...baseQuery,
        type: VendorTypeEnum.EXTERNAL,
      });

      queries.push({
        ...baseQuery,
        branchId: user.branchId,
        type: VendorTypeEnum.INTERNAL,
      });
    } else {
      queries.push(baseQuery);
    }

    const result = await this.dao.getMany({
      where: queries.filter((val) => !checkAllUndefinedProperties(val)),
      relations: {
        salesProductsInVendor: {
          salesProductCategory: true,
        },
        branch: true,
        province: true,
        city: true,
        district: true,
      },
      order: {
        modifiedDate: 'DESC',
      },
      skip,
      take: limit,
    });

    return result;
  }

  async getById(vendorId: string): Promise<Vendor> {
    const result = await this.dao.getOneStrict({
      where: {
        id: vendorId,
      },
      relations: {
        salesProductsInVendor: {
          salesProductCategory: true,
        },
        branch: true,
        province: true,
        city: true,
        district: true,
      },
    });

    return result;
  }

  async create(input: CreateSalesVendorBody, user: RequestUser): Promise<Vendor> {
    const location = await decodePlusCode(input.plusCode);
    const qr = await this.dao.startTransaction();

    try {
      const created = await this.dao.createOneWithTx(
        {
          ...input,
          status: input.status || false,
          latitude: location.lat,
          longitude: location.lng,
        },
        user,
        qr,
      );

      await this.productsInVendorDAO.createManyWithTx(
        input.purchasableProducts.map((p) => ({
          salesVendorId: created.id,
          salesProductCategoryId: p,
        })),
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      return await this.dao.getOneStrict({
        where: {
          id: created.id,
        },
        relations: {
          salesProductsInVendor: {
            salesProductCategory: true,
          },
          branch: true,
          province: true,
          city: true,
          district: true,
        },
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(user: RequestUser, input: UpdateSalesVendorBody, id: string): Promise<Vendor> {
    const vendor = await this.dao.getOneStrict({
      where: {
        id,
      },
    });

    let location: DecodedPlusCode = {
      lat: vendor.latitude,
      lng: vendor.longitude,
    };

    if (input.plusCode && vendor.plusCode !== input.plusCode) {
      location = await decodePlusCode(input.plusCode);
    }

    const { purchasableProducts, ...customerInput } = input;

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

      await this.productsInVendorDAO.softDeleteManyWithTx(
        {
          salesVendorId: id,
        },
        qr,
      );

      await this.productsInVendorDAO.upsertMany(
        user,
        purchasableProducts.map((p) => ({
          salesVendorId: id,
          salesProductCategoryId: p,
        })),
        {
          qr,
        },
      );

      await this.dao.commitTransaction(qr);

      return await this.dao.getOneStrict({
        where: {
          id,
        },
        relations: {
          salesProductsInVendor: {
            salesProductCategory: true,
          },
          branch: true,
          province: true,
          city: true,
          district: true,
        },
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }
}
