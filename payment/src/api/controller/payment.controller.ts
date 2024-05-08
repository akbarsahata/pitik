import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import { OkMessage, okMessageDTO } from '../../dto/common.dto';
import {
  RetryVirtualAccountPaymentParams,
  retryVirtualAccountPaymentParams,
} from '../../dto/payment.dto';
import { PaymentService } from '../../services/payment.service';

@Controller({ route: '/payments' })
export class PaymentController {
  @Inject(PaymentService)
  private paymentService!: PaymentService;

  @POST({
    url: '/virtual-account/manual-retry/:paymentId',
    options: {
      schema: {
        params: retryVirtualAccountPaymentParams,
        response: { 200: okMessageDTO },
      },
    },
  })
  async manualRetry(
    req: FastifyRequest<{
      Params: RetryVirtualAccountPaymentParams;
    }>,
    rep: FastifyReply,
  ): Promise<OkMessage> {
    await this.paymentService.retryVirtualAccountPayment(req);

    rep.status(200);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
