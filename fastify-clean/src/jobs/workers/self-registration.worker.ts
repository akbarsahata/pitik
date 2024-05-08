import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { CreateUserBody } from '../../dto/user.dto';
import { UserManagementDAO } from '../../dao/userManagement.dao';
import { QUEUE_SELF_REGISTRATION } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { BaseWorker } from './base.worker';

@Service()
export class SelfRegistrationWorker extends BaseWorker<User> {
  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_SELF_REGISTRATION;

  protected async handle(data: DeepPartial<User>): Promise<void> {
    try {
      const inputPayload: Partial<CreateUserBody> = {
        password: data.password,
      };

      await Promise.all([UserManagementDAO.register(inputPayload)].map((trxHook) => trxHook(data)));
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
