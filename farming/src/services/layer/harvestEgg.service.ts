import { Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { HarvestEggDAO } from '../../dao/layer/harvestEgg.dao';
import { ProductInHarvestEggDAO } from '../../dao/layer/productInHarvestEgg.dao';
import { Transactional } from '../../libs/decorators/transactional';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class HarvestEggService {
  @Inject(HarvestEggDAO)
  private harvestEggDAO!: HarvestEggDAO;

  @Inject(ProductInHarvestEggDAO)
  private productInHarvestEggDAO!: ProductInHarvestEggDAO;

  @Transactional()
  async upsertHarvestEgg(
    user: RequestUser,
    farmingCycleId: string,
    date: string,
    isAbnormal: boolean,
    disposal: number,
    harvestedEgg: {
      productItemId: string;
      quantity: number;
      weight: number;
    }[],
    queryRunner: QueryRunner,
  ) {
    // check existing harvest
    const existingHarvest = await this.harvestEggDAO.getOneWithTx(
      {
        where: {
          farmingCycleId,
          date: new Date(date),
        },
      },
      queryRunner,
    );

    // upsert harvest
    const harvest = await this.harvestEggDAO.upsertOne(
      user,
      {
        ...existingHarvest,
        farmingCycleId,
        date: new Date(date),
        totalQuantity: harvestedEgg.reduce((acc, cur) => acc + cur.quantity, 0),
        totalWeight: harvestedEgg.reduce((acc, cur) => acc + cur.weight, 0),
        isAbnormal,
        disposal,
        createdBy: user.id,
        createdDate: new Date(),
        modifiedBy: user.id,
        modifiedDate: new Date(),
      },
      {
        qr: queryRunner,
      },
    );

    await this.productInHarvestEggDAO.softDeleteManyWithTx(
      {
        harvestEggId: harvest.id,
      },
      queryRunner,
    );

    // upsert egg into product_in_harvest_egg table
    await this.productInHarvestEggDAO.upsertMany(
      user,
      harvestedEgg.map((egg) => ({
        harvestEggId: harvest.id,
        productItemId: egg.productItemId,
        quantity: egg.quantity,
        weight: egg.weight,
      })),
      {
        qr: queryRunner,
      },
    );
  }
}
