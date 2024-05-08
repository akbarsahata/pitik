import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  AreaListResponse,
  areaListResponseDTO,
  AreaUpsertBody,
  areaUpsertBodyDTO,
  AreaUpsertResponse,
  areaUpsertResponseDTO,
} from '../../dto/area.dto';
import { AreaService } from '../../services/area.service';

type UpserAreaRequest = FastifyRequest<{
  Body: AreaUpsertBody;
}>;

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'areas' }],
})
export class AreaController {
  @Inject(AreaService)
  private service!: AreaService;

  @POST({
    url: '/internal/areas',
    options: {
      schema: {
        tags: ['internal'],
        body: areaUpsertBodyDTO,
        response: {
          200: areaUpsertResponseDTO,
        },
      },
    },
  })
  async upsertArea(request: UpserAreaRequest): Promise<AreaUpsertResponse> {
    const area = await this.service.upsertArea(request.body);

    return {
      data: {
        id: area.id,
        code: area.code,
        name: area.name,
        isActive: area.isActive,
      },
    };
  }

  @GET({
    url: '/areas',
    options: {
      schema: {
        response: {
          200: areaListResponseDTO,
        },
      },
    },
  })
  async listActiveAreas(): Promise<AreaListResponse> {
    const activeAreas = await this.service.getActiveAreas();

    return {
      data: activeAreas,
    };
  }
}
