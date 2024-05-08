import { S3Client } from '@aws-sdk/client-s3';
import { Initializer, Service } from 'fastify-decorators';
import env from '../../config/env';

@Service()
export class AWSS3 {
  client: S3Client;

  @Initializer()
  async init() {
    this.client = new S3Client({
      region: env.AWS_DEFAULT_REGION,
    });
  }
}
