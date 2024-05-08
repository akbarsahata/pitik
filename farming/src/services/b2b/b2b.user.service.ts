import { Service } from 'fastify-decorators';
import { UserService } from '../user.service';

@Service()
export class B2BUserService extends UserService {}
