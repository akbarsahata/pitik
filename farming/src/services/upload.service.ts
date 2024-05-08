import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Service } from 'fastify-decorators';
import env from '../config/env';
import { UploadFolderEnum } from '../dto/upload.dto';
import { AWSS3 } from '../libs/utils/awsS3';
import { GcpCloudStorage } from '../libs/utils/gcpCloudStorage';

@Service()
export class UploadService {
  @Inject(AWSS3)
  private s3: AWSS3;

  @Inject(GcpCloudStorage)
  private gcpCloudStorage: GcpCloudStorage;

  async uploadToS3(
    data: Buffer,
    folder: UploadFolderEnum,
    mimetype: string,
    originalName?: string,
  ): Promise<string> {
    const key = UploadService.generateObjectKey(folder, mimetype, originalName);

    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      ACL: 'public-read',
      Key: key,
      Body: data,
    });

    const result = await this.s3.client.send(command);

    if (!result.$metadata.httpStatusCode || result.$metadata.httpStatusCode >= 400) {
      throw new Error('failed uploading to S3');
    }

    return `${env.AWS_URL}${key}`;
  }

  async uploadToGcpCloudStorage(
    data: Buffer,
    folder: UploadFolderEnum,
    mimetype: string,
    originalName?: string,
  ): Promise<string> {
    try {
      const key = UploadService.generateObjectKey(folder, mimetype, originalName);

      const command = this.gcpCloudStorage.storage.bucket(this.gcpCloudStorage.bucketName);

      await command.file(key).save(data);

      return `${env.GCP_CLOUD_URL}/${env.GCP_CLOUD_STORAGE_BUCKET}/${key}`;
    } catch (error) {
      throw new Error('failed uploading to Cloud Storage');
    }
  }

  private static generateObjectKey(
    folder: string,
    mimetype: string,
    originalName?: string,
  ): string {
    if (mimetype === 'application/octet-stream') {
      return `${folder}/binary/${originalName}`;
    }

    const [filetype, fileformat] = mimetype.split('/');

    const filename = `${folder}-${Date.now()}.${fileformat}`;

    return `${folder}/${filetype}s/${filename}`;
  }
}
