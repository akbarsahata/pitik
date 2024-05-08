import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { HarvestDeal } from './HarvestDeal.entity';
import { HarvestRealization } from './HarvestRealization.entity';
import { User } from './User.entity';

@Entity('harvest_request')
export class HarvestRequest extends CMSBase {
  @Column({ name: 'farming_cycle_id', type: 'varchar', length: 50 })
  farmingCycleId: string;

  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'date_planned', type: 'date' })
  datePlanned: string;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'min_weight', type: 'float' })
  minWeight: number;

  @Column({ name: 'max_weight', type: 'float' })
  maxWeight: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'is_approved', type: 'bool' })
  isApproved: boolean;

  @Column({ name: 'approved_by', type: 'varchar', length: 50 })
  approvedBy: string;

  @Column({ name: 'approved_date', type: 'timestamp' })
  approvedDate: string;

  @Column({ name: 'approval_remarks', type: 'text' })
  approvalRemarks: string;

  @Column({ name: 'ref_harvest_request_id', type: 'varchar', length: 50 })
  requestReferral: string;

  @Column({ name: 'ref_harvest_realization_id', type: 'varchar', length: 50 })
  realizationReferral: string;

  @ManyToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farming_cycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => HarvestRequest, (hr) => hr.refHarvestRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  additionalRequests: HarvestRequest[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'approved_by', referencedColumnName: 'id' })
  approver: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;

  @OneToMany(() => HarvestDeal, (hd) => hd.harvestRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  harvestDeals: HarvestDeal[];

  @ManyToOne(() => HarvestRequest)
  @JoinColumn({ name: 'ref_harvest_request_id', referencedColumnName: 'id' })
  refHarvestRequest: HarvestRequest;

  @ManyToOne(() => HarvestRealization)
  @JoinColumn({ name: 'ref_harvest_realization_id', referencedColumnName: 'id' })
  refHarvestRealization: HarvestRealization;
}
