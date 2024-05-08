import { Inject, Service } from 'fastify-decorators';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { RedisConnection } from '../../datasources/connection/redis.connection';

@Service()
export class CoopCacheUtil {
  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  async invalidateCoopCache(coopId: string, type: 'idle' | 'active' | 'both') {
    const [coopMembers, count] = await this.coopMemberDDAO.getMany({
      where: {
        coopId,
      },
      select: {
        userId: true,
      },
    });

    if (count < 1) return;

    const cacheKeys = coopMembers.flatMap((cm) => {
      if (type === 'active') {
        return `coops:active:user_id:${cm.userId}`;
      }

      if (type === 'idle') {
        return `coops:idle:user_id:${cm.userId}`;
      }

      return [`coops:active:user_id:${cm.userId}`, `coops:idle:user_id:${cm.userId}`];
    });

    await this.redisConnection.connection.del(cacheKeys);
  }
}
