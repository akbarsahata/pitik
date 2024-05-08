import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetControllerTypesQuery,
  getControllerTypesQueryDTO,
  GetControllerTypesResponse,
  getControllerTypesResponseDTO,
} from '../../dto/controllerType.dto';
import { ControllerTypeService } from '../../services/controllerType.service';

@Controller({
  route: '/controller-types',
  type: 0,
  tags: [{ name: 'controller-types' }],
})
export class ControllerTypeController {
  @Inject(ControllerTypeService)
  private service: ControllerTypeService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getControllerTypesQueryDTO,
        response: {
          200: getControllerTypesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetControllerTypesQuery;
    }>,
  ): Promise<GetControllerTypesResponse> {
    const controllerTypes = await this.service.get(req.query);

    return {
      code: 200,
      data: controllerTypes,
    };
  }
}
