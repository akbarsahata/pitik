/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  QueryDslQueryContainer,
  SearchFieldCollapse,
  SearchTotalHits,
  SortCombinations,
} from '@elastic/elasticsearch/api/types.d';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../config/datasource';
import { ProductDAO } from '../dao/product.dao';
import { Product } from '../datasources/entity/elasticsearch/Product.entity';
import {
  InternalUpsertProductBody,
  mapProductPayload,
  SearchProductQuery,
} from '../dto/product.dto';
import { ReindexErpProductsQueue } from '../jobs/queues/reindex-erp-products.queue';

@Service()
export class ProductService {
  @Inject(ProductDAO)
  private productDAO: ProductDAO;

  @Inject(ReindexErpProductsQueue)
  private reindexQueue: ReindexErpProductsQueue;

  async internalUpsert(input: InternalUpsertProductBody) {
    return this.productDAO.upsertDocument(mapProductPayload(input) as Required<Product>);
  }

  async search(filter: SearchProductQuery): Promise<[Partial<Product>[], number]> {
    const query: QueryDslQueryContainer = {};

    const categoryName = filter.categoryName || 'OVK';
    if (!query.bool) query.bool = {};
    query.bool.must = [
      ...(query.bool.must ? (query.bool.must as QueryDslQueryContainer[]) : []),
      {
        match: {
          categoryName,
        },
      },
      {
        match: {
          isActive: true,
        },
      },
    ];

    if (filter.productName) {
      if (!query.bool) query.bool = {};
      query.bool.should = [
        ...(query.bool.should ? (query.bool.should as QueryDslQueryContainer[]) : []),
        {
          match: {
            productName: {
              boost: 80,
              query: filter.productName,
              fuzziness: 5,
            },
          },
        },
        {
          match: {
            productName: {
              boost: 20,
              query: filter.productName,
            },
          },
        },
      ];
    }

    const collapse: SearchFieldCollapse = { field: '' };
    if (categoryName === 'PAKAN') {
      collapse.field = 'subcategoryName.keyword';
    } else if (categoryName === 'DOC') {
      collapse.field = 'categoryName.keyword';
    }

    const sort: SortCombinations[] = [];
    if (categoryName.toUpperCase() === 'PAKAN') {
      sort.push({
        order: {
          order: 'asc',
        },
      });
    }

    let minScore = 0;
    if (filter.productName) {
      minScore = esEnv.ES_PRODUCT_MIN_SCORE;
    }

    const size = filter.$limit || 10;
    const from = (filter.$page && (filter.$page - 1) * (filter.$limit || 10)) || 0;
    const results = await this.productDAO.search(size, from, query, collapse, sort, minScore);

    let products = results.hits.map((hit) => ({
      ...(hit?._source || {}),
    }));

    if (categoryName === 'PAKAN') {
      products = products.map((p) => ({
        ...p,
        productCode: p.subcategoryCode,
        productName: p.subcategoryName,
      }));
    }

    const count = (results.total as SearchTotalHits).value;

    return [products, count];
  }

  async reindex() {
    await this.reindexQueue.addJob();
  }
}
