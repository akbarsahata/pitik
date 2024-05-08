import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  contractInputDTO,
  contractOwnFarmInputDTO,
  postContractResponseDTO,
} from '../../dto/contract.dto';
import {
  ContractOwnFarmInput,
  contractOwnFarmResponseDTO,
  GetcontractDetailOwnFarmParamsDTO,
  getcontractDetailOwnFarmParamsDTO,
  GetcontractOwnFarmParams,
  getcontractOwnFarmParamsDTO,
  responseContractDetailOwnFarm,
} from '../../dto/contractOwnFarm.dto';
import { ContractOwnFarmService } from '../../services/contractOwnFarm.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type UpdateOwnFarmRequest = FastifyRequest<{
  Params: GetcontractOwnFarmParams;
  Body: ContractOwnFarmInput;
}>;
@Controller({
  route: '/contract/own-farm',
  type: 0,
  tags: [{ name: 'contract-own-farm' }],
})
export class ContractOwnFarmController {
  @Inject(ContractOwnFarmService)
  private service!: ContractOwnFarmService;

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
      Body: ContractOwnFarmInput;
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
        params: getcontractOwnFarmParamsDTO,
        response: {
          200: contractOwnFarmResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOne(
    request: FastifyRequest<{
      Params: GetcontractOwnFarmParams;
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
        params: getcontractDetailOwnFarmParamsDTO,
        response: {
          200: responseContractDetailOwnFarm,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDetailContractOwnFarm(
    request: FastifyRequest<{
      Params: GetcontractDetailOwnFarmParamsDTO;
    }>,
  ) {
    const contract = await this.service.getConstraintContract(request.params.branchId);

    return {
      code: 200,
      data: contract || null,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: getcontractOwnFarmParamsDTO,
        body: contractOwnFarmInputDTO,
        response: {
          200: contractOwnFarmResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateOwnFarm(request: UpdateOwnFarmRequest) {
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
