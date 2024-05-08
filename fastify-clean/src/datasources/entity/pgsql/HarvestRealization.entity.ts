/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { HarvestDeal } from './HarvestDeal.entity';
import { HarvestRealizationRecord } from './HarvestRealizationRecord.entity';
import { HarvestRequest } from './HarvestRequest.entity';
import { SmartScaleWeighing } from './SmartScaleWeighing.entity';

export enum RealizationStatusEnum {
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
  FINAL = 'FINAL',
}

@Entity('harvest_realization')
export class HarvestRealization extends CMSBase {
  @Column({ name: 'harvest_deal_id', type: 'varchar', length: 50 })
  harvestDealId: string;

  @Column({ name: 'farming_cycle_id', type: 'varchar', length: 50 })
  farmingCycleId: string;

  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'harvest_date', type: 'date' })
  harvestDate: string;

  @Column({ name: 'tonnage', type: 'float' })
  tonnage: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weighing_time', type: 'time' })
  weighingTime: string;

  @Column({ name: 'weighing_number', type: 'varchar', length: 50 })
  weighingNumber: string;

  @Column({ name: 'truck_departing_time', type: 'time' })
  truckDepartingTime: string | null;

  @Column({ name: 'driver', type: 'varchar', length: 50 })
  driver: string;

  @Column({ name: 'truck_license_plate', type: 'varchar', length: 50 })
  truckLicensePlate: string;

  @Column({ name: 'smartscaleweighingid', type: 'varchar', length: 32 })
  smartScaleWeighingId: string;

  @Column({ name: 'witness_name', type: 'varchar', length: 50 })
  witnessName: string;

  @Column({ name: 'receiver_name', type: 'varchar', length: 50 })
  receiverName: string;

  @Column({ name: 'weigher_name', type: 'varchar', length: 50 })
  weigherName: string;

  @Column({ name: 'status', type: 'varchar', enum: ['DRAFT', 'FINAL', 'DELETED'] })
  status: RealizationStatusEnum | null;

  @ManyToOne(() => HarvestDeal)
  @JoinColumn({ name: 'harvest_deal_id', referencedColumnName: 'id' })
  harvestDeal: HarvestDeal;

  @ManyToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farming_cycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => HarvestRealizationRecord, (hrer) => hrer.harvestRealization)
  @JoinColumn({ referencedColumnName: 'id' })
  harvestRealizationRecords: HarvestRealizationRecord[];

  @OneToMany(() => HarvestRequest, (hr) => hr.refHarvestRealization)
  @JoinColumn({ referencedColumnName: 'id' })
  additionalRequests: HarvestRequest[];

  @OneToOne(() => SmartScaleWeighing)
  @JoinColumn({ name: 'smartscaleweighingid' })
  smartScaleWeighing: SmartScaleWeighing | null;
}
