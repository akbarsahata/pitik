import { Inject, Service } from 'fastify-decorators';
import { AreaDAO } from '../dao/area.dao';
import { BranchDAO } from '../dao/branch.dao';
import { BranchCityDAO } from '../dao/branchCity.dao';
import { Branch } from '../datasources/entity/pgsql/Branch.entity';
import { BranchItem, BranchList, BranchUpsertBody } from '../dto/branch.dto';

@Service()
export class BranchService {
  @Inject(BranchDAO)
  private dao!: BranchDAO;

  @Inject(AreaDAO)
  private areaDao!: AreaDAO;

  @Inject(BranchCityDAO)
  private branchCityDAO!: BranchCityDAO;

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

    if (data.cityIds && data.cityIds.length > 0) {
      const qr = await this.branchCityDAO.startTransaction();

      await this.branchCityDAO.softDeleteManyWithTx(
        {
          branchId: branch.id,
        },
        qr,
      );

      const branchCities = await this.branchCityDAO.upsertMany(
        data.cityIds.map((cityId) => ({
          cityId,
          branchId: branch.id,
        })),
        {
          qr,
        },
      );
      branch.branchCities = branchCities;
    }

    return {
      ...this.mapEntityToDTO(branch),
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
        branchCities: {
          city: true,
        },
      },
    });

    return activeBranches.map((branch) => this.mapEntityToDTO(branch));
  }

  // eslint-disable-next-line class-methods-use-this
  private mapEntityToDTO(branch: Branch): BranchItem {
    return {
      ...branch,
      cities: branch.branchCities?.map((bc) => bc.city),
    };
  }
}
