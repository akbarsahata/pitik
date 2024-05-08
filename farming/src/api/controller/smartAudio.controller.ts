import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  CreateJobRequestBody,
  createJobRequestBodyDTO,
  CreateJobResponse,
  createJobResponseDTO,
} from '../../dto/smartAudio.dto';
import { SmartAudioService } from '../../services/smartAudio.service';
import { verifyIotSecurityKey } from '../hooks/preHandler/verifyIotSecurityKey';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'smart-audio' }],
})
export class SmartAudioController {
  @Inject(SmartAudioService)
  private service!: SmartAudioService;

  @POST({
    url: '/internal/smart-audio/jobs',
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
