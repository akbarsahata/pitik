import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  ContractParamsDTO,
  ContractQueryDTO,
  contractQueryDTO,
  ContractTypeQuery,
  contractTypeQueryDTO,
  getContractByIdParamsDTO,
  GetContractByIdResponseDTO,
  getContractByIdResponseDTO,
  getContractItemResponseDTO,
  GetContractResponse,
  getContractTypeResponseDTO,
} from '../../dto/contract.dto';
import { ContractService } from '../../services/contract.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/contract',
  type: 0,
  tags: [{ name: 'contract' }],
})
export class ContractController {
  @Inject(ContractService)
  private service!: ContractService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: contractQueryDTO,
        response: {
          200: getContractItemResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: ContractQueryDTO;
    }>,
  ): Promise<GetContractResponse> {
    const [contract, count] = await this.service.getMany(req.query);
    return {
      code: 200,
      count,
      data: contract,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getContractByIdParamsDTO,
        response: {
          200: getContractByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOne(
    request: FastifyRequest<{
      Params: ContractParamsDTO;
    }>,
  ): Promise<Partial<GetContractByIdResponseDTO>> {
    const contract = await this.service.getOne(request.params.id);

    return {
      code: 200,
      data: contract,
    };
  }

  @GET({
    url: '/contract-types',
    options: {
      schema: {
        querystring: contractTypeQueryDTO,
        response: {
          200: getContractTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getContractType(
    request: FastifyRequest<{
      Querystring: ContractTypeQuery;
    }>,
  ) {
    const [contractTypes, count] = await this.service.getContractTypes(request.query);

    return {
      code: 200,
      count,
      data: contractTypes,
    };
  }
}
