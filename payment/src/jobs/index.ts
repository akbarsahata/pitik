import { Controller, Inject } from 'fastify-decorators';
import { RepeatableJobQueue } from './queues/repeatable-job.queue';
import { RepeatableJobWorker } from './workers/repeatable-job.worker';

@Controller()
export class JobsController {
  @Inject(RepeatableJobQueue)
  repeatableJobQueue: RepeatableJobQueue;

  @Inject(RepeatableJobWorker)
  repeatableJobWorker: RepeatableJobWorker;
}
