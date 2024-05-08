/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  QueryDslQueryContainer,
  SearchFieldCollapse,
  SearchTotalHits,
  SortCombinations,
} from '@elastic/elasticsearch/api/types.d';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ProductESDAO } from '../../dao/es/product.es.dao';
import { Product } from '../../datasources/entity/elasticsearch/Product.entity';
import {
  InternalUpsertProductBody,
  InternalUpsertProductItem,
  mapProductPayload,
  mapProductResponse,
  SearchProductQuery,
} from '../../dto/product.dto';
import { ReindexErpProductsQueue } from '../../jobs/queues/reindex-erp-products.queue';

@Service()
export class ProductService {
  @Inject(ProductESDAO)
  private productESDAO: ProductESDAO;

  @Inject(ReindexErpProductsQueue)
  private reindexQueue: ReindexErpProductsQueue;

  async internalUpsert(input: InternalUpsertProductBody) {
    return this.productESDAO.upsertDocument(mapProductPayload(input) as Required<Product>);
  }

  async search(filter: SearchProductQuery): Promise<[InternalUpsertProductItem[], number]> {
    const query: QueryDslQueryContainer = {};

    const collapse: SearchFieldCollapse = { field: '' };

    const sort: SortCombinations[] = [];

    query.bool = {};

    query.bool.must = [
      {
        match: {
          isActive: true,
        },
      },
      /* prettier-ignore */
      ...(filter.categoryName
        ? [
          {
            match: {
              categoryName: filter.categoryName,
            },
          },
        ]
        : []),
      /* prettier-ignore */
      ...(filter.subcategoryName
        ? [
          {
            match: {
              subcategoryName: filter.subcategoryName,
            },
          },
        ]
        : []),
    ];

    if (!filter.groupBy) {
      if (filter.productName) {
        query.bool.should = [
          {
            match: {
              productName: {
                boost: 80,
                query: filter.productName,
                fuzziness: 2,
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
    } else {
      collapse.field = `${filter.groupBy}.keyword`;

      if (filter.groupBy === 'subcategoryName' && filter.categoryName?.toUpperCase() === 'PAKAN') {
        sort.push({
          order: {
            order: 'asc',
          },
        });
      }
    }

    let minScore = 0;
    if (filter.productName) {
      minScore = esEnv.ES_PRODUCT_MIN_SCORE;
    }

    const size = filter.$limit || 50;
    const from = (filter.$page && (filter.$page - 1) * (filter.$limit || 50)) || 0;

    const results = await this.productESDAO.search(size, from, query, collapse, sort, minScore);

    const products = results.hits.reduce((prev, hit) => {
      if (!hit?._source) return prev;

      let product = hit?._source;

      if (filter.groupBy === 'subcategoryName') {
        product = {
          ...product,
          productCode: product.subcategoryCode,
          productName: product.subcategoryName,
        };
      } else if (filter.groupBy === 'categoryName') {
        product = {
          ...product,
          productCode: product.categoryCode,
          productName: product.categoryName,
        };
      }

      return [...prev, mapProductResponse(product)];
    }, [] as InternalUpsertProductItem[]);

    const count = (results.total as SearchTotalHits).value;

    return [products, count];
  }

  async reindex() {
    await this.reindexQueue.addJob();
  }
}
