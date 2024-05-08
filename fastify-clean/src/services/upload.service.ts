import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Service } from 'fastify-decorators';
import env from '../config/env';
import { UploadFolderEnum } from '../dto/upload.dto';
import { AWSS3 } from '../libs/utils/awsS3';

@Service()
export class UploadService {
  @Inject(AWSS3)
  private s3: AWSS3;

  async uploadToS3(
    data: Buffer,
    folder: UploadFolderEnum,
    mimetype: string,
    originalName?: string,
  ): Promise<string> {
    const key = UploadService.generateS3ObjectKey(folder, mimetype, originalName);

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

  private static generateS3ObjectKey(
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
