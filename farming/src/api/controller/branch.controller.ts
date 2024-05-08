import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  BranchListResponse,
  branchListResponseDTO,
  BranchUpsertBody,
  branchUpsertBodyDTO,
  BranchUpsertResponse,
  branchUpsertResponseDTO,
} from '../../dto/branch.dto';
import { BranchService } from '../../services/branch.service';

type UpsertBranchRequest = FastifyRequest<{
  Body: BranchUpsertBody;
}>;

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'branches' }],
})
export class BranchController {
  @Inject(BranchService)
  private service!: BranchService;

  @POST({
    url: '/internal/branches',
    options: {
      schema: {
        tags: ['internal'],
        body: branchUpsertBodyDTO,
        response: {
          200: branchUpsertResponseDTO,
        },
      },
    },
  })
  async upsertBranch(request: UpsertBranchRequest): Promise<BranchUpsertResponse> {
    const branch = await this.service.upsertBranch(request.body);

    return {
      data: {
        id: branch.id,
        branchCode: branch.code,
        branchName: branch.name,
        areaCode: branch.area.code,
        areaName: branch.area.name,
        isActive: branch.isActive,
      },
    };
  }

  @GET({
    url: '/branches',
    options: {
      schema: {
        response: {
          200: branchListResponseDTO,
        },
      },
    },
  })
  async listActiveBranches(): Promise<BranchListResponse> {
    const activeBranches = await this.service.getActiveBranches();

    return {
      data: activeBranches,
    };
  }
}
