import { Inject, Service } from 'fastify-decorators';
import { Like } from 'typeorm';
import { ContractDAO } from '../dao/contract.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { ContractType } from '../datasources/entity/pgsql/ContractType.entity';
import {
  ContractItem,
  ContractQueryDTO,
  ContractResponseDTO,
  ContractTypeQuery,
} from '../dto/contract.dto';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { generateOrderQuery } from '../libs/utils/helpers';

@Service()
export class ContractService {
  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

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
            [specialFilter[0]]: Like(`%${specialFilter[1]}%`),
          };
        } else {
          where[key] = filter[key];
        }
      }
    });

    const [contract, count] = await this.contractDAO.getMany({
      where,
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
      contract.map(
        (row): ContractResponseDTO => ({
          ...row,
          createdDate: row.createdDate.toISOString(),
          modifiedDate: row.modifiedDate.toISOString(),
          isParent: !(row.children.length < 1),
          modifiedBy: row.userModifier?.fullName ?? '',
          createdBy: row.userCreator?.fullName ?? '',
        }),
      ),
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
}
