import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateWeighingBody,
  createWeighingBodyDTO,
  CreateWeighingResponse,
  createWeighingResponseDTO,
  WeighingDetailParams,
  weighingDetailParamsDTO,
  WeighingDetailResponse,
  weighingDetailResponseDTO,
  WeighingListParams,
  weighingListParamsDTO,
  WeighingListResponse,
  weighingListResponseDTO,
} from '../../dto/smartScaleWeighing.dto';
import { SmartScaleWeighingService } from '../../services/smartScaleWeighing.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetWeighingListRequest = FastifyRequest<{
  Params: WeighingListParams;
}>;

type GetWeighingDetailRequest = FastifyRequest<{
  Params: WeighingDetailParams;
}>;

type CreateWeighingRequest = FastifyRequest<{
  Params: WeighingListParams;
  Body: CreateWeighingBody;
}>;

@Controller({
  route: '/smart-scale',
  type: 0,
  tags: [{ name: 'smart-scale' }],
})
export class SmartScaleController {
  @Inject(SmartScaleWeighingService)
  private service!: SmartScaleWeighingService;

  @GET({
    url: '/weighing/:farmingCycleId',
    options: {
      schema: {
        params: weighingListParamsDTO,
        response: { 200: weighingListResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getWeighingList(request: GetWeighingListRequest): Promise<WeighingListResponse> {
    return this.service.getList(request.params.farmingCycleId);
  }

  @GET({
    url: '/weighing/:farmingCycleId/dates/:date',
    options: {
      schema: {
        params: weighingDetailParamsDTO,
        response: { 200: weighingDetailResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getWeighingDetail(request: GetWeighingDetailRequest): Promise<WeighingDetailResponse> {
    return this.service.getWeighingDetail(request.params.farmingCycleId, request.params.date);
  }

  @POST({
    url: '/weighing/:farmingCycleId',
    options: {
      schema: {
        body: createWeighingBodyDTO,
        response: { 200: createWeighingResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async storeWeighingData(request: CreateWeighingRequest): Promise<CreateWeighingResponse> {
    return this.service.createWeighing(request.body, request.params.farmingCycleId, request.user);
  }
}
