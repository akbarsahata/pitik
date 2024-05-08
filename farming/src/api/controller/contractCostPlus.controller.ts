import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  contractInputDTO,
  getContractDetailParamsDTO,
  postContractResponseDTO,
} from '../../dto/contract.dto';
import {
  contractCostPlusDetailResponseDTO,
  ContractCostPlusInput,
  contractCostPlusInputDTO,
  contractCostPlusResponseDTO,
  ContractCostPlusUpdateDTO,
  GetContractCostPlusParams,
  getcontractCostPlusParamsDTO,
} from '../../dto/contractCostPlus.dto';
import { ContractCostPlusService } from '../../services/contractCostPlus.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type UpdateCostPlusRequest = FastifyRequest<{
  Params: GetContractCostPlusParams;
  Body: ContractCostPlusUpdateDTO;
}>;

@Controller({
  route: '/contract/cost-plus',
  type: 0,
  tags: [{ name: 'contract-cost-plus' }],
})
export class ContractCostPlusController {
  @Inject(ContractCostPlusService)
  private service!: ContractCostPlusService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: contractInputDTO,
        response: { 200: postContractResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: FastifyRequest<{
      Body: ContractCostPlusInput;
    }>,
  ) {
    const contract = await this.service.create(request.body, request.user);
    return {
      code: 200,
      data: contract,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getcontractCostPlusParamsDTO,
        response: {
          200: contractCostPlusResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOne(
    request: FastifyRequest<{
      Params: GetContractCostPlusParams;
    }>,
  ) {
    const contract = await this.service.getOneStrict(request.params.id);

    return {
      code: 200,
      data: contract || null,
    };
  }

  @GET({
    url: '/detail/:branchId',
    options: {
      schema: {
        params: getContractDetailParamsDTO,
        response: {
          200: contractCostPlusDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDetailContractCP(
    request: FastifyRequest<{
      Params: GetContractCostPlusParams;
    }>,
  ) {
    const contract = await this.service.getConstraintContract(request.params.id);

    return {
      code: 200,
      data: contract || null,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: getcontractCostPlusParamsDTO,
        body: contractCostPlusInputDTO,
        response: {
          200: contractCostPlusResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateCostPlus(request: UpdateCostPlusRequest) {
    const farm = await this.service.update(request.params.id, request.body, request.user);
    return {
      code: 200,
      data: {
        ...farm,
        modifiedDate: farm.modifiedDate.toISOString(),
      },
    };
  }
}
