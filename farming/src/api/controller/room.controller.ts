import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateRoomBody,
  createRoomBodyDTO,
  GetRoomByIdParams,
  getRoomByIdParamsDTO,
  GetRoomByIdResponse,
  getRoomByIdResponseDTO,
  GetRoomsQuery,
  getRoomsQueryDTO,
  GetRoomsResponse,
  getRoomsResponseDTO,
  UpdateRoomBody,
  updateRoomBodyDTO,
} from '../../dto/room.dto';
import { RoomService } from '../../services/room.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/rooms',
  type: 0,
  tags: [{ name: 'rooms' }],
})
export class RoomController {
  @Inject(RoomService)
  private service: RoomService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getRoomsQueryDTO,
        response: {
          200: getRoomsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetRoomsQuery;
    }>,
  ): Promise<GetRoomsResponse> {
    const [rooms, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data: rooms,
    };
  }

  @GET({
    url: '/:roomId',
    options: {
      schema: {
        params: getRoomByIdParamsDTO,
        response: {
          200: getRoomByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetRoomByIdParams;
    }>,
  ): Promise<GetRoomByIdResponse> {
    const data = await this.service.getById(req.params.roomId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createRoomBodyDTO,
        response: {
          200: getRoomByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateRoomBody;
    }>,
  ): Promise<GetRoomByIdResponse> {
    const data = await this.service.create(req.user, req.body);

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:roomId',
    options: {
      schema: {
        params: getRoomByIdParamsDTO,
        body: updateRoomBodyDTO,
        response: {
          200: getRoomByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: GetRoomByIdParams;
      Body: UpdateRoomBody;
    }>,
  ): Promise<GetRoomByIdResponse> {
    const data = await this.service.update(req.user, req.body, req.params.roomId);

    return {
      code: 200,
      data,
    };
  }
}
