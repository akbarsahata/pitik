import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  documentResponseDTO,
  getDocumentByIdentifierKeyValueParamsDTO,
  GetDocumentByIdentifierKeyValueRequestParams,
  GetDocumentByIdentifierKeyValueResponse,
} from '../../dto/document.dto';
import { DocumentService } from '../../services/document.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetDocumentByIdentifierKeyValueRequest = FastifyRequest<{
  Params: GetDocumentByIdentifierKeyValueRequestParams;
}>;

@Controller({
  route: '/documents',
  type: 0,
  tags: [{ name: 'documents' }],
})
export class DocumentController {
  @Inject(DocumentService)
  private service!: DocumentService;

  @GET({
    url: '/:identifierKey/:identifierValue',
    options: {
      schema: {
        params: getDocumentByIdentifierKeyValueParamsDTO,
        response: {
          200: documentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDocumentByIdentifierKeyValue(
    request: GetDocumentByIdentifierKeyValueRequest,
  ): Promise<GetDocumentByIdentifierKeyValueResponse> {
    const data = await this.service.getDocumentByIdentifierKeyValue(request.params);

    return {
      code: 200,
      data,
    };
  }
}
