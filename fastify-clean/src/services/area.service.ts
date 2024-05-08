import { Inject, Service } from 'fastify-decorators';
import { AreaDAO } from '../dao/area.dao';
import { AreaItem, AreaList, AreaUpsertBody } from '../dto/area.dto';

@Service()
export class AreaService {
  @Inject(AreaDAO)
  private dao!: AreaDAO;

  async upsertArea(data: AreaUpsertBody): Promise<AreaItem> {
    const area = await this.dao.createOrUpdate({
      code: data.code,
      name: data.name,
      isActive: data.isActive,
    });

    return {
      id: area.id,
      seqNo: area.seqNo,
      code: area.code,
      name: area.name,
      isActive: area.isActive,
    };
  }

  async getActiveAreas(): Promise<AreaList> {
    const activeAreas = await this.dao.getMany({
      where: {
        isActive: true,
      },
    });

    return activeAreas;
  }
}
