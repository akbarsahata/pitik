import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  CreateJobRequestBody,
  createJobRequestBodyDTO,
  CreateJobResponse,
  createJobResponseDTO,
} from '../../dto/smartRecorder.dto';
import { SmartRecorderService } from '../../services/smartRecorder.service';
import { verifyIotSecurityKey } from '../hooks/preHandler/verifyIotSecurityKey';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'smart-recorder' }],
})
export class SmartRecorderController {
  @Inject(SmartRecorderService)
  private service!: SmartRecorderService;

  @POST({
    url: '/internal/smart-recorder/jobs',
    options: {
      schema: {
        tags: ['internal'],
        body: createJobRequestBodyDTO,
        response: {
          200: createJobResponseDTO,
        },
      },
      preHandler: [verifyIotSecurityKey],
    },
  })
  async createJob(
    req: FastifyRequest<{
      Body: CreateJobRequestBody;
    }>,
  ): Promise<CreateJobResponse> {
    const { createJobItem } = await this.service.createJob({
      jobId: req.body.jobId,
      sensorCode: req.body.sensorCode,
      capturedAt: req.body.capturedAt,
    });

    return {
      code: 200,
      data: createJobItem,
    };
  }
}
