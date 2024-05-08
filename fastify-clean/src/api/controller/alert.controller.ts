import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  AlertDetailParams,
  alertDetailParamsDTO,
  AlertDetailResponse,
  alertDetailResponseDTO,
  AlertSummaryParams,
  alertSummaryParamsDTO,
  AlertSummaryQuery,
  alertSummaryQueryDTO,
  AlertSummaryResponse,
  alertSummaryResponseDTO,
  AlertToTaskBody,
  alertToTaskBodyDTO,
  AlertToTaskParams,
  alertToTaskParamsDTO,
  AlertToTaskResponse,
  alertToTaskResponseDTO,
  GetAlertQuery,
  getAlertQueryDTO,
  GetAlertResponse,
  getAlertResponseDTO,
} from '../../dto/alert.dto';
import { AlertService } from '../../services/alert.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetAlertSummaryRequest = FastifyRequest<{
  Querystring: AlertSummaryQuery;
  Params: AlertSummaryParams;
}>;

type GetAlertDetailRequest = FastifyRequest<{
  Params: AlertDetailParams;
}>;

type CreateTaskFromAlertRequest = FastifyRequest<{
  Params: AlertToTaskParams;
  Body: AlertToTaskBody;
}>;

@Controller({
  route: '/alerts',
  type: 0,
  tags: [{ name: 'alerts' }],
})
export class AlertController {
  @Inject(AlertService)
  private service!: AlertService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getAlertQueryDTO,
        response: {
          200: getAlertResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetAlertQuery;
    }>,
  ): Promise<GetAlertResponse> {
    const [alertPresets, count] = await this.service.getAlert(request.query);
    return {
      code: 200,
      count,
      data: alertPresets.map((alertPreset) => ({
        ...alertPreset,
        modifiedBy: alertPreset.userModifier?.fullName || alertPreset.modifiedBy,
        modifiedDate: alertPreset.modifiedDate.toISOString(),
      })),
    };
  }

  @GET({
    url: '/summary/:farmingCycleId',
    options: {
      schema: {
        querystring: alertSummaryQueryDTO,
        params: alertSummaryParamsDTO,
        response: { 200: alertSummaryResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getAlertSummary(request: GetAlertSummaryRequest): Promise<AlertSummaryResponse> {
    const [data, count] = await this.service.getSummary(
      request.params.farmingCycleId,
      request.query.$page,
      request.query.$limit,
    );

    return {
      data,
      count,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: alertDetailParamsDTO,
        response: { 200: alertDetailResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getAlertDetail(request: GetAlertDetailRequest): Promise<AlertDetailResponse> {
    const data = await this.service.getDetail(request.params.id);

    return {
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId',
    options: {
      schema: {
        params: alertToTaskParamsDTO,
        body: alertToTaskBodyDTO,
        response: { 200: alertToTaskResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async createTaskFromAlert(request: CreateTaskFromAlertRequest): Promise<AlertToTaskResponse> {
    const data = await this.service.createTaskFromAlert(
      request.params.farmingCycleId,
      request.body,
      request.user,
    );

    return { data };
  }
}
