import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere } from 'typeorm';
import { ManufactureDAO } from '../../dao/sales/manufacture.dao';
import { SalesOperationUnitDAO } from '../../dao/sales/operationUnit.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductCategoryPriceDAO } from '../../dao/sales/productCategoryPrice.dao';
import { ProductsInManufactureDAO } from '../../dao/sales/productsInManufacture.dao';
import { UserDAO } from '../../dao/user.dao';
import {
  Manufacture,
  ManufactureStatusEnum,
} from '../../datasources/entity/pgsql/sales/Manufacture.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import {
  STOCK_OPERATOR,
  STOCK_STATUS,
} from '../../datasources/entity/pgsql/sales/OperationUnitStock.entity';
import { ProductCategoryCodeEnum } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { ProductsInManufactureTypeEnum } from '../../datasources/entity/pgsql/sales/ProductsInManufacture.entity';
import {
  CreateSalesManufactureBody,
  GetSalesManufactureByIdResponseItem,
  GetSalesManufacturesQuery,
  ProductCategoryInManufacture,
  UpdateSalesManufactureBody,
} from '../../dto/sales/manufacture.dto';
import { APP_ID, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import {
  ERR_SALES_MANUFACTURE_INVALID_INPUT,
  ERR_SALES_MANUFACTURE_INVALID_STATUS,
  ERR_SALES_MANUFACTURE_MISSING_PRODUCT_OUTPUT_DATA,
  ERR_SALES_PRICE_IN_CITY_NOT_FOUND,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesManufactureService {
  @Inject(ManufactureDAO)
  private dao: ManufactureDAO;

  @Inject(SalesOperationUnitDAO)
  private salesOperationUnitDAO: SalesOperationUnitDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductCategoryDAO)
  private productCategoryDAO: ProductCategoryDAO;

  @Inject(ProductsInManufactureDAO)
  private productsInManufactureDAO: ProductsInManufactureDAO;

  @Inject(ProductCategoryPriceDAO)
  private productCategoryPriceDAO: ProductCategoryPriceDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  async get(
    filter: GetSalesManufacturesQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[GetSalesManufactureByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const baseFilter: FindOptionsWhere<Manufacture> = {
      salesOperationUnitId: filter.operationUnitId,
      status: filter.status,
    };

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: requestUser.id,
        },
      });

      baseFilter.salesOperationUnit = {
        salesUsersInOperationUnit: {
          userId: requestUser.id,
        },
        branchId: user.branchId,
      };
    }

    const [manufactures, count] = await this.dao.getMany({
      where: baseFilter,
      relations: {
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesProductsInManufacture: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
      order: {
        modifiedDate: 'DESC',
      },
      skip,
      take: limit,
    });

    return [manufactures.map((item) => this.mapManufactureEntityToDTO(item)), count];
  }

  async getById(id: string): Promise<GetSalesManufactureByIdResponseItem> {
    const item = await this.dao.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
        },
        salesProductsInManufacture: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.mapManufactureEntityToDTO(item);
  }

  async create(
    input: CreateSalesManufactureBody,
    user: RequestUser,
  ): Promise<GetSalesManufactureByIdResponseItem> {
    await this.validateProductInput(input.operationUnitId, input.input.productItemId);

    const qr = await this.dao.startTransaction();

    try {
      const created = await this.dao.upsertOne(
        user,
        {
          ...input,
          salesOperationUnitId: input.operationUnitId,
        },
        {
          qr,
        },
      );

      await this.productsInManufactureDAO.createManyWithTx(
        [
          {
            ...input.input,
            salesManufactureId: created.id,
            salesProductItemId: input.input.productItemId,
            type: ProductsInManufactureTypeEnum.IN,
          },
        ],
        user,
        qr,
      );

      // NOTE: On create, the 'output' products' body will be
      // ignore automatically. Since a new manufacture still
      // don't have an input

      await this.dao.commitTransaction(qr);

      return await this.getById(created.id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(
    user: RequestUser,
    input: UpdateSalesManufactureBody,
    id: string,
  ): Promise<GetSalesManufactureByIdResponseItem> {
    if (
      (input.status === ManufactureStatusEnum.OUTPUT_DRAFT ||
        input.status === ManufactureStatusEnum.OUTPUT_CONFIRMED) &&
      input.output.length === 0
    ) {
      throw ERR_SALES_MANUFACTURE_MISSING_PRODUCT_OUTPUT_DATA();
    }
    const currentManufacture = await this.dao.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesOperationUnit: true,
        salesProductsInManufacture: true,
      },
    });

    const currentProductInput = currentManufacture.salesProductsInManufacture.find(
      (p) => p.type === ProductsInManufactureTypeEnum.IN,
    );

    const { input: productInput, output: productOutput, ...customerInput } = input;

    const qr = await this.dao.startTransaction();

    try {
      if (
        currentManufacture.status === ManufactureStatusEnum.INPUT_DRAFT &&
        (customerInput.status === ManufactureStatusEnum.INPUT_DRAFT ||
          customerInput.status === ManufactureStatusEnum.INPUT_CONFIRMED)
      ) {
        await this.validateProductInput(input.operationUnitId, productInput.productItemId);

        // editing manufacture input detail
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
            salesOperationUnitId: customerInput.operationUnitId,
          },
          user,
          qr,
        );

        await this.productsInManufactureDAO.softDeleteManyWithTx(
          {
            salesManufactureId: id,
            type: ProductsInManufactureTypeEnum.IN,
          },
          qr,
        );

        await this.productsInManufactureDAO.upsertMany(
          user,
          [
            {
              ...productInput,
              salesManufactureId: id,
              salesProductItemId: productInput.productItemId,
              type: ProductsInManufactureTypeEnum.IN,
            },
          ],
          {
            qr,
          },
        );
      } else if (
        currentManufacture.status === ManufactureStatusEnum.INPUT_CONFIRMED &&
        customerInput.status === ManufactureStatusEnum.INPUT_BOOKED
      ) {
        // Book stock manufacture input
        if (!currentProductInput) {
          throw new Error('No input detected! Please select SKU input.');
        }

        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );

        const bookedProducts = await this.operationUnitStockDAO.bookStock({
          operationUnitId: currentManufacture.salesOperationUnitId,
          bookType: {
            manufacturingId: currentManufacture.id,
          },
          products: [
            {
              productItemId: currentProductInput.salesProductItemId,
              quantity: currentProductInput.quantity,
              weight: 0, // always 0 because we don't track the weight of SKU anymore
            },
            {
              productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              quantity: 0,
              weight: currentProductInput.weight, // Total weight is the same as input weight
            },
          ],
          qr,
          user,
        });

        // NOTE: Get the first price in the booked stock
        const productPrice = bookedProducts
          .sort((a, b) => a.modifiedDate.valueOf() - b.modifiedDate.valueOf())
          .filter((item) => item.price !== null)[0].price;

        await this.productsInManufactureDAO.softDeleteManyWithTx(
          {
            salesManufactureId: id,
            type: ProductsInManufactureTypeEnum.IN,
          },
          qr,
        );

        await this.productsInManufactureDAO.upsertMany(
          user,
          [
            {
              ...productInput,
              salesManufactureId: id,
              salesProductItemId: productInput.productItemId,
              type: ProductsInManufactureTypeEnum.IN,
              price: productPrice,
            },
          ],
          {
            qr,
          },
        );
      } else if (
        (currentManufacture.status === ManufactureStatusEnum.INPUT_BOOKED ||
          currentManufacture.status === ManufactureStatusEnum.OUTPUT_DRAFT) &&
        customerInput.status === ManufactureStatusEnum.OUTPUT_DRAFT
      ) {
        if (!customerInput.outputTotalWeight) {
          throw new Error('Output total weight is required!');
        }

        // editing manufacture output detail
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
            outputTotalWeight: customerInput.outputTotalWeight,
          },
          user,
          qr,
        );

        await this.productsInManufactureDAO.softDeleteManyWithTx(
          {
            salesManufactureId: id,
            type: ProductsInManufactureTypeEnum.OUT,
          },
          qr,
        );

        await this.productsInManufactureDAO.upsertMany(
          user,
          [
            ...productOutput.map((p) => ({
              ...p,
              salesManufactureId: id,
              salesProductItemId: p.productItemId,
              type: ProductsInManufactureTypeEnum.OUT,
            })),
            {
              salesProductItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              salesManufactureId: id,
              type: ProductsInManufactureTypeEnum.OUT,
              quantity: 0,
              weight: customerInput.outputTotalWeight,
              cityBasedPrice: 0,
              price: 0,
            },
          ],
          {
            qr,
          },
        );
      } else if (
        (currentManufacture.status === ManufactureStatusEnum.INPUT_BOOKED ||
          currentManufacture.status === ManufactureStatusEnum.OUTPUT_DRAFT) &&
        customerInput.status === ManufactureStatusEnum.OUTPUT_CONFIRMED
      ) {
        // validate manufacture output
        await this.productCategoryDAO.validateQuantityAndWeight(productOutput);
        if (!currentProductInput) {
          throw new Error('No input detected! Please select SKU input.');
        }

        const productInputInCurrentManufacture =
          currentManufacture.salesProductsInManufacture.filter(
            (item) => item.type === ProductsInManufactureTypeEnum.IN,
          );
        if (!productInputInCurrentManufacture.length) {
          throw new Error('No input detected! Please select SKU input.');
        }

        const totalProductOutputWeight = productOutput.reduce(
          (weight, item) => weight + item.weight,
          0,
        );

        if (productInputInCurrentManufacture[0].weight < totalProductOutputWeight) {
          throw new Error("Manufacture output's weight is greater than the input!");
        }

        // manufacturing process is done
        // - release booked stock (input)
        // - add output to operation unit stock
        const manufacture = await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );

        await this.productsInManufactureDAO.softDeleteManyWithTx(
          {
            salesManufactureId: id,
            type: ProductsInManufactureTypeEnum.OUT,
          },
          qr,
        );

        const productOutputCalculationWithUnitPrice =
          await this.productsInManufactureDAO.calculateCOGS(
            {
              operationUnit: currentManufacture.salesOperationUnit,
              productManufactureInput: currentProductInput,
              productManufactureOutput: productOutput,
            },
            qr,
          );

        const [lbPriceInCity] = await this.productCategoryPriceDAO.getMany({
          where: {
            cityId: currentManufacture.salesOperationUnit.cityId,
            salesProductCategory: {
              code: ProductCategoryCodeEnum.LIVE_BIRD,
            },
          },
          order: {
            createdDate: 'DESC',
          },
          take: 1,
        });

        if (!lbPriceInCity.length) {
          throw ERR_SALES_PRICE_IN_CITY_NOT_FOUND();
        }

        const productOutputCalculationWithCityPrice =
          await this.productsInManufactureDAO.calculateCOGS(
            {
              operationUnit: currentManufacture.salesOperationUnit,
              productManufactureInput: currentProductInput,
              productManufactureOutput: productOutput,
              lbPriceInCity: lbPriceInCity[0].price || undefined,
            },
            qr,
          );

        const currentProductOutputs = await this.productsInManufactureDAO.upsertMany(
          user,
          [
            ...productOutputCalculationWithUnitPrice.map((item) => ({
              ...item,
              cityBasedPrice: productOutputCalculationWithCityPrice.find(
                (p) => p.productItemId === item.productItemId,
              )?.price,
              price: item.price,
              salesManufactureId: id,
              salesProductItemId: item.productItemId,
              type: ProductsInManufactureTypeEnum.OUT,
            })),
            {
              salesProductItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              salesManufactureId: id,
              type: ProductsInManufactureTypeEnum.OUT,
              quantity: 0,
              weight: manufacture.outputTotalWeight || 0,
              cityBasedPrice: 0,
              price: 0,
            },
          ],
          {
            qr,
          },
        );

        await this.operationUnitStockDAO.releaseBookedStock({
          qr,
          user,
          bookType: {
            manufacturingId: currentManufacture.id,
          },
        });

        await this.operationUnitStockDAO.upsertMany(
          user,
          [
            ...currentProductOutputs.map((p) => ({
              operationUnitId: currentManufacture.salesOperationUnitId,
              manufacturingId: currentManufacture.id,
              operator: STOCK_OPERATOR.PLUS,
              productItemId: p.salesProductItemId,
              quantity: p.quantity,
              availableQuantity: p.quantity,
              weight: p.weight,
              availableWeight: p.weight,
              price: p.price,
              cityBasedPrice: p.cityBasedPrice,
              status: STOCK_STATUS.FINAL,
            })),
            {
              operationUnitId: currentManufacture.salesOperationUnitId,
              manufacturingId: currentManufacture.id,
              operator: STOCK_OPERATOR.PLUS,
              productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              quantity: 0,
              availableQuantity: 0,
              weight: manufacture.outputTotalWeight,
              availableWeight: manufacture.outputTotalWeight,
              price: 0,
              cityBasedPrice: 0,
              status: STOCK_STATUS.FINAL,
            },
          ],
          {
            qr,
          },
        );
      } else if (
        currentManufacture.status === ManufactureStatusEnum.OUTPUT_CONFIRMED &&
        customerInput.status === ManufactureStatusEnum.CANCELLED
      ) {
        // reverse input & output
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );

        // reverse input book stock
        await this.operationUnitStockDAO.reverseFinalStock({
          qr,
          user,
          bookType: {
            manufacturingId: id,
          },
          operator: STOCK_OPERATOR.MINUS,
          reverseToStatus: STOCK_STATUS.CANCELLED,
        });

        // cancel output
        await this.operationUnitStockDAO.reverseFinalStock({
          qr,
          user,
          bookType: {
            manufacturingId: id,
          },
          operator: STOCK_OPERATOR.PLUS,
          reverseToStatus: STOCK_STATUS.CANCELLED,
        });
      } else if (
        currentManufacture.status === ManufactureStatusEnum.OUTPUT_DRAFT &&
        customerInput.status === ManufactureStatusEnum.INPUT_BOOKED
      ) {
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );

        await this.productsInManufactureDAO.softDeleteManyWithTx(
          {
            salesManufactureId: id,
            type: ProductsInManufactureTypeEnum.OUT,
          },
          qr,
        );
      } else if (
        currentManufacture.status === ManufactureStatusEnum.INPUT_BOOKED &&
        customerInput.status === ManufactureStatusEnum.INPUT_CONFIRMED
      ) {
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );

        // cancel book stock
        await this.operationUnitStockDAO.cancelBookStock({
          qr,
          user,
          bookType: {
            manufacturingId: id,
          },
        });
      } else if (
        currentManufacture.status === ManufactureStatusEnum.INPUT_CONFIRMED &&
        customerInput.status === ManufactureStatusEnum.INPUT_DRAFT
      ) {
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );
      } else if (
        currentManufacture.status === ManufactureStatusEnum.INPUT_DRAFT &&
        customerInput.status === ManufactureStatusEnum.CANCELLED
      ) {
        await this.dao.updateOneWithTx(
          { id },
          {
            status: customerInput.status,
          },
          user,
          qr,
        );
      } else {
        throw ERR_SALES_MANUFACTURE_INVALID_STATUS();
      }

      await this.dao.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(
        currentManufacture.salesOperationUnitId,
      );
      return await this.getById(id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async validateProductInput(operationUnitId: string, productItemId: string) {
    const [operationUnit, productCategory] = await Promise.all([
      this.salesOperationUnitDAO.getOneStrict({
        where: {
          id: operationUnitId,
        },
      }),
      this.productCategoryDAO.getOneStrict({
        where: {
          items: {
            id: productItemId,
          },
        },
      }),
    ]);

    const availableProductCategoryInLJagal = [
      ProductCategoryCodeEnum.LIVE_BIRD,
      ProductCategoryCodeEnum.BRANKAS,
      ProductCategoryCodeEnum.AYAM_UTUH,
    ];

    const availableProductCategoryInLapak = [
      ProductCategoryCodeEnum.BRANKAS,
      ProductCategoryCodeEnum.AYAM_UTUH,
    ];

    if (
      operationUnit.type === OperationUnitTypeEnum.LAPAK &&
      availableProductCategoryInLapak.indexOf(productCategory.code) === -1
    ) {
      throw ERR_SALES_MANUFACTURE_INVALID_INPUT('Lapak only accept brankas and ayam utuh!');
    } else if (
      operationUnit.type === OperationUnitTypeEnum.JAGAL &&
      availableProductCategoryInLJagal.indexOf(productCategory.code) === -1
    ) {
      throw ERR_SALES_MANUFACTURE_INVALID_INPUT(
        'Jagal only accept live bird, brankas, and ayam utuh!',
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapManufactureEntityToDTO(manufacture: Manufacture): GetSalesManufactureByIdResponseItem {
    const inputByCategory = new Map<string, ProductCategoryInManufacture>();
    const outputByCategory = new Map<string, ProductCategoryInManufacture>();

    for (let i = 0; i < manufacture.salesProductsInManufacture.length; i += 1) {
      const item = manufacture.salesProductsInManufacture[i];

      if (item.type === ProductsInManufactureTypeEnum.IN) {
        if (!inputByCategory.has(item.salesProductItem.categoryId)) {
          inputByCategory.set(item.salesProductItem.categoryId, {
            ...item.salesProductItem.category,
            totalQuantity: 0,
            totalWeight: 0,
            productItems: [],
          });
        }

        const productCategory = inputByCategory.get(item.salesProductItem.categoryId)!;
        productCategory.totalQuantity += item.quantity;
        productCategory.totalWeight += item.weight;
        productCategory.productItems.push({
          id: item.salesProductItem.id,
          name: item.salesProductItem.name,
          weight: item.weight,
          quantity: item.quantity,
        });

        inputByCategory.set(item.salesProductItem.categoryId, productCategory);
      } else {
        if (!outputByCategory.has(item.salesProductItem.categoryId)) {
          outputByCategory.set(item.salesProductItem.categoryId, {
            ...item.salesProductItem.category,
            totalQuantity: 0,
            totalWeight: 0,
            productItems: [],
          });
        }

        const productCategory = outputByCategory.get(item.salesProductItem.categoryId)!;
        productCategory.totalQuantity += item.quantity;
        productCategory.totalWeight += item.weight;
        productCategory.productItems.push({
          id: item.salesProductItem.id,
          name: item.salesProductItem.name,
          weight: item.weight,
          quantity: item.quantity,
        });

        outputByCategory.set(item.salesProductItem.categoryId, productCategory);
      }
    }

    return {
      ...manufacture,
      code: `${manufacture.salesOperationUnit.branch.code}/MO/${manufacture.id}`,
      operationUnit: {
        ...manufacture.salesOperationUnit,
        province: {
          ...manufacture.salesOperationUnit.province,
          name: manufacture.salesOperationUnit.province.provinceName,
        },
        city: {
          ...manufacture.salesOperationUnit.city,
          name: manufacture.salesOperationUnit.city.cityName,
        },
        district: {
          ...manufacture.salesOperationUnit.district,
          name: manufacture.salesOperationUnit.district.districtName,
        },
      },
      input: Array.from(inputByCategory.values())[0],
      output: Array.from(outputByCategory.values()).filter(
        (item) => item.id !== SALES_TOTAL_WEIGHT_PRODUCT.categoryId,
      ),
      createdDate: manufacture.createdDate.toISOString(),
      modifiedDate: manufacture.modifiedDate.toISOString(),
      createdBy: manufacture.userCreator?.email,
      modifiedBy: manufacture.userModifier?.email,
      outputTotalWeight: manufacture.outputTotalWeight,
    };
  }
}
