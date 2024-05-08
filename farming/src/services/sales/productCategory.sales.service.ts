import { Inject, Service } from 'fastify-decorators';
import { ManufactureOutputPresetDAO } from '../../dao/sales/manufactureOutputPreset.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductCategory } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import {
  GetProductCategoriesQuery,
  GetSalesManufactureOutputResponseItem,
} from '../../dto/sales/productCategory.dto';

@Service()
export class ProductCategoryService {
  @Inject(ProductCategoryDAO)
  private dao: ProductCategoryDAO;

  @Inject(ManufactureOutputPresetDAO)
  private manufactureOutputPresetDAO: ManufactureOutputPresetDAO;

  async categories(opts: {
    query: GetProductCategoriesQuery;
  }): Promise<[ProductCategory[], number]> {
    const result = await this.dao.getMany({
      where: {
        isManufacturable: opts.query.isManufacturable,
        isActive: true,
      },
    });

    return result;
  }

  async getManufactureOutput(
    productCategoryId: string,
  ): Promise<GetSalesManufactureOutputResponseItem[]> {
    const [groups] = await this.manufactureOutputPresetDAO.getMany({
      where: {
        salesProductCategoryInputId: productCategoryId,
      },
      relations: {
        salesProductCategoryInput: true,
      },
    });

    const [categories] = await this.dao.getMany({});
    const result = groups.map((group) => ({
      input: group.salesProductCategoryInput,
      output: group.salesProductCategoryOutputIds.map(
        (id) => categories.find((category) => category.id === id)!,
      ),
    }));

    return result;
  }
}
