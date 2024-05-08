/* eslint-disable no-unused-vars */
import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import * as Mustache from 'mustache';
import { randomUUID } from 'crypto';
import { DeepPartial } from 'typeorm';
import { mapMetadataToTemplatePayload } from '../../libs/utils/mappers';
import { DocumentDAO } from '../../dao/document.dao';
import { DOCUMENT_TYPE, GENERATED_DOCUMENT_MODULE } from '../../libs/constants';
import { DocumentService } from '../../services/document.service';
import { Logger } from '../../libs/utils/logger';
import { Document } from '../../datasources/entity/pgsql/Document.entity';
import { QUEUE_GENERATE_DOCUMENT } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';
import { HarvestRealizationService } from '../../services/harvestRealization.service';
import { SMARTSCALE_WEIGHING_HARVEST_TEMPLATE_STRING } from '../../libs/templates/smartscale-weighing-harvest';

@Service()
export class GenerateDocumentWorker extends BaseWorker<Partial<Document>> {
  @Inject(DocumentDAO)
  private documentDAO: DocumentDAO;

  @Inject(DocumentService)
  private documentService: DocumentService;

  @Inject(HarvestRealizationService)
  private harvestRealizationService: HarvestRealizationService;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GENERATE_DOCUMENT;

  protected async handle(data: DeepPartial<Document>) {
    try {
      if (data.identifierKey === GENERATED_DOCUMENT_MODULE.HARVEST_REALIZATION) {
        await this.generateDocumentHarvestRealization(
          data.identifierKey,
          data.identifierValue as string,
          data.createdBy as string,
        );
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }

  private async generateDocumentHarvestRealization(
    identifierKey: string,
    identifierValue: string,
    userId: string,
  ) {
    try {
      const [, count] = await this.documentDAO.getMany({
        where: {
          identifierKey,
          identifierValue,
        },
      });

      const metadata = await this.harvestRealizationService.getHarvestRealizationDetail({
        harvestRealizationId: identifierValue,
      });

      const transformedMetadata = mapMetadataToTemplatePayload(
        metadata,
        GENERATED_DOCUMENT_MODULE.HARVEST_REALIZATION,
      );

      const html: string = Mustache.render(
        SMARTSCALE_WEIGHING_HARVEST_TEMPLATE_STRING,
        transformedMetadata,
      );

      const docUri: string = await this.documentService.generateDocumentPdf(html);

      const idDoc = randomUUID();
      const newDocs: Partial<Document> = {
        id: idDoc,
        name: `${idDoc}.${DOCUMENT_TYPE.PDF}`,
        type: DOCUMENT_TYPE.PDF,
        version: count + 1,
        identifierKey,
        identifierValue,
        url: docUri,
      };

      const result = await this.documentDAO.createOne(newDocs, { id: userId, role: '' });

      return result;
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
