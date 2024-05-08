import { Inject, Service } from 'fastify-decorators';
import { RoomType } from '../datasources/entity/pgsql/RoomType.entity';
import { GetRoomTypesQuery } from '../dto/roomType.dto';
import { RoomTypeService } from '../services/roomType.service';

@Service()
export class RoomTypeUsecase {
  @Inject(RoomTypeService)
  private roomTypeService: RoomTypeService;

  async get(filter: GetRoomTypesQuery): Promise<RoomType[]> {
    return this.roomTypeService.get(filter);
  }
}
