import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Initializer, Service } from 'fastify-decorators';
import env from '../../config/env';

@Service()
export class GcpCloudStorage {
  storage: Storage;

  bucketName: string;

  @Initializer()
  async init() {
    this.storage = new Storage({
      projectId: env.GCP_CLOUD_STORAGE_PROJECT_ID,
      keyFilename: env.GCP_CLOUD_STORAGE_CREDS,
    });
    this.bucketName = env.GCP_CLOUD_STORAGE_BUCKET;
  }

  // eslint-disable-next-line class-methods-use-this
  async generateV4UploadSignedUrl({
    bucket,
    fileName,
  }: {
    bucket: string;
    fileName: string;
    acl?: string | undefined;
  }): Promise<string> {
    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await this.storage.bucket(bucket).file(fileName).getSignedUrl(options);

    return url;
  }
}
