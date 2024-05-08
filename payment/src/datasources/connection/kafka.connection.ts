import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { Kafka, Producer } from 'kafkajs';
import { env } from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class KafkaConnection {
  connection!: Kafka;

  vaStatusProducer!: Producer;

  paymentInProducer!: Producer;

  @Inject(Logger)
  private logger!: Logger;

  brokers = env.KAFKA_BROKERS.split(',');

  @Initializer()
  async init() {
    this.connection = this.client();

    this.vaStatusProducer = this.connection.producer({
      idempotent: true,
      maxInFlightRequests: 1,
      retry: {
        maxRetryTime: 3,
      },
      allowAutoTopicCreation: true,
    });

    await this.vaStatusProducer.connect();

    this.paymentInProducer = this.connection.producer({
      idempotent: true,
      maxInFlightRequests: 1,
      retry: {
        maxRetryTime: 3,
      },
      allowAutoTopicCreation: true,
    });

    await this.paymentInProducer.connect();

    this.logger.info(null, 'Kafka connection initialized');
  }

  client() {
    return new Kafka({
      clientId: env.KAFKA_CLIENT_ID,
      brokers: this.brokers,
    });
  }

  @Destructor()
  async destroy() {
    await this.vaStatusProducer.disconnect();
    await this.paymentInProducer.disconnect();
  }
}
