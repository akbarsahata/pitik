import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PUT } from 'fastify-decorators';
import {
  GetStatisticsParam,
  getStatisticsParamDTO,
  GetStatisticsResponse,
  getStatisticsResponseDTO,
  GetTaskQuery,
  getTaskQueryDTO,
  GetTaskResponse,
  getTaskResponseDTO,
  TaskDetailBody,
  taskDetailBodyDTO,
  TaskDetailParams,
  taskDetailParamsDTO,
  TaskDetailResponse,
  taskDetailResponseDTO,
  TaskSummaryParams,
  taskSummaryParamsDTO,
  TaskSummaryQuery,
  taskSummaryQueryDTO,
  TaskSummaryResponse,
  taskSummaryResponseDTO,
} from '../../dto/task.dto';
import { TaskService } from '../../services/task.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type UpdateTaskDetailRequest = FastifyRequest<{
  Params: TaskDetailParams;
  Body: TaskDetailBody;
}>;

type GetTaskDetailRequest = FastifyRequest<{
  Params: TaskDetailParams;
}>;

type GetTasksRequest = FastifyRequest<{
  Querystring: TaskSummaryQuery;
  Params: TaskSummaryParams;
}>;

@Controller({
  route: '/tasks',
  type: 0,
  tags: [{ name: 'tasks' }],
})
export class TaskController {
  @Inject(TaskService)
  private service!: TaskService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getTaskQueryDTO,
        response: {
          200: getTaskResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetTaskQuery;
    }>,
  ): Promise<GetTaskResponse> {
    const [taskPresets, count] = await this.service.getTask(request.query);
    return {
      code: 200,
      count,
      data: taskPresets.map((taskPreset) => ({
        ...taskPreset,
        modifiedBy: taskPreset.userModifier?.fullName || taskPreset.modifiedBy,
        modifiedDate: taskPreset.modifiedDate.toISOString(),
      })),
    };
  }

  @GET({
    url: '/current/:farmingCycleId',
    options: {
      schema: {
        querystring: taskSummaryQueryDTO,
        params: taskSummaryParamsDTO,
        response: { 200: taskSummaryResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getCurrentTasks(request: GetTasksRequest): Promise<TaskSummaryResponse> {
    const [data, count] = await this.service.getTaskSummaryCurrent(
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
    url: '/late/:farmingCycleId',
    options: {
      schema: {
        querystring: taskSummaryQueryDTO,
        params: taskSummaryParamsDTO,
        response: { 200: taskSummaryResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getLateTasks(request: GetTasksRequest): Promise<TaskSummaryResponse> {
    const [data, count] = await this.service.getTaskSummaryLate(
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
    url: '/done/:farmingCycleId',
    options: {
      schema: {
        querystring: taskSummaryQueryDTO,
        params: taskSummaryParamsDTO,
        response: { 200: taskSummaryResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getDoneTasks(request: GetTasksRequest): Promise<TaskSummaryResponse> {
    const [data, count] = await this.service.getTaskSummaryDone(
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
    url: '/:id',
    options: {
      schema: {
        params: taskDetailParamsDTO,
        response: { 200: taskDetailResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getTaskDetail(request: GetTaskDetailRequest): Promise<TaskDetailResponse> {
    const taskDetail = await this.service.getTaskDetail(request.params.id);

    return {
      data: taskDetail,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        body: taskDetailBodyDTO,
        response: { 200: taskDetailResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async updateTaskDetail(request: UpdateTaskDetailRequest): Promise<TaskDetailResponse> {
    const updatedTask = await this.service.updateTaskDetail(
      request.params.id,
      request.body,
      request.user,
    );

    return {
      data: updatedTask,
    };
  }

  @GET({
    url: '/statistics/:farmingCycleId',
    options: {
      schema: {
        params: getStatisticsParamDTO,
        response: {
          200: getStatisticsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getStatistics(
    req: FastifyRequest<{
      Params: GetStatisticsParam;
    }>,
  ): Promise<GetStatisticsResponse> {
    return this.service.getStatistics(req.params.farmingCycleId);
  }
}
