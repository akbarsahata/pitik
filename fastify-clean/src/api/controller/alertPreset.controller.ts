import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import { AlertItem } from '../../dto/alert.dto';
import {
  CreateAlertPresetBody,
  createAlertPresetBodyDTO,
  CreateAlertPresetResponse,
  createAlertPresetResponseDTO,
  GetAlertPresetByIdParams,
  getAlertPresetByIdParamsDTO,
  GetAlertPresetByIdResponse,
  getAlertPresetByIdResponseDTO,
  GetAlertPresetQuery,
  getAlertPresetQueryDTO,
  GetAlertPresetResponse,
  getAlertPresetResponseDTO,
  UpdateAlertPresetBody,
  updateAlertPresetBodyDTO,
  UpdateAlertPresetParams,
  updateAlertPresetParamsDTO,
  UpdateAlertPresetResponse,
  updateAlertPresetResponseDTO,
} from '../../dto/alertPreset.dto';
import { AlertPresetService } from '../../services/alertPreset.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createAlertPresetRequest = FastifyRequest<{
  Body: CreateAlertPresetBody;
}>;

@Controller({
  route: '/alert-presets',
  type: 0,
  tags: [{ name: 'alert-presets' }],
})
export class AlertPresetController {
  @Inject(AlertPresetService)
  private service: AlertPresetService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getAlertPresetQueryDTO,
        response: {
          200: getAlertPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetAlertPresetQuery;
    }>,
  ): Promise<GetAlertPresetResponse> {
    const [alertPresets, count] = await this.service.getMany(request.query);
    return {
      code: 200,
      count,
      data: alertPresets.map((alertPreset) => ({
        ...alertPreset,
        presetType: 'alert',
        coopType: alertPreset.coopType,
        chickType: alertPreset.chickType,
        modifiedDate: alertPreset.modifiedDate && alertPreset.modifiedDate.toISOString(),
        createdDate: alertPreset.createdDate.toISOString(),
        modifiedBy: alertPreset.userModifier?.fullName || alertPreset.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getAlertPresetByIdParamsDTO,
        response: {
          200: getAlertPresetByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getAlertById(
    request: FastifyRequest<{
      Params: GetAlertPresetByIdParams;
    }>,
  ): Promise<GetAlertPresetByIdResponse> {
    const alertPreset = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...alertPreset,
        presetType: 'alert',
        coopType: alertPreset.coopType,
        chickType: alertPreset.chickType,
        alerts: alertPreset.alerts.map<AlertItem>((alertPresetD) => alertPresetD.alert),
        modifiedDate: alertPreset.modifiedDate && alertPreset.modifiedDate.toISOString(),
        createdDate: alertPreset.createdDate.toISOString(),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createAlertPresetBodyDTO,
        response: {
          201: createAlertPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(request: createAlertPresetRequest): Promise<CreateAlertPresetResponse> {
    const alertPreset = await this.service.create(request.body, request.user);

    return {
      code: 201,
      data: {
        ...alertPreset,
        presetType: 'alert',
        createdDate: alertPreset.createdDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateAlertPresetParamsDTO,
        body: updateAlertPresetBodyDTO,
        response: {
          200: updateAlertPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateAlertPresetParams;
      Body: UpdateAlertPresetBody;
    }>,
  ): Promise<UpdateAlertPresetResponse> {
    const alertPreset = await this.service.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...alertPreset,
        presetType: 'alert',
        coopType: alertPreset.coopType,
        chickType: alertPreset.chickType,
        modifiedDate: alertPreset.modifiedDate.toISOString(),
        createdDate: alertPreset.createdDate.toISOString(),
      },
    };
  }
}
