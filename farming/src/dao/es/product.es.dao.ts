import {
  float,
  integer,
  QueryDslQueryContainer,
  SearchFieldCollapse,
  SearchHitsMetadata,
  SearchResponse,
  Sort,
} from '@elastic/elasticsearch/api/types.d';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { Product as ProductES } from '../../datasources/entity/elasticsearch/Product.entity';

const PAKAN_ORDER: { [key: string]: number } = {
  PRESTARTER: 0,
  STARTER: 1,
  FINISHER: 2,
};

@Service()
export class ProductESDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

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

  async reindex(docs: ProductES[]): Promise<void> {
    await this.es.client.indices.delete({
      index: esEnv.ES_IDX_PRODUCT,
      ignore_unavailable: true,
      allow_no_indices: true,
    });

    await Promise.all(docs.map<Promise<void>>((doc) => this.upsertDocument(doc)));
  }

  async getProductByProductName(productName: string): Promise<ProductES | null> {
    const query: QueryDslQueryContainer = {
      match: {
        productName,
      },
    };

    const body: Record<string, any> = {
      size: 1,
      query,
    };

    const result = await this.es.client.search<SearchResponse<ProductES>>({
      index: esEnv.ES_IDX_PRODUCT,
      body,
    });

    const { hits } = result.body.hits;

    if (hits.length > 0) {
      // eslint-disable-next-line no-underscore-dangle
      return hits[0]._source as ProductES;
    }

    return null;
  }
}
