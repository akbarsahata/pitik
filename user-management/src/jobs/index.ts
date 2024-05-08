import { Controller, Inject } from 'fastify-decorators';
import { AuditTrailWorker } from './workers/audit-trail.worker';

@Controller()
export class JobsController {
  @Inject(AuditTrailWorker)
  auditTrailWorker: AuditTrailWorker;
}
