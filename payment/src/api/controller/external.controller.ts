import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import { OkMessage, okMessageDTO } from '../../dto/common.dto';
import {
  VirtualAccountItem,
  VirtualAccountPaymentCallbackBody,
  virtualAccountItemDTO,
  virtualAccountPaymentCallbackBodyDTO,
} from '../../dto/xendit.dto';
import { PaymentService } from '../../services/payment.service';
import { VirtualAccountService } from '../../services/virtualAccount.service';
import { verifyXenditCallback } from '../hooks/onRequest/verifyXenditCallback';
import { createXenditRequestLog } from '../hooks/onSend/createXenditRequestLog';

@Controller({ route: '/external' })
export class ExternalController {
  @Inject(PaymentService)
  private paymentService!: PaymentService;

  @Inject(VirtualAccountService)
  private virtualAccountService!: VirtualAccountService;

  @POST({
    url: '/xendit/virtual-account/status-callback',
    options: {
      schema: {
        body: virtualAccountItemDTO,
        response: { 200: okMessageDTO },
      },
      onRequest: [verifyXenditCallback],
      onSend: [createXenditRequestLog],
    },
  })
  async virtualAccountStatusCallback(
    req: FastifyRequest<{
      Body: VirtualAccountItem;
    }>,
    rep: FastifyReply,
  ): Promise<OkMessage> {
    await this.virtualAccountService.virtualAccountStatusCallback(req);

    rep.status(200);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/xendit/virtual-account/payment-callback',
    options: {
      schema: {
        body: virtualAccountPaymentCallbackBodyDTO,
        response: { 200: okMessageDTO },
      },
      onRequest: [verifyXenditCallback],
      onSend: [createXenditRequestLog],
    },
  })
  async virtualAccountPaymentCallback(
    req: FastifyRequest<{
      Body: VirtualAccountPaymentCallbackBody;
    }>,
    rep: FastifyReply,
  ): Promise<OkMessage> {
    await this.paymentService.virtualAccountPaymentCallback(req);

    rep.status(200);
    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
