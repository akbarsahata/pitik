import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Service } from 'fastify-decorators';
import { env } from 'process';
import { launch } from 'puppeteer';
import { AWSS3 } from '../libs/utils/awsS3';
import { DocumentDAO } from '../dao/document.dao';
import { Document } from '../datasources/entity/pgsql/Document.entity';
import { GetDocumentByIdentifierKeyValueRequestParams } from '../dto/document.dto';
import { UploadFolderEnum } from '../dto/upload.dto';

@Service()
export class DocumentService {
  @Inject(DocumentDAO)
  private documentDAO: DocumentDAO;

  @Inject(AWSS3)
  private s3: AWSS3;

  async getDocumentByIdentifierKeyValue(
    params: GetDocumentByIdentifierKeyValueRequestParams,
  ): Promise<Document> {
    const document = await this.documentDAO.getOneStrict({
      where: {
        identifierKey: params.identifierKey,
        identifierValue: params.identifierValue,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    return document;
  }

  async generateDocumentPdf(htmlTemplate: string): Promise<string> {
    const browser = await launch({ headless: true });

    const page = await browser.newPage();

    await page.setContent(htmlTemplate);

    const pdf: Buffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '0.5cm',
        right: '1cm',
        bottom: '0.8cm',
        left: '1cm',
      },
      printBackground: true,
    });

    const uri = await this.uploadToS3(
      pdf,
      UploadFolderEnum.SMARTSCALE_WEIGHING_HARVEST,
      'application/pdf',
    );

    await browser.close();

    return uri;
  }

  async uploadToS3(data: Buffer, folder: UploadFolderEnum, mimetype: string): Promise<string> {
    const key = DocumentService.generateS3ObjectKey(folder, mimetype);

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

  private static generateS3ObjectKey(folder: string, mimetype: string): string {
    const [filetype, fileformat] = mimetype.split('/');

    const filename = `${folder}-${Date.now()}.${fileformat}`;

    return `${folder}/${filetype}s/${filename}`;
  }
}
