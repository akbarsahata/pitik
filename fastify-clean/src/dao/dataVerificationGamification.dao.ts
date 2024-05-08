import { utcToZonedTime } from 'date-fns-tz';
import { Service, Inject, Initializer } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DataVerificationGamification } from '../datasources/entity/pgsql/DataVerificationGamification.entity';
import { DataVerificationGamificationD } from '../datasources/entity/pgsql/DataVerificationGamificationD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DATA_VERIFICATION_GAMIFICATION_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class DataVerificationGamificationDAO {
  @Inject(PostgreSQLConnection)
  private pSql: PostgreSQLConnection;

  private repository!: Repository<DataVerificationGamification>;

  private verificationDetailRepository!: Repository<DataVerificationGamificationD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(DataVerificationGamification);
    this.verificationDetailRepository = this.pSql.connection.getRepository(
      DataVerificationGamificationD,
    );
  }

  async createWithDetails(
    data: Partial<DataVerificationGamification>,
    details: Partial<DataVerificationGamificationD>[],
    userId: string,
  ): Promise<DataVerificationGamification> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const verification = this.repository.create({
      ...data,
      id: randomHexString(),
      onTimeStatus: undefined,
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    const verificationDetails = details.map((d) =>
      this.verificationDetailRepository.create({
        ...d,
        id: randomHexString(),
        dataVerificationGamificationId: verification.id,
        hasCorrectData: undefined,
      }),
    );

    await this.repository.save(verification);

    await this.verificationDetailRepository.save(verificationDetails);

    return {
      ...verification,
      details: verificationDetails,
    };
  }

  async getManyAndCount(
    params: FindManyOptions<DataVerificationGamification>,
  ): Promise<[DataVerificationGamification[], number]> {
    const result = await this.repository.findAndCount(params);

    return result;
  }

  async getOne(
    params: FindOneOptions<DataVerificationGamification>,
  ): Promise<DataVerificationGamification> {
    try {
      const dataVerification = await this.repository.findOneOrFail(params);

      return dataVerification;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_DATA_VERIFICATION_GAMIFICATION_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getCorrectionPercentageByFarmingCycle(farmingCycleId: string): Promise<number> {
    const [verifications, verificationsCount] = await this.repository.findAndCount({
      where: {
        farmingCycleId,
        userVerifierId: Not(IsNull()),
      },
      relations: {
        details: true,
      },
    });

    if (!verificationsCount) return 0;

    const flattenDetails = verifications.reduce(
      (details: DataVerificationGamificationD[], verification) => [
        ...details,
        ...verification.details,
      ],
      [],
    );

    const correctDataCount = flattenDetails.reduce((count, data) => {
      if (data.hasCorrectData) return count + 1;

      return count;
    }, 0);

    // prettier-ignore
    return (correctDataCount / flattenDetails.length) * 100;
  }
}
