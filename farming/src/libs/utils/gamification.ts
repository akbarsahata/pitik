import { isBefore } from 'date-fns';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';

export function pointLevelling(potentialPoints: number, level = 4, roundDownDigits = 2): number[] {
  let pointPerLevel = potentialPoints / level;

  pointPerLevel -= pointPerLevel % 10 ** roundDownDigits;

  const pointAllLevels: number[] = [];

  for (let i = 1; i <= level; i += 1) {
    pointAllLevels.push(pointPerLevel * i);
  }

  pointAllLevels[level - 1] = potentialPoints;

  return pointAllLevels;
}

export function assignLevelAndTarget(
  currentPoint: number,
  pointLevellings: number[],
): [number, number] {
  for (let i = 0; i < pointLevellings.length; i += 1) {
    if (currentPoint < pointLevellings[i]) {
      return [i + 1, pointLevellings[i]];
    }
  }

  return [pointLevellings.length + 1, pointLevellings[pointLevellings.length - 1]];
}

export function isGamificationContinued(fc: FarmingCycle): boolean {
  const cirebonCityCodes = ['472', '473', '108', '109', '252', '211', '149'];

  const isInCirebon = cirebonCityCodes.some((v) => v === String(fc.farm.cityId));

  const isBefore3Nov = isBefore(fc.farmingCycleStartDate, new Date('2022-11-03'));

  return isInCirebon && isBefore3Nov;
}
