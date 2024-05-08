import { addDays } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateB2BSmartMonitoringBody,
  createB2BSmartMonitoringDTO,
  CreateB2BSmartMonitoringResponse,
  createB2BSmartMonitoringResponseDTO,
  EditB2BIotDeviceBody,
  editB2BIotDeviceBodyDTO,
  EditB2BIotDeviceParam,
  editB2BIotDeviceParamDTO,
  EditB2BIotDeviceResponse,
  editB2BIotDeviceResponseDTO,
  EditB2BSmartMonitoringBody,
  editB2BSmartMonitoringBodyDTO,
  EditB2BSmartMonitoringParam,
  editB2BSmartMonitoringParamDTO,
  EditB2BSmartMonitoringResponse,
  editB2BSmartMonitoringResponseDTO,
  GetB2BSmartMonitoringHistoricalParam,
  getB2BSmartMonitoringHistoricalParamDTO,
  GetB2BSmartMonitoringHistoricalQuery,
  getB2BSmartMonitoringHistoricalQueryDTO,
  GetB2BSmartMonitoringHistoricalResponse,
  getB2BSmartMonitoringHistoricalResponseDTO,
  GetB2BSmartMonitoringParam,
  getB2BSmartMonitoringParamDTO,
  GetB2BSmartMonitoringResponse,
  getB2BSmartMonitoringResponseDTO,
  getSmartMonitoringLatestConditionDTO,
  GetSmartMonitoringLatestConditionParam,
  GetSmartMonitoringLatestConditionQuery,
  getSmartMonitoringLatestConditionQueryDTO,
  GetSmartMonitoringLatestConditionResponse,
  getSmartMonitoringLatestConditionResponseDTO,
  ReRegisterB2BSmartMonitoringParam,
  reRegisterB2BSmartMonitoringParamDTO,
  ReRegisterB2BSmartMonitoringResponse,
  reRegisterB2BSmartMonitoringResponseDTO,
} from '../../../dto/b2b/b2b.iotDevice.dto';
import { ERR_BAD_REQUEST } from '../../../libs/constants/errors';
import { formatIotHistoricalData } from '../../../libs/utils/helpers';
import { B2BIotDeviceService } from '../../../services/b2b/b2b.iotDevice.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/iot-devices/smart-monitoring',
  type: 0,
  tags: [{ name: 'b2b-iot-devices-smart-monitoring' }],
})
export class B2BSmartMonitoringController {
  @Inject(B2BIotDeviceService)
  private service!: B2BIotDeviceService;

  @POST({
    url: '/register',
    options: {
      schema: {
        body: createB2BSmartMonitoringDTO,
        response: {
          '2xx': createB2BSmartMonitoringResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createB2BSmartMonitoring(
    req: FastifyRequest<{
      Body: CreateB2BSmartMonitoringBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateB2BSmartMonitoringResponse> {
    const data = await this.service.createB2BSmartMonitoring(req.body, req.user);

    reply.code(201);

    return {
      code: 201,
      data,
    };
  }

  @GET({
    url: '/:deviceId',
    options: {
      schema: {
        params: getB2BSmartMonitoringParamDTO,
        response: {
          200: getB2BSmartMonitoringResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BSmartMonitoring(
    req: FastifyRequest<{
      Params: GetB2BSmartMonitoringParam;
    }>,
  ): Promise<GetB2BSmartMonitoringResponse> {
    const data = await this.service.getB2BSmartMonitoring(req.params, req.user);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:deviceId/edit',
    options: {
      schema: {
        params: editB2BSmartMonitoringParamDTO,
        body: editB2BSmartMonitoringBodyDTO,
        response: {
          200: editB2BSmartMonitoringResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async editB2BSmartMonitoring(
    req: FastifyRequest<{
      Params: EditB2BSmartMonitoringParam;
      Body: EditB2BSmartMonitoringBody;
    }>,
  ): Promise<EditB2BSmartMonitoringResponse> {
    const data = await this.service.editB2BSmartMonitoring(req.params, req.body, req.user);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:deviceId/rename',
    options: {
      schema: {
        params: editB2BIotDeviceParamDTO,
        body: editB2BIotDeviceBodyDTO,
        response: {
          200: editB2BIotDeviceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async renameB2BSmartMonitoring(
    req: FastifyRequest<{
      Params: EditB2BIotDeviceParam;
      Body: EditB2BIotDeviceBody;
    }>,
  ): Promise<EditB2BIotDeviceResponse> {
    const data = await this.service.renameB2BSmartMonitoring(req.params, req.body, req.user);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:deviceId/re-register',
    options: {
      schema: {
        params: reRegisterB2BSmartMonitoringParamDTO,
        response: {
          200: reRegisterB2BSmartMonitoringResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async reRegisterB2BSmartMonitoring(
    req: FastifyRequest<{
      Params: ReRegisterB2BSmartMonitoringParam;
    }>,
  ): Promise<ReRegisterB2BSmartMonitoringResponse> {
    await this.service.reRegisterB2BSmartMonitoring(req.params, req.user);

    return {
      code: 200,
      data: { message: 'Re-Register device success' },
    };
  }

  @GET({
    url: '/:deviceId/latest-conditions',
    options: {
      schema: {
        params: getSmartMonitoringLatestConditionDTO,
        querystring: getSmartMonitoringLatestConditionQueryDTO,
        response: {
          200: getSmartMonitoringLatestConditionResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSmartMonitoringLatestCondition(
    req: FastifyRequest<{
      Params: GetSmartMonitoringLatestConditionParam;
      Querystring: GetSmartMonitoringLatestConditionQuery;
    }>,
  ): Promise<GetSmartMonitoringLatestConditionResponse> {
    const data = await this.service.getSmartMonitoringLatestCondition(
      req.params,
      req.query,
      req.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:deviceId/historical',
    options: {
      schema: {
        params: getB2BSmartMonitoringHistoricalParamDTO,
        querystring: getB2BSmartMonitoringHistoricalQueryDTO,
        response: {
          200: getB2BSmartMonitoringHistoricalResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BSmartMonitoringHistorical(
    req: FastifyRequest<{
      Params: GetB2BSmartMonitoringHistoricalParam;
      Querystring: GetB2BSmartMonitoringHistoricalQuery;
    }>,
  ): Promise<GetB2BSmartMonitoringHistoricalResponse> {
    if ((req.query.from && !req.query.to) || (!req.query.from && req.query.to)) {
      throw ERR_BAD_REQUEST('From and To must present together or not at all');
    }

    if (req.query.days && Number(req.query.days) > 0) {
      this.overrideFromToQuery(req.query);
    }

    let from = req.query.from ? new Date(req.query.from) : new Date();
    if (req.query.days === '-1') {
      const currentDate = new Date();
      from = new Date(currentDate);
      from.setDate(currentDate.getDate() - 90);
    }

    const to = req.query.to ? new Date(req.query.to) : new Date();

    const data = await this.service.getB2BSmartMonitoringHistorical(
      req.params,
      req.query,
      from,
      to,
    );

    return {
      code: 200,
      data: formatIotHistoricalData(req.query.days, data, from as Date, to as Date),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  overrideFromToQuery(req: GetB2BSmartMonitoringHistoricalQuery): void {
    const today = new Date();
    const days = req.days ? Number(req.days) : 1;

    req.from = addDays(today, -1 * days).toISOString();
    req.to = today.toISOString();
  }
}
