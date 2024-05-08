import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  contractInputDTO,
  getContractDetailParamsDTO,
  postContractResponseDTO,
} from '../../dto/contract.dto';
import {
  contractMitraGaransiDetailResponseDTO,
  ContractMitraGaransiInput,
  contractMitraGaransiInputDTO,
  contractMitraGaransiResponseDTO,
  GetcontractDetailMGParams,
  GetContractMitraGaransiParams,
  getcontractMitraGaransiParamsDTO,
} from '../../dto/contractMitraGaransi.dto';
import { ContractMitraGaransiService } from '../../services/contractMitraGaransi.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type UpdateMitraGaransiRequest = FastifyRequest<{
  Params: GetContractMitraGaransiParams;
  Body: ContractMitraGaransiInput;
}>;
@Controller({
  route: '/contract/mitra-garansi',
  type: 0,
  tags: [{ name: 'contract-mitra-garansi' }],
})
export class ContractMitraGaransiController {
  @Inject(ContractMitraGaransiService)
  private service!: ContractMitraGaransiService;

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
      Body: ContractMitraGaransiInput;
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
        params: getcontractMitraGaransiParamsDTO,
        response: {
          200: contractMitraGaransiResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOne(
    request: FastifyRequest<{
      Params: GetContractMitraGaransiParams;
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
          200: contractMitraGaransiDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDetailContractMG(
    request: FastifyRequest<{
      Params: GetcontractDetailMGParams;
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
        params: getcontractMitraGaransiParamsDTO,
        body: contractMitraGaransiInputDTO,
        response: {
          200: contractMitraGaransiResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateMitraGaransi(request: UpdateMitraGaransiRequest) {
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
