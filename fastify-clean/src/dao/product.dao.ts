import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  float,
  integer,
  QueryDslQueryContainer,
  SearchFieldCollapse,
  SearchHitsMetadata,
  SearchResponse,
  Sort,
} from '@elastic/elasticsearch/api/types.d';
import { Product as ProductES } from '../datasources/entity/elasticsearch/Product.entity';
import { ElasticSearchConnection } from '../datasources/connection/elasticsearch.connection';
import { esEnv } from '../config/datasource';
import { InternalUpsertProductItem, mapProductPayload } from '../dto/product.dto';
import { BaseSQLDAO } from './base.dao';
import { Product } from '../datasources/entity/pgsql/Product.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';

const PAKAN_ORDER: { [key: string]: number } = {
  PRESTARTER: 0,
  STARTER: 1,
  FINISHER: 2,
};

@Service()
export class ProductDAO extends BaseSQLDAO<Product> {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Product);
  }

  async upsertDocument(product: ProductES) {
    const body = {
      ...product,
      modifiedDate: new Date(),
    };

    if (body.categoryCode === 'PAKAN') {
      body.order = PAKAN_ORDER[body.subcategoryCode];
    } else {
      body.order = -1;
    }

    await this.es.client.index({
      index: esEnv.ES_IDX_PRODUCT,
      id: product.id,
      body,
    });
  }

  async search(
    size: integer,
    from: integer,
    query: QueryDslQueryContainer,
    collapse?: SearchFieldCollapse,
    sort?: Sort,
    minScore?: float,
  ): Promise<SearchHitsMetadata<ProductES>> {
    const body: Record<string, any> = {
      size,
      from,
    };

    if (Object.keys(query).length > 0) {
      body.query = query;
    }

    if (collapse && collapse.field) {
      body.collapse = collapse;
    }

    if (sort) {
      body.sort = sort;
    }

    if (minScore) {
      body.min_score = minScore;
    }

    const result = await this.es.client.search<SearchResponse<ProductES>>({
      index: esEnv.ES_IDX_PRODUCT,
      body,
    });

    return result.body.hits;
  }

  async reindex(newDocs: InternalUpsertProductItem[]): Promise<void> {
    await this.es.client.indices.delete({
      index: esEnv.ES_IDX_PRODUCT,
      ignore_unavailable: true,
      allow_no_indices: true,
    });

    await Promise.all(
      newDocs.map<Promise<void>>((newDoc) =>
        this.upsertDocument(mapProductPayload(newDoc) as ProductES),
      ),
    );
  }

  async reindexNew(newDocs: Product[]): Promise<void> {
    await this.es.client.indices.delete({
      index: esEnv.ES_IDX_PRODUCT,
      ignore_unavailable: true,
      allow_no_indices: true,
    });

    await Promise.all(
      newDocs.map<Promise<void>>((newDoc) =>
        this.upsertDocument({
          ...newDoc,
          id: newDoc.id.toString(),
        }),
      ),
    );
  }
}
