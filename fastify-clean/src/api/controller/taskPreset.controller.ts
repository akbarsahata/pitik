import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import { TaskItem } from '../../dto/task.dto';
import {
  CreateTaskPresetBody,
  createTaskPresetBodyDTO,
  CreateTaskPresetResponse,
  createTaskPresetResponseDTO,
  GetTaskPresetByIdParams,
  getTaskPresetByIdParamsDTO,
  GetTaskPresetByIdResponse,
  getTaskPresetByIdResponseDTO,
  GetTaskPresetQuery,
  getTaskPresetQueryDTO,
  GetTaskPresetResponse,
  getTaskPresetResponseDTO,
  UpdateTaskPresetBody,
  updateTaskPresetBodyDTO,
  UpdateTaskPresetParams,
  updateTaskPresetParamsDTO,
  UpdateTaskPresetResponse,
  updateTaskPresetResponseDTO,
} from '../../dto/taskPreset.dto';
import { TaskPresetService } from '../../services/taskPreset.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createTaskPresetRequest = FastifyRequest<{
  Body: CreateTaskPresetBody;
}>;

@Controller({
  route: '/task-presets',
  type: 0,
  tags: [{ name: 'task-presets' }],
})
export class TaskPresetController {
  @Inject(TaskPresetService)
  private service: TaskPresetService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getTaskPresetQueryDTO,
        response: {
          200: getTaskPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetTaskPresetQuery;
    }>,
  ): Promise<GetTaskPresetResponse> {
    const [taskPresets, count] = await this.service.getMany(request.query);
    return {
      code: 200,
      count,
      data: taskPresets.map((taskPreset) => ({
        ...taskPreset,
        presetType: 'task',
        coopType: taskPreset.coopType,
        modifiedDate: taskPreset.modifiedDate.toISOString(),
        modifiedBy: taskPreset.userModifier?.fullName || taskPreset.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getTaskPresetByIdParamsDTO,
        response: {
          200: getTaskPresetByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getPresetsById(
    request: FastifyRequest<{
      Params: GetTaskPresetByIdParams;
    }>,
  ): Promise<GetTaskPresetByIdResponse> {
    const taskPreset = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...taskPreset,
        presetType: 'task',
        coopType: taskPreset.coopType,
        modifiedDate: taskPreset.modifiedDate.toISOString(),
        tasks: taskPreset.tasks.map<TaskItem>((taskPresetD) => taskPresetD.task),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createTaskPresetBodyDTO,
        response: {
          201: createTaskPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(request: createTaskPresetRequest): Promise<CreateTaskPresetResponse> {
    const taskPreset = await this.service.create(request.body, request.user);

    return {
      code: 201,
      data: {
        ...taskPreset,
        presetType: 'task',
        createdDate: taskPreset.createdDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateTaskPresetParamsDTO,
        body: updateTaskPresetBodyDTO,
        response: {
          200: updateTaskPresetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateTaskPresetParams;
      Body: UpdateTaskPresetBody;
    }>,
  ): Promise<UpdateTaskPresetResponse> {
    const taskPreset = await this.service.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...taskPreset,
        modifiedDate: taskPreset.modifiedDate.toISOString(),
      },
    };
  }
}
