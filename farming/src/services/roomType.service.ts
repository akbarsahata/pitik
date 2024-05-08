import { minutesToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { RoomTypeDAO } from '../dao/roomType.dao';
import { RoomType } from '../datasources/entity/pgsql/RoomType.entity';
import { GetRoomTypesQuery } from '../dto/roomType.dto';

@Service()
export class RoomTypeService {
  @Inject(RoomTypeDAO)
  private roomTypeDAO: RoomTypeDAO;

  async get(filter: GetRoomTypesQuery): Promise<RoomType[]> {
    const [roomTypes] = await this.roomTypeDAO.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
        farmCategory: filter.farmCategory,
      },
      cache: minutesToMilliseconds(5),
    });

    return roomTypes;
  }
}
