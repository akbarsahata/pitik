import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateIssueBody,
  createIssueBodyDTO,
  CreateIssueResponse,
  createIssueResponseDTO,
  IssueParams,
  issueParamsDTO,
  IssueQuery,
  issueQueryDTO,
  IssueResponse,
  issueResponseDTO,
  IssueTypeResponse,
  issueTypeResponseDTO,
} from '../../dto/issue.dto';
import { IssueService } from '../../services/issue.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetIssueListRequest = FastifyRequest<{
  Querystring: IssueQuery;
  Params: IssueParams;
}>;

type GetIssueTypeListRequest = FastifyRequest<{
  Params: IssueParams;
}>;

type CreateIssueRequest = FastifyRequest<{
  Body: CreateIssueBody;
}>;

@Controller({
  route: '/issues',
  type: 0,
  tags: [{ name: 'issues' }],
})
export class IssueController {
  @Inject(IssueService)
  private service!: IssueService;

  @GET({
    url: '/list/:farmingCycleId',
    options: {
      schema: {
        querystring: issueQueryDTO,
        params: issueParamsDTO,
        response: { 200: issueResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getIssueList(request: GetIssueListRequest): Promise<IssueResponse> {
    const [data, count] = await this.service.getList(
      request.params.farmingCycleId,
      request.query.$page,
      request.query.$limit,
    );

    return {
      data,
      count,
    };
  }

  @GET({
    url: '/types/:farmingCycleId',
    options: {
      schema: {
        params: issueParamsDTO,
        response: { 200: issueTypeResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getIssueTypeList(request: GetIssueTypeListRequest): Promise<IssueTypeResponse> {
    const data = await this.service.getListOfType(request.params.farmingCycleId);

    return { data };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createIssueBodyDTO,
        response: { 200: createIssueResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async createIssue(request: CreateIssueRequest): Promise<CreateIssueResponse> {
    const newIssue = await this.service.createIssue(request.body, request.user);

    return {
      data: newIssue,
    };
  }
}
