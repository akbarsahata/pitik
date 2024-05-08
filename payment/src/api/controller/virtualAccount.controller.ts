import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  CreateVirtualAccountBody,
  GetVirtualAccountResponse,
  SetExpireBody,
  SetExpireParams,
  createVirtualAccountBody,
  getVirtualAccountResponse,
  setExpireBodyDTO,
  setExpireParamsDTO,
} from '../../dto/virtualAccount.dto';
import { VirtualAccountService } from '../../services/virtualAccount.service';
import { verifyRequestIdentifier } from '../hooks/onRequest/verifyRequestIdentifier';
import { OkMessage, okMessageDTO } from '../../dto/common.dto';

@Controller({ route: '/virtual-accounts' })
export class VirtualAccountController {
  @Inject(VirtualAccountService)
  private service!: VirtualAccountService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createVirtualAccountBody,
        response: {
          201: getVirtualAccountResponse,
        },
      },
      onRequest: [verifyRequestIdentifier],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateVirtualAccountBody;
    }>,
    rep: FastifyReply,
  ): Promise<GetVirtualAccountResponse> {
    const data = await this.service.create(req);

    const code = 201;

    rep.status(code);

    return {
      code,
      data,
    };
  }

  @POST({
    url: '/set-expire/:partnerId/:bankCode',
    options: {
      schema: {
        params: setExpireParamsDTO,
        body: setExpireBodyDTO,
        response: {
          202: okMessageDTO,
        },
      },
      onRequest: [verifyRequestIdentifier],
    },
  })
  async setExpire(
    req: FastifyRequest<{
      Params: SetExpireParams;
      Body: SetExpireBody;
    }>,
    rep: FastifyReply,
  ): Promise<OkMessage> {
    await this.service.setExpire(req);

    const code = 200;

    rep.status(code);

    return {
      code,
      data: {
        message: 'OK',
      },
    };
  }
}
