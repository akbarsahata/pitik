/* eslint-disable no-underscore-dangle */
import { genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { intervalToDuration } from 'date-fns';
import { getInstanceByToken } from 'fastify-decorators';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { Role } from '../../datasources/entity/pgsql/Role.entity';
import { RoleRank } from '../../datasources/entity/pgsql/RoleRank.entity';
import { UserRole } from '../../datasources/entity/pgsql/UserRole.entity';
import { ROLE_RANK_CONTEXT } from '../constants';
import { emailRegexp } from '../constants/regexp';

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
 * create random hex string with length double the parameter
 * @param length default 16
 * @returns string random hex
 */
export function randomHexString(length = 16): string {
  return randomBytes(length).toString('hex');
}

export async function generateHashedPassword(text: string, round = 10) {
  const salt = await genSalt(round);

  let password = await hash(text, salt);
  password = password.replace(/^\$2a/i, '$2y');

  return password;
}

export async function sleep(ms: number) {
  return new Promise((resolve: Function) => setTimeout(resolve, ms));
}

/**
 * isRoleAllowed check if inputRole exist in expectedRoles
 */
export function isRoleAllowed(inputRole: string, expectedRoles: string[]): boolean {
  return expectedRoles.some((val) => val.toUpperCase() === inputRole.toUpperCase());
}

export function isEmail(email: string) {
  return emailRegexp.test(email);
}

export function generateApiName(endpoint: string): string {
  const [, ...rest] = endpoint.split('/');
  const finalEndpointName = rest.length > 0 ? rest.join('-').replace(':', '') : endpoint;
  return finalEndpointName;
}

export function removeTrailingSlash(endpoint: string): string {
  return endpoint.replace(/\/$/, '');
}

/**
 * determinePrimaryRole will return 1 role from set of roles
 * temporary used until Pitik App support multiple role
 */
export function determinePrimaryRole(roles: Role[]): Role {
  if (roles.length === 1) return roles[0];

  const internalRoles = roles
    .filter((role) => role.roleRank.find((rank) => rank.context === ROLE_RANK_CONTEXT.internal))
    .sort(
      (a, b) =>
        a.roleRank.sort((rankA, rankB) => rankA.rank - rankB.rank)[0].rank -
        b.roleRank.sort((rankA, rankB) => rankA.rank - rankB.rank)[0].rank,
    );
  if (internalRoles.length) return internalRoles[0];

  const ownerAppRoles = roles
    .filter((role) => role.roleRank.find((rank) => rank.context === ROLE_RANK_CONTEXT.ownerApp))
    .sort(
      (a, b) =>
        a.roleRank.sort((rankA, rankB) => rankA.rank - rankB.rank)[0].rank -
        b.roleRank.sort((rankA, rankB) => rankA.rank - rankB.rank)[0].rank,
    );
  if (ownerAppRoles.length) return ownerAppRoles[0];

  return roles[0];
}

export function getHighestRoleRankPerContext(
  userRoles: UserRole[],
  additionalRoleRank?: RoleRank[],
) {
  const highestRoleRankPerContext = {
    internal: userRoles.reduce((prev, item) => {
      const ranks = item.role.roleRank
        .filter((rr) => rr.context === ROLE_RANK_CONTEXT.internal)
        .sort((a, b) => a.rank - b.rank);

      if (ranks.length > 0 && (prev === -1 || ranks[0].rank < prev)) return ranks[0].rank;

      return prev;
    }, 99),

    ownerApp: userRoles.reduce((prev, item) => {
      const ranks = item.role.roleRank
        .filter((rr) => rr.context === ROLE_RANK_CONTEXT.ownerApp)
        .sort((a, b) => a.rank - b.rank);

      if (ranks.length > 0 && (prev === -1 || ranks[0].rank < prev)) return ranks[0].rank;

      return prev;
    }, -1),

    downstream: userRoles.reduce((prev, item) => {
      const ranks = item.role.roleRank
        .filter((rr) => rr.context === ROLE_RANK_CONTEXT.downstream)
        .sort((a, b) => a.rank - b.rank);

      if (ranks.length > 0 && (prev === -1 || ranks[0].rank < prev)) return ranks[0].rank;

      return prev;
    }, -1),
  };

  for (let i = 0; additionalRoleRank && i < additionalRoleRank.length; i += 1) {
    const roleRank = additionalRoleRank[i];

    switch (roleRank.context) {
      case ROLE_RANK_CONTEXT.internal:
        highestRoleRankPerContext.internal = Math.min(
          highestRoleRankPerContext.internal,
          roleRank.rank,
        );
        break;
      case ROLE_RANK_CONTEXT.ownerApp:
        highestRoleRankPerContext.ownerApp = Math.min(
          highestRoleRankPerContext.ownerApp,
          roleRank.rank,
        );
        break;
      case ROLE_RANK_CONTEXT.downstream:
        highestRoleRankPerContext.downstream = Math.min(
          highestRoleRankPerContext.downstream,
          roleRank.rank,
        );
        break;
      default:
        break;
    }
  }
  return highestRoleRankPerContext;
}

// delete redis keys with scan so it won't block the main thread
export async function deleteRedisKeys(pattern: string) {
  const redisConnection = getInstanceByToken<RedisConnection>(RedisConnection);
  const stream = redisConnection.connection.scanStream({
    match: pattern,
  });

  stream.on('data', async (keys: string[]) => {
    const pipeline = redisConnection.connection.pipeline();
    keys.forEach((key) => {
      pipeline.del(key);
    });
    pipeline.exec();
  });

  await new Promise((resolve) => {
    stream.on('end', resolve);
  });
}
