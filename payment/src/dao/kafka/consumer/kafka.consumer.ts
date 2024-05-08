import { Controller, Inject } from 'fastify-decorators';
import { PaymentInDLQConsumer } from './paymentInDLQ.consumer';

@Controller()
export class KafkaConsumer {
  @Inject(PaymentInDLQConsumer)
  paymentStatusDLQConsumer!: PaymentInDLQConsumer;
}
