import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateB2BSmartScaleWeighingBody,
  createB2BSmartScaleWeighingBodyDTO,
  CreateB2BSmartScaleWeighingResponse,
  createB2BSmartScaleWeighingResponseDTO,
  GetB2BSmartScaleWeighingDetailsParams,
  getB2BSmartScaleWeighingDetailsParamsDTO,
  GetB2BSmartScaleWeighingDetailsResponse,
  getB2BSmartScaleWeighingDetailsResponseDTO,
  GetB2BSmartScaleWeighingsQuery,
  getB2BSmartScaleWeighingsQueryDTO,
  GetB2BSmartScaleWeighingsResponse,
  getB2BSmartScaleWeighingsResponseDTO,
  UpdateB2BSmartScaleWeighingBody,
  updateB2BSmartScaleWeighingBodyDTO,
  UpdateB2BSmartScaleWeighingParams,
  updateB2BSmartScaleWeighingParamsDTO,
  UpdateB2BSmartScaleWeighingResponse,
  updateB2BSmartScaleWeighingResponseDTO,
} from '../../../dto/b2b/b2b.smartScaleWeighing.dto';
import { B2BSmartScaleWeighingService } from '../../../services/b2b/b2b.smartScaleWeighing.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({ route: '/b2b/weighing' })
export class B2BSmartScaleWeighingController {
  @Inject(B2BSmartScaleWeighingService)
  private b2bSmartScaleWeighingsService: B2BSmartScaleWeighingService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getB2BSmartScaleWeighingsQueryDTO,
        response: { 200: getB2BSmartScaleWeighingsResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BSmartScaleWeighings(
    req: FastifyRequest<{ Querystring: GetB2BSmartScaleWeighingsQuery }>,
  ): Promise<GetB2BSmartScaleWeighingsResponse> {
    const data = await this.b2bSmartScaleWeighingsService.getB2BSmartScaleWeighings({
      filter: req.query,
    });

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:weighingId',
    options: {
      schema: {
        params: getB2BSmartScaleWeighingDetailsParamsDTO,
        response: { 200: getB2BSmartScaleWeighingDetailsResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BSmartScaleWeighingDetails(
    req: FastifyRequest<{ Params: GetB2BSmartScaleWeighingDetailsParams }>,
  ): Promise<GetB2BSmartScaleWeighingDetailsResponse> {
    const data = await this.b2bSmartScaleWeighingsService.getB2BSmartScaleWeighingDetails({
      params: req.params,
    });

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createB2BSmartScaleWeighingBodyDTO,
        response: { 200: createB2BSmartScaleWeighingResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async createB2BSmartScaleWeighing(
    req: FastifyRequest<{ Body: CreateB2BSmartScaleWeighingBody }>,
    rep: FastifyReply,
  ): Promise<CreateB2BSmartScaleWeighingResponse> {
    const data = await this.b2bSmartScaleWeighingsService.createB2BSmartScaleWeighing({
      body: req.body,
      user: req.user,
    });

    rep.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:weighingId',
    options: {
      schema: {
        params: updateB2BSmartScaleWeighingParamsDTO,
        body: updateB2BSmartScaleWeighingBodyDTO,
        response: { 200: updateB2BSmartScaleWeighingResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateB2BSmartScaleWeighing(
    req: FastifyRequest<{
      Params: UpdateB2BSmartScaleWeighingParams;
      Body: UpdateB2BSmartScaleWeighingBody;
    }>,
  ): Promise<UpdateB2BSmartScaleWeighingResponse> {
    const data = await this.b2bSmartScaleWeighingsService.updateB2BSmartScaleWeighing({
      weighingId: req.params.weighingId,
      body: req.body,
      user: req.user,
    });

    return {
      code: 200,
      data,
    };
  }
}
