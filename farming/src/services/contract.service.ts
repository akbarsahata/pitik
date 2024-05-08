import { Inject, Service } from 'fastify-decorators';
import { ILike, In, IsNull, Not, QueryRunner } from 'typeorm';
import { ContractDAO } from '../dao/contract.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { ContractType } from '../datasources/entity/pgsql/ContractType.entity';
import {
  ContractItem,
  ContractQueryDTO,
  ContractResponseDTO,
  ContractTypeQuery,
} from '../dto/contract.dto';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { generateOrderQuery } from '../libs/utils/helpers';

@Service()
export class ContractService {
  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  async getOne(id: string): Promise<Partial<ContractItem>> {
    try {
      const contract = await this.contractDAO.getOne({
        where: {
          id,
        },
        relations: {
          branch: true,
          contractType: true,
        },
      });
      return {
        ...contract,
        createdDate: contract?.createdDate?.toString(),
        modifiedDate: contract?.modifiedDate?.toString(),
      };
    } catch (error) {
      throw ERR_CONTRACT_NOT_FOUND();
    }
  }

  async getMany(filter: ContractQueryDTO): Promise<[ContractResponseDTO[], number]> {
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip: number = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    const order = (filter.$order && generateOrderQuery(filter.$order)) || 'DESC';
    const where: any = {};

    (Object.keys(filter) as Array<keyof typeof filter>).forEach((key): void => {
      const specialFilter = filter[key]?.toString().split(':') || [];
      if (key.substring(0, 1) !== '$') {
        if (specialFilter?.length > 1) {
          where[key] = {
            [specialFilter[0]]: ILike(`%${specialFilter[1]}%`),
          };
        } else {
          where[key] = filter[key];
        }
      }
    });

    const [contract, count] = await this.contractDAO.getMany({
      where: {
        ...where,
        contractType: Not(IsNull()),
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: order,
      },
      relations: {
        branch: {
          area: true,
        },
        children: true,
        parent: true,
        contractType: true,
        userModifier: true,
        userCreator: true,
      },
    });

    return [
      contract.map((row) => ({
        ...row,
        createdDate: row.createdDate.toISOString(),
        modifiedDate: row.modifiedDate.toISOString(),
        isParent: !(row.children.length < 1),
        modifiedBy: row.userModifier?.fullName ?? '',
        createdBy: row.userCreator?.fullName ?? '',
      })),
      count,
    ];
  }

  async getContractTypes(filter: ContractTypeQuery): Promise<[ContractType[], number]> {
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [contractTypes, count] = await this.contractTypeDAO.getMany({
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: (filter.$order && generateOrderQuery(filter.$order)) || undefined,
    });

    return [contractTypes, count];
  }

  @Transactional()
  async updateCoopAndFarmingCycleContract(
    farmId: string,
    oldBranchId: string,
    newBranchId: string | undefined,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const [[coops, coopsCount], [farmingCycles, farmingCyclesCount]] = await Promise.all([
      this.coopDAO.getMany({
        where: {
          farmId,
          farm: {
            branchId: oldBranchId,
          },
        },
        relations: {
          contract: true,
          farm: true,
        },
      }),
      this.farmingCycleDAO.getMany({
        where: {
          farmId,
          farm: {
            branchId: oldBranchId,
          },
        },
        relations: {
          contract: true,
          farm: true,
        },
      }),
    ]);

    const listOfContractTypeIds: string[] = [];
    if (coopsCount > 0) {
      coops.forEach((coop) => {
        if (coop.contract?.refContractTypeId) {
          listOfContractTypeIds.push(coop.contract.refContractTypeId);
        }
      });
    }
    const uniqueContractTypeIds: string[] = [...new Set(listOfContractTypeIds)];

    const [contracts, contractsCount] = await this.contractDAO.getMany({
      where: {
        refContractTypeId: uniqueContractTypeIds.length > 0 ? In(uniqueContractTypeIds) : undefined,
        branchId: newBranchId,
      },
    });

    if (contractsCount > 0) {
      coops.forEach(async (coop) => {
        const newContractId = contracts.find(
          (contract) =>
            contract.branchId === newBranchId &&
            contract.refContractTypeId === coop.contract.refContractTypeId,
        );

        if (newContractId) {
          await this.coopDAO.updateOneWithTx(
            { id: coop.id, farmId },
            { contractId: newContractId?.id },
            user,
            queryRunner,
          );
        }
      });
    }

    if (farmingCyclesCount > 0) {
      farmingCycles.forEach(async (farmingCycle) => {
        const newContractId = contracts.find(
          (contract) =>
            contract.branchId === newBranchId &&
            farmingCycle.contract &&
            contract.refContractTypeId === farmingCycle.contract.refContractTypeId,
        );

        if (newContractId) {
          await this.farmingCycleDAO.updateOneWithTx(
            { id: farmingCycle.id, farmId },
            { contractId: newContractId?.id },
            user,
            queryRunner,
          );
        }
      });
    }
  }
}
