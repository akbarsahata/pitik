import { Inject, Service } from 'fastify-decorators';
import { AreaDAO } from '../dao/area.dao';
import { BranchDAO } from '../dao/branch.dao';
import { BranchItem, BranchList, BranchUpsertBody } from '../dto/branch.dto';

@Service()
export class BranchService {
  @Inject(BranchDAO)
  private dao!: BranchDAO;

  @Inject(AreaDAO)
  private areaDao!: AreaDAO;

  async upsertBranch(data: BranchUpsertBody): Promise<BranchItem> {
    const area = await this.areaDao.createOrUpdate({
      code: data.areaCode,
      name: data.areaName,
      isActive: data.isActive,
    });

    const branch = await this.dao.createOrUpdate({
      code: data.branchCode,
      name: data.branchName,
      areaId: area.id,
      isActive: data.isActive,
    });

    return {
      id: branch.id,
      seqNo: branch.seqNo,
      code: branch.code,
      name: branch.name,
      areaId: area.id,
      isActive: branch.isActive,
      area,
    };
  }

  async getActiveBranches(): Promise<BranchList> {
    const [activeBranches] = await this.dao.getMany({
      where: {
        isActive: true,
      },
      relations: {
        area: true,
      },
    });

    return activeBranches;
  }
}
