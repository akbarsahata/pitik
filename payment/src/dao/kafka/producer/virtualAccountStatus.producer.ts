import { Inject, Service } from 'fastify-decorators';
import { ProducerRecord } from 'kafkajs';
import { KafkaConnection } from '../../../datasources/connection/kafka.connection';
import { WhaleVaStatus } from '../../../libs/constants/kafkaTopic';
import { VirtualAccountStatusMessage } from '../../../libs/interfaces/kafka-message';
import { Logger } from '../../../libs/utils/logger';

@Service()
export class VirtualAccountStatusProducer {
  @Inject(KafkaConnection)
  private kafka!: KafkaConnection;

  @Inject(Logger)
  private logger!: Logger;

  async send(body: VirtualAccountStatusMessage) {
    const message = JSON.stringify(body);

    const record: ProducerRecord = {
      topic: WhaleVaStatus,
      messages: [
        {
          value: message,
          timestamp: `${new Date().getTime()}`,
        },
      ],
      acks: -1, // message should be written to all in-sync replicas
    };

    await this.kafka.vaStatusProducer.send(record);
    this.logger.info(message, `[KAFKA] ${WhaleVaStatus} - ${body.id}`);
  }
}
