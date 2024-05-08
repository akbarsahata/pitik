/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'fastify-decorators';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { RedisConnection } from '../connection/redis.connection';
import { Target } from '../entity/pgsql/Target.entity';

@EventSubscriber()
@Service()
export class TargetSubscriber implements EntitySubscriberInterface<Target> {
  @Inject(RedisConnection)
  private redis!: RedisConnection;

  /**
   * Indicates that this subscriber only listen to Target events.
   */
  listenTo() {
    return Target;
  }

  afterUpdate(event: UpdateEvent<Target>): void | Promise<any> {
    if (event && event.entity) {
      return Promise.all([
        this.redis.connection.keys(`*${event.entity.chickTypeId}*`),
        this.redis.connection.keys(`*${event.entity.coopTypeId}*`),
        this.redis.connection.keys(`*${event.entity.variableId}*`),
      ]).then(([chickTypeIdKeys, coopTypeIdKeys, variableIdKeys]) => {
        const keys = [...chickTypeIdKeys, ...coopTypeIdKeys, ...variableIdKeys].filter(
          (val, idx, self) => self.indexOf(val) === idx,
        );
        return keys.length && this.redis.connection.del(keys);
      });
    }

    return Promise.resolve();
  }
}
