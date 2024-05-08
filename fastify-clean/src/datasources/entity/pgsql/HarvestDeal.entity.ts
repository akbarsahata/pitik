import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { HarvestRequest } from './HarvestRequest.entity';
import { CMSBase } from './Base.entity';
import { HarvestRealization } from './HarvestRealization.entity';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('harvest_deal')
export class HarvestDeal extends CMSBase {
  @Column({ name: 'harvest_request_id', type: 'varchar', length: 50 })
  harvestRequestId: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'date_planned', type: 'date' })
  datePlanned: string;

  @Column({ name: 'bakul_name', type: 'varchar', length: 50 })
  bakulName: string;

  @Column({ name: 'min_weight', type: 'float' })
  minWeight: number;

  @Column({ name: 'max_weight', type: 'float' })
  maxWeight: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'status', type: 'bool' })
  status: boolean;

  @ManyToOne(() => HarvestRequest)
  @JoinColumn({ name: 'harvest_request_id', referencedColumnName: 'id' })
  harvestRequest: HarvestRequest;

  @ManyToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => HarvestRealization, (hre) => hre.harvestDeal)
  @JoinColumn({ referencedColumnName: 'id' })
  harvestRealizations: HarvestRealization[];
}
