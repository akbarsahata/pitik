import { intervalToDuration } from 'date-fns';
import { getInstanceByToken } from 'fastify-decorators';
import { env } from '../../config/env';
import { RedisConnection } from '../../datasources/connection/redis.connection';

export function dayDifference(from: Date, to: Date): number {
  const interval = intervalToDuration({
    start: from,
    end: to,
  });
  const yearInDays = (interval?.years && interval.years * 365) || 0;
  const monthInDays = (interval?.months && interval.months * 30) || 0;
  const days = (interval?.days && interval.days) || 0;

  return yearInDays + monthInDays + days;
}

/**
 * rate limiter
 *
 * @param identifier example: request-identifier:1234567890
 * @param expire in seconds, default 300
 */
export async function rateLimiter(identifier: string, expire = 300): Promise<void> {
  if (!env.isTest) {
    const redis = getInstanceByToken<RedisConnection>(RedisConnection);

    const key = `${identifier}`;
    const value = await redis.connection.incr(key);

    // set expiration time to 5 minutes
    redis.connection.setex(key, expire, value);

    if (value > 1) {
      throw Error('rate limit exceeded');
    }
  }
}

export function createExternalId(partnerId: string, bankCode: string) {
  return `${partnerId}--${bankCode}`;
}

export function extractPartnerId(externalId: string) {
  return externalId.split('--')[0];
}

export function normalizeVirtualAccountName(name: string) {
  const newName = name
    .toUpperCase()
    .replace(/[-]+/g, ' ')
    .replace(/[^a-zA-Z ]+/g, '');
  return newName.substring(0, newName.length > 50 ? 50 : newName.length);
}

// convert array of json to csv like string
export function jsonToCsv(json: any[]): string {
  const header = `${Object.keys(json[0]).join(',')}\n`;
  const body = json.map((item) => Object.values(item).join(',')).join('\n');
  return header + body;
}
