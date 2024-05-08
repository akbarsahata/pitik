import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  TicketingAssignBodyPayload,
  ticketingAssignPayloadDTO,
  TicketingBoydPayload,
  TicketingParams,
  ticketingParamsDTO,
  ticketingPayloadDTO,
  TicketingQuery,
  ticketingQueryDTO,
  TicketingResponse,
  TicketingResponseCreate,
  ticketingResponseCreateDTO,
  ticketingResponseDTO,
  TicketingResponseItem,
  TicketingResponseList,
  ticketingResponseListDTO,
  ticketingResponseOneDTO,
} from '../../dto/iotTicketing.dto';
import { IotTicketingService } from '../../services/iotTicketing.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetTicketingListRequest = FastifyRequest<{
  Querystring: TicketingQuery;
}>;

@Controller({
  route: '/iot-ticketing',
  type: 0,
  tags: [{ name: '/iot-ticketing' }],
})
export class IotTicketingController {
  @Inject(IotTicketingService)
  private service!: IotTicketingService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: ticketingQueryDTO,
        response: { 200: ticketingResponseListDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getTicketingList(request: GetTicketingListRequest): Promise<TicketingResponseList> {
    const results = await this.service.getAll(request.query);

    return results;
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: ticketingPayloadDTO,
        response: { 200: ticketingResponseCreateDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async createTicket(
    request: FastifyRequest<{
      Body: TicketingBoydPayload;
    }>,
  ): Promise<TicketingResponseCreate> {
    const newTicket = await this.service.createOne(request.body, request.user);

    return {
      code: 200,
      data: newTicket,
    };
  }

  @PATCH({
    url: '/:id',
    options: {
      schema: {
        body: ticketingPayloadDTO,
        response: { 200: ticketingResponseDTO },
        params: ticketingParamsDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async updateTicket(
    request: FastifyRequest<{
      Body: TicketingBoydPayload;
      Params: TicketingParams;
    }>,
  ): Promise<TicketingResponse> {
    const updatedTicket = await this.service.updateOne(
      request.body,
      request.params.id,
      request.user,
    );

    return {
      code: 200,
      data: updatedTicket,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        response: { 200: ticketingResponseOneDTO },
        params: ticketingParamsDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async getOneTicket(
    request: FastifyRequest<{
      Params: TicketingParams;
    }>,
  ): Promise<TicketingResponseItem> {
    const updatedTicket = await this.service.getOne(request.params.id);

    return {
      code: 200,
      data: updatedTicket,
    };
  }

  @PATCH({
    url: '/assign/:id',
    options: {
      schema: {
        body: ticketingAssignPayloadDTO,
        response: { 200: ticketingResponseDTO },
        params: ticketingParamsDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async assignPIC(
    request: FastifyRequest<{
      Body: TicketingAssignBodyPayload;
      Params: TicketingParams;
    }>,
  ): Promise<TicketingResponse> {
    const assigned = await this.service.assignTicket(request.body, request.params.id, request.user);

    return {
      code: 200,
      data: assigned,
    };
  }

  @PATCH({
    url: '/unassign/:id',
    options: {
      schema: {
        response: { 200: ticketingResponseDTO },
        params: ticketingParamsDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async unAssignPIC(
    request: FastifyRequest<{
      Params: TicketingParams;
    }>,
  ): Promise<TicketingResponse> {
    const assigned = await this.service.unAssignTicket(request.params.id, request.user);

    return {
      code: 200,
      data: assigned,
    };
  }
}
