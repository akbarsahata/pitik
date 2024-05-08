import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateTaskLibraryBody,
  createTaskLibraryBodyDTO,
  CreateTaskLibraryResponse,
  createTaskLibraryResponseDTO,
  GetTaskLibraryByIdParams,
  getTaskLibraryByIdParamsDTO,
  GetTaskLibraryByIdResponse,
  getTaskLibraryByIdResponseDTO,
  GetTaskLibraryQuery,
  getTaskLibraryQueryDTO,
  GetTaskLibraryResponse,
  getTaskLibraryResponseDTO,
  TaskFormDItem,
  UpdateTaskLibraryBody,
  updateTaskLibraryBodyDTO,
  UpdateTaskLibraryParams,
  updateTaskLibraryParamsDTO,
  UpdateTaskLibraryResponse,
  updateTaskLibraryResponseDTO,
} from '../../dto/taskLibrary.dto';
import { TaskLibraryService } from '../../services/taskLibrary.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createTaskLibraryRequest = FastifyRequest<{
  Body: CreateTaskLibraryBody;
}>;

@Controller({
  route: '/task-libraries',
  type: 0,
  tags: [{ name: 'task-libraries' }],
})
export class TaskLibraryController {
  @Inject(TaskLibraryService)
  private service: TaskLibraryService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getTaskLibraryQueryDTO,
        response: {
          200: getTaskLibraryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetTaskLibraryQuery;
    }>,
  ): Promise<GetTaskLibraryResponse> {
    const [taskLibraries, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: taskLibraries.map((taskLibrary) => ({
        ...taskLibrary,
        triggers:
          taskLibrary.triggers?.map((trigger) => trigger).sort((a, b) => a.day - b.day) ||
          undefined,
        instructions: taskLibrary.instructions?.map<TaskFormDItem>((instruction) => ({
          id: instruction.id,
          instructionTitle: instruction.instructionTitle,
          dataRequired: instruction.dataRequired,
          dataInstruction: instruction.dataInstruction,
          dataType: instruction.dataType,
          dataOption: instruction.dataOption,
          harvestQty: instruction.harvestQty,
          dataOperator: instruction.dataOperator,
          photoRequired: instruction.photoRequired,
          photoInstruction: instruction.photoInstruction,
          videoRequired: instruction.videoRequired,
          videoInstruction: instruction.videoInstruction,
          needAdditionalDetail: instruction.needAdditionalDetail,
          additionalDetail: instruction.additionalDetail,
          checkDataCorrectness: instruction.checkDataCorrectness,
          feedbrand: instruction.feedbrand || undefined,
          variable: instruction.variable || undefined,
        })),
        modifiedDate: taskLibrary.modifiedDate.toISOString(),
        modifiedBy: taskLibrary.userModifier?.fullName || taskLibrary.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getTaskLibraryByIdParamsDTO,
        response: {
          200: getTaskLibraryByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getPresetsById(
    request: FastifyRequest<{
      Params: GetTaskLibraryByIdParams;
    }>,
  ): Promise<GetTaskLibraryByIdResponse> {
    const taskLibrary = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...taskLibrary,
        triggers: taskLibrary.triggers?.map((trigger) => trigger) || undefined,
        instructions: taskLibrary.instructions?.map<TaskFormDItem>((instruction) => ({
          id: instruction.id,
          instructionTitle: instruction.instructionTitle,
          dataRequired: instruction.dataRequired,
          dataInstruction: instruction.dataInstruction,
          dataType: instruction.dataType,
          dataOption: instruction.dataOption,
          harvestQty: instruction.harvestQty,
          dataOperator: instruction.dataOperator,
          photoRequired: instruction.photoRequired,
          photoInstruction: instruction.photoInstruction,
          videoRequired: instruction.videoRequired,
          videoInstruction: instruction.videoInstruction,
          needAdditionalDetail: instruction.needAdditionalDetail,
          additionalDetail: instruction.additionalDetail,
          checkDataCorrectness: instruction.checkDataCorrectness,
          feedbrand: instruction.feedbrand || undefined,
          variable: instruction.variable || undefined,
        })),
        modifiedDate: taskLibrary.modifiedDate.toISOString(),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createTaskLibraryBodyDTO,
        response: {
          201: createTaskLibraryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: createTaskLibraryRequest,
    reply: FastifyReply,
  ): Promise<CreateTaskLibraryResponse> {
    const taskLibrary = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: {
        ...taskLibrary,
        triggers: taskLibrary.triggers?.map((trigger) => trigger) || undefined,
        instructions: taskLibrary.instructions?.map<TaskFormDItem>((instruction) => ({
          id: instruction.id,
          instructionTitle: instruction.instructionTitle,
          dataRequired: instruction.dataRequired,
          dataInstruction: instruction.dataInstruction,
          dataType: instruction.dataType,
          dataOption: instruction.dataOption,
          harvestQty: instruction.harvestQty,
          dataOperator: instruction.dataOperator,
          photoRequired: instruction.photoRequired,
          photoInstruction: instruction.photoInstruction,
          videoRequired: instruction.videoRequired,
          videoInstruction: instruction.videoInstruction,
          needAdditionalDetail: instruction.needAdditionalDetail,
          additionalDetail: instruction.additionalDetail,
          checkDataCorrectness: instruction.checkDataCorrectness,
          feedbrand: instruction.feedbrand || undefined,
          variable: instruction.variable || undefined,
        })),
        createdDate: taskLibrary.modifiedDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateTaskLibraryParamsDTO,
        body: updateTaskLibraryBodyDTO,
        response: {
          200: updateTaskLibraryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateTaskLibraryParams;
      Body: UpdateTaskLibraryBody;
    }>,
  ): Promise<UpdateTaskLibraryResponse> {
    const taskLibrary = await this.service.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...taskLibrary,
        triggers: taskLibrary.triggers?.map((trigger) => trigger) || undefined,
        instructions: taskLibrary.instructions?.map<TaskFormDItem>((instruction) => ({
          id: instruction.id,
          instructionTitle: instruction.instructionTitle,
          dataRequired: instruction.dataRequired,
          dataInstruction: instruction.dataInstruction,
          dataType: instruction.dataType,
          dataOption: instruction.dataOption,
          harvestQty: instruction.harvestQty,
          dataOperator: instruction.dataOperator,
          photoRequired: instruction.photoRequired,
          photoInstruction: instruction.photoInstruction,
          videoRequired: instruction.videoRequired,
          videoInstruction: instruction.videoInstruction,
          needAdditionalDetail: instruction.needAdditionalDetail,
          additionalDetail: instruction.additionalDetail,
          checkDataCorrectness: instruction.checkDataCorrectness,
          feedbrand: instruction.feedbrand || undefined,
          variable: instruction.variable || undefined,
        })),
        modifiedDate: taskLibrary.modifiedDate.toISOString(),
      },
    };
  }
}
