/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { HarvestRealization } from './HarvestRealization.entity';
import { HarvestRequest } from './HarvestRequest.entity';

export enum HarvestDealStatusEnum {
  AVAILABLE = 'AVAILABLE',
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

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

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'status', type: 'varchar', enum: HarvestDealStatusEnum })
  status: HarvestDealStatusEnum;

  @Column({ name: 'truck_license_plate', type: 'varchar', length: 50 })
  truckLicensePlate: string | null;

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
