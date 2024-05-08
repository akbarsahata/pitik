import { addDays } from 'date-fns';
import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetConventronByCoopIdParams,
  getConventronByCoopIdParamsDTO,
  GetConventronByCoopIdResponse,
  GetConventronHistoricalQuery,
  getConventronHistoricalQueryStringDTO,
  GetConventronHistoricalResponse,
  GetConventronSummaryQueryString,
  getConventronSummaryQueryStringDTO,
  GetConventronSummaryResponse,
} from '../../dto/smartConventron.dto';
import { ERR_AUTH_FORBIDDEN, ERR_BAD_REQUEST } from '../../libs/constants/errors';
import { formatIotHistoricalData } from '../../libs/utils/helpers';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { SmartConventronService } from '../../services/smartConventron.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

export type GetConventronHistoricalRequest = FastifyRequest<{
  Querystring: GetConventronHistoricalQuery;
}>;

@Controller({
  route: '/smart-conventron',
  type: 0,
  tags: [{ name: 'smart-conventron' }],
})
export class SmartConventronController {
  @Inject(SmartConventronService)
  private service!: SmartConventronService;

  @Inject(FarmingCycleService)
  private farmingCycleService!: FarmingCycleService;

  @GET({
    url: '/summary',
    options: {
      schema: {
        querystring: getConventronSummaryQueryStringDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async getConventronSummary(
    request: FastifyRequest<{
      Querystring: GetConventronSummaryQueryString;
    }>,
  ): Promise<GetConventronSummaryResponse> {
    const summary = await this.service.getConventronSummary(request.query.deviceId);

    return {
      code: 200,
      data: summary,
    };
  }

  @GET({
    url: '/coops/:coopId',
    options: {
      schema: {
        params: getConventronByCoopIdParamsDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async getConventronByCoopId(
    request: FastifyRequest<{
      Params: GetConventronByCoopIdParams;
    }>,
  ): Promise<GetConventronByCoopIdResponse> {
    const [result, count] = await this.service.getConventronByCoopId(request.params.coopId);

    return {
      code: 200,
      count,
      data: result,
    };
  }

  @GET({
    url: '/historical',
    options: {
      schema: {
        querystring: getConventronHistoricalQueryStringDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async getConventronHistorical(
    request: GetConventronHistoricalRequest,
  ): Promise<GetConventronHistoricalResponse> {
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

    const data = await this.service.getConventronHistorical(request.query, from, to);

    return {
      code: 200,
      data: formatIotHistoricalData(request.query.days, data, from as Date, to as Date),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  overrideFromToQuery(request: GetConventronHistoricalRequest): void {
    const today = new Date();
    const days = request.query.days ? Number(request.query.days) : 1;

    request.query.from = addDays(today, -1 * days).toISOString();
    request.query.to = today.toISOString();
  }
}
