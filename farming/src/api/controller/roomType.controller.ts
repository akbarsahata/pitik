import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetRoomTypesQuery,
  getRoomTypesQueryDTO,
  GetRoomTypesResponse,
  getRoomTypesResponseDTO,
} from '../../dto/roomType.dto';
import { RoomTypeUsecase } from '../../usecases/roomType.usecase';

@Controller({
  route: '/room-types',
  type: 0,
  tags: [{ name: 'room-types' }],
})
export class RoomTypeController {
  @Inject(RoomTypeUsecase)
  private roomTypeUsecase: RoomTypeUsecase;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getRoomTypesQueryDTO,
        response: {
          200: getRoomTypesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetRoomTypesQuery;
    }>,
  ): Promise<GetRoomTypesResponse> {
    const roomTypes = await this.roomTypeUsecase.get(req.query);

    return {
      code: 200,
      data: roomTypes,
    };
  }
}
