import { addDays } from 'date-fns';
import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetSensorQuery,
  SensorHistoricalParsedResponse,
  sensorHistoricalParsedResponseDTO,
  SensorHistoricalQuery,
  sensorHistoricalQueryDTO,
  SensorLatestConditionQuery,
  sensorLatestConditionQueryDTO,
  sensorLatestConditionResponseDTO,
  sensorListQueryDTO,
  SensorListResponse,
  sensorListResponseDTO,
} from '../../dto/sensor.dto';
import { ERR_AUTH_FORBIDDEN, ERR_BAD_REQUEST } from '../../libs/constants/errors';
import { formatIotHistoricalData } from '../../libs/utils/helpers';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { SensorService } from '../../services/sensor.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

export type SensorLatestConditionRequest = FastifyRequest<{
  Querystring: SensorLatestConditionQuery;
}>;

export type GetSensorRequest = FastifyRequest<{
  Querystring: GetSensorQuery;
}>;

export type SensorHistoricalRequest = FastifyRequest<{
  Querystring: SensorHistoricalQuery;
}>;

@Controller({
  route: '/sensor',
  type: 0,
  tags: [{ name: 'sensor' }],
})
export class SensorController {
  @Inject(SensorService)
  private service!: SensorService;

  @Inject(FarmingCycleService)
  private farmingCycleService!: FarmingCycleService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: sensorListQueryDTO,
        response: {
          200: sensorListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSensorList(request: GetSensorRequest): Promise<SensorListResponse> {
    const [data, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/latest-condition',
    options: {
      schema: {
        querystring: sensorLatestConditionQueryDTO,
        response: {
          200: sensorLatestConditionResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmSensorLatestCondition(request: SensorLatestConditionRequest) {
    const ownFarmingCycle = await this.farmingCycleService.checkFarmingCycleOwnership(
      request.query.farmingCycleId,
      request.user.id,
    );

    if (!ownFarmingCycle) {
      throw ERR_AUTH_FORBIDDEN('not farming cycle member');
    }

    const data = await this.service.getCoopSensorLatestCondition(request.query);

    return { data };
  }

  @GET({
    url: '/historical',
    options: {
      schema: {
        querystring: sensorHistoricalQueryDTO,
        response: {
          200: sensorHistoricalParsedResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmSensorHistorical(
    request: SensorHistoricalRequest,
  ): Promise<SensorHistoricalParsedResponse> {
    if ((request.query.from && !request.query.to) || (!request.query.from && request.query.to)) {
      throw ERR_BAD_REQUEST('From and To must present together or not at all');
    }

    const ownFarmingCycle = await this.farmingCycleService.checkFarmingCycleOwnership(
      request.query.farmingCycleId,
      request.user.id,
    );

    if (!ownFarmingCycle) {
      throw ERR_AUTH_FORBIDDEN('not farming cycle member');
    }

    const farmingCycle = await this.farmingCycleService.getFarmingCycleById(
      request.query.farmingCycleId,
    );

    if (request.query.days && Number(request.query.days) > 0) {
      this.overrideFromToQuery(request);
    }

    const from = request.query.from
      ? new Date(request.query.from)
      : new Date(farmingCycle.farmingCycleStartDate);
    const to = request.query.to ? new Date(request.query.to) : new Date();

    const data = await this.service.getCoopSensorHistorical(request.query, from, to);

    return {
      code: 200,
      data: formatIotHistoricalData(request.query.days, data, from as Date, to as Date),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  overrideFromToQuery(request: SensorHistoricalRequest): void {
    const today = new Date();
    const days = request.query.days ? Number(request.query.days) : 1;

    request.query.from = addDays(today, -1 * days).toISOString();
    request.query.to = today.toISOString();
  }
}
