import { Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { QUEUE_GENERATE_DOCUMENT } from '../../libs/constants/queue';
import { Document } from '../../datasources/entity/pgsql/Document.entity';
import { BaseQueue } from './base.queue';

@Service()
export class GenerateDocumentQueue extends BaseQueue<DeepPartial<Document>> {
  protected queueName = QUEUE_GENERATE_DOCUMENT;
}
