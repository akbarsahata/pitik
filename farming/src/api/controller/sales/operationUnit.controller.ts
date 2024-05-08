import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  OperationUnitCategoryEnum,
  OperationUnitTypeEnum,
} from '../../../datasources/entity/pgsql/sales/OperationUnit.entity';
import {
  CreateCheckInBody,
  createCheckInBodyDTO,
  CreateCheckInResponse,
  createCheckInResponseDTO,
  CreateSalesOperationUnitBody,
  createSalesOperationUnitBodyDTO,
  CreateSalesOperationUnitResponse,
  createSalesOperationUnitResponseDTO,
  GetLatestStockQuery,
  getLatestStockQueryDTO,
  GetSalesOperationUnitByIdParams,
  getSalesOperationUnitByIdParamsDTO,
  GetSalesOperationUnitByIdResponse,
  getSalesOperationUnitByIdResponseDTO,
  GetSalesOperationUnitsQuery,
  getSalesOperationUnitsQueryDTO,
  GetSalesOperationUnitsResponse,
  getSalesOperationUnitsResponseDTO,
  jagalBodyExternalItemDTO,
  jagalBodyInternalItemDTO,
  LatestStockResponse,
  latestStockResponseDTO,
  UpdateSalesOperationUnitBody,
  updateSalesOperationUnitBodyDTO,
  UpdateSalesOperationUnitParams,
  updateSalesOperationUnitParamsDTO,
  UpdateSalesOperationUnitResponse,
  updateSalesOperationUnitResponseDTO,
} from '../../../dto/sales/operationUnit.dto';
import { ERR_INVALID_TYPE_OPERATION_PAYLOAD } from '../../../libs/constants/errors';
import { validateType } from '../../../libs/utils/helpers';
import { Logger } from '../../../libs/utils/logger';
import { OperationUnitsService } from '../../../services/sales/operationUnit.sales.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/operation-units',
  type: 0,
  tags: [{ name: 'sales-operation-units' }],
})
export class OperationUnitController {
  @Inject(Logger)
  private logger: Logger;

  @Inject(OperationUnitsService)
  private service: OperationUnitsService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesOperationUnitsQueryDTO,
        response: {
          200: getSalesOperationUnitsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesOperationUnitsQuery;
    }>,
  ): Promise<GetSalesOperationUnitsResponse> {
    const [data, count] = await this.service.get(req.query, req.user, req.appId);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:operationUnitId',
    options: {
      schema: {
        params: getSalesOperationUnitByIdParamsDTO,
        response: {
          200: getSalesOperationUnitByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesOperationUnitByIdParams;
    }>,
  ): Promise<GetSalesOperationUnitByIdResponse> {
    const data = await this.service.getById(req.params.operationUnitId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesOperationUnitBodyDTO,
        response: {
          201: createSalesOperationUnitResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesOperationUnitBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesOperationUnitResponse> {
    if (req.body.type === OperationUnitTypeEnum.JAGAL) {
      if (!req.body.jagalData) {
        this.logger.info('Missing jagal data');
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Jagal data is required!');
      }
      const validateError =
        req.body.category === OperationUnitCategoryEnum.INTERNAL
          ? validateType(jagalBodyInternalItemDTO, req.body.jagalData)
          : validateType(jagalBodyExternalItemDTO, req.body.jagalData);
      if (validateError) {
        this.logger.info(validateError);
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD(validateError);
      }

      if (req.body.category === OperationUnitCategoryEnum.INTERNAL && !req.body.productionTeams) {
        this.logger.info('Missing production teams property');
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Missing production teams property');
      }
    }

    if (!req.body.innardsPrice || !req.body.headPrice || !req.body.feetPrice) {
      if (
        req.body.type !== OperationUnitTypeEnum.JAGAL ||
        req.body.category !== OperationUnitCategoryEnum.EXTERNAL
      ) {
        this.logger.info('Missing inventory prices property');
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Missing inventory prices property');
      }
    }

    if (
      req.body.type === OperationUnitTypeEnum.LAPAK &&
      req.body.category === OperationUnitCategoryEnum.INTERNAL &&
      !req.body.productionTeams
    ) {
      this.logger.info('Missing production teams property');
      throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Missing production teams property');
    }

    const data = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:operationUnitId',
    options: {
      schema: {
        params: updateSalesOperationUnitParamsDTO,
        body: updateSalesOperationUnitBodyDTO,
        response: {
          200: updateSalesOperationUnitResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: UpdateSalesOperationUnitParams;
      Body: UpdateSalesOperationUnitBody;
    }>,
  ): Promise<UpdateSalesOperationUnitResponse> {
    if (req.body.type === OperationUnitTypeEnum.JAGAL) {
      if (!req.body.jagalData) {
        this.logger.info('Missing jagal data');
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Jagal data is required!');
      }
      const validateError =
        req.body.category === OperationUnitCategoryEnum.INTERNAL
          ? validateType(jagalBodyInternalItemDTO, req.body.jagalData)
          : validateType(jagalBodyExternalItemDTO, req.body.jagalData);
      if (validateError) {
        this.logger.info(validateError);
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD(validateError);
      }
    }

    if (!req.body.innardsPrice || !req.body.headPrice || !req.body.feetPrice) {
      if (
        req.body.type !== OperationUnitTypeEnum.JAGAL ||
        req.body.category !== OperationUnitCategoryEnum.EXTERNAL
      ) {
        this.logger.info('Missing inventory prices property');
        throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Missing inventory prices property');
      }
    }

    const data = await this.service.update(req.user, req.body, req.params.operationUnitId);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:operationUnitId/latest-stocks',
    options: {
      schema: {
        params: getSalesOperationUnitByIdParamsDTO,
        querystring: getLatestStockQueryDTO,
        response: {
          200: latestStockResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async latestStocks(
    req: FastifyRequest<{
      Params: GetSalesOperationUnitByIdParams;
      Querystring: GetLatestStockQuery;
    }>,
  ): Promise<LatestStockResponse> {
    const [stocks, count] = await this.service.latestStocks(req);

    return {
      code: 200,
      count,
      data: stocks,
    };
  }

  @POST({
    url: '/:operationUnitId/check-in',
    options: {
      schema: {
        params: updateSalesOperationUnitParamsDTO,
        body: createCheckInBodyDTO,
        response: {
          200: createCheckInResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async checkIn(
    req: FastifyRequest<{
      Params: UpdateSalesOperationUnitParams;
      Body: CreateCheckInBody;
    }>,
  ): Promise<CreateCheckInResponse> {
    const distance = await this.service.checkIn(req.params.operationUnitId, req.body);

    return {
      code: 200,
      data: {
        distance,
      },
    };
  }
}
