import { Inject, Service } from 'fastify-decorators';
import { ChickType } from '../datasources/entity/pgsql/ChickType.entity';
import {
  CreateChickTypeBody,
  GetChickTypesQuery,
  UpdateChickTypeByIdBody,
} from '../dto/chickType.dto';
import { RequestUser } from '../libs/types/index.d';
import { ChickTypeService } from '../services/farming/chickType.service';

@Service()
export class ChickTypeUsecase {
  @Inject(ChickTypeService)
  private chickTypeService: ChickTypeService;

  async create(input: CreateChickTypeBody, user: RequestUser): Promise<ChickType> {
    return this.chickTypeService.create(input, user);
  }

  async get(filter: GetChickTypesQuery): Promise<[ChickType[], number]> {
    return this.chickTypeService.get(filter);
  }

  async getById(id: string): Promise<ChickType> {
    return this.chickTypeService.getById(id);
  }

  async update(id: string, input: UpdateChickTypeByIdBody, user: RequestUser): Promise<ChickType> {
    return this.chickTypeService.update(id, input, user);
  }
}
