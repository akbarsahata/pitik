import { Initializer, Inject, Service } from 'fastify-decorators';
import { env } from '../../../config/env';
import { KafkaConnection } from '../../../datasources/connection/kafka.connection';
import { WhalePaymentIn } from '../../../libs/constants/kafkaTopic';
import { Logger } from '../../../libs/utils/logger';
import { VirtualAccountPaymentDAO } from '../../postgresql/virtualAccountPayment';
import { SlackDAO } from '../../slack/slack.dao';

@Service()
export class PaymentInDLQConsumer {
  @Inject(KafkaConnection)
  private kafka!: KafkaConnection;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(VirtualAccountPaymentDAO)
  private virtualAccountPaymentDAO!: VirtualAccountPaymentDAO;

  @Initializer([KafkaConnection, Logger, VirtualAccountPaymentDAO])
  async init() {
    const consumer = this.kafka.client().consumer({
      groupId: env.KAFKA_CONSUMER_GROUP,
      allowAutoTopicCreation: true,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: /whale_payment-in_(dlq|success)/,
    });

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.info(
          `[KAFKA] ${topic}[${partition} | ${message.offset}] / ${message.timestamp}`,
          message?.value?.toString(),
        );

        const value = JSON.parse(message?.value?.toString() || '{}');

        const payment = await this.virtualAccountPaymentDAO.getOne({
          where: {
            paymentId: value.paymentId,
          },
        });

        if (!payment) {
          this.logger.error(
            `[KAFKA] ${topic}[${partition} | ${message.offset}] / ${message.timestamp}`,
            `Payment with id ${value.paymentId} not found`,
          );
          return;
        }
        let parsedTimestamp;
        if (!Number.isNaN(message.timestamp)) {
          // If the timestamp is a number (epoch format), parse it as a number
          parsedTimestamp = new Date(parseInt(message.timestamp, 10));
        } else {
          // Otherwise, parse it as an ISO string
          parsedTimestamp = new Date(message.timestamp);
        }

        if (topic === `${WhalePaymentIn}_success`) {
          payment.consumedDate = parsedTimestamp;
          await this.virtualAccountPaymentDAO.updateOne(
            {
              id: payment.id,
            },
            payment,
          );
        } else if (topic === `${WhalePaymentIn}_dlq`) {
          payment.failedDate = parsedTimestamp;
          await this.virtualAccountPaymentDAO.updateOne(
            {
              id: payment.id,
            },
            payment,
          );

          await this.slackDAO.alertPaymentInDLQ(payment.id);
        }
      },
    });
  }
}
