import { Inject, Service } from 'fastify-decorators';
import { minutesToMilliseconds } from 'date-fns';
import { RoomType } from '../datasources/entity/pgsql/RoomType.entity';
import { GetRoomTypesQuery } from '../dto/roomType.dto';
import { RoomTypeDAO } from '../dao/roomType.dao';

@Service()
export class RoomTypeService {
  @Inject(RoomTypeDAO)
  private roomTypeDAO: RoomTypeDAO;

  async get(filter: GetRoomTypesQuery): Promise<RoomType[]> {
    const [roomTypes] = await this.roomTypeDAO.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
      },
      cache: minutesToMilliseconds(5),
    });

    return roomTypes;
  }
}
