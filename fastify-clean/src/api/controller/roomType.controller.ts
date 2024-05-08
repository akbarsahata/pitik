import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetRoomTypesQuery,
  getRoomTypesQueryDTO,
  GetRoomTypesResponse,
  getRoomTypesResponseDTO,
} from '../../dto/roomType.dto';
import { RoomTypeService } from '../../services/roomType.service';

@Controller({
  route: '/room-types',
  type: 0,
  tags: [{ name: 'room-types' }],
})
export class RoomTypeController {
  @Inject(RoomTypeService)
  private service: RoomTypeService;

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
    const roomTypes = await this.service.get(req.query);

    return {
      code: 200,
      data: roomTypes,
    };
  }
}
