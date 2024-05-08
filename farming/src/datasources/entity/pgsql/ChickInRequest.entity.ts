import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Coop } from './Coop.entity';
import { Farm } from './Farm.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { PurchaseRequest } from './PurchaseRequest.entity';
import { User } from './User.entity';

@Entity('chickinrequest')
export class ChickInRequest extends CMSBase {
  @Column({ name: 'coop_id', type: 'varchar', length: 32 })
  coopId: string;

  @Column({ name: 'farm_id', type: 'varchar', length: 32 })
  farmId: string;

  @Column({ name: 'user_owner_id', type: 'varchar', length: 32 })
  userOwnerId: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'initial_population', type: 'int' })
  initialPopulation: number;

  @Column({ name: 'chickin_date', type: 'date' })
  chickInDate: string;

  @Column({ name: 'is_approved', type: 'bool' })
  isApproved: boolean | null;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 32 })
  approvedBy: string | null;

  @Column({ name: 'approved_date', type: 'date' })
  approvedDate: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @OneToOne(() => Coop)
  @JoinColumn({ name: 'coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @OneToOne(() => Farm)
  @JoinColumn({ name: 'farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_owner_id', referencedColumnName: 'id' })
  userOwner: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'approved_by', referencedColumnName: 'id' })
  userApprover: User;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => PurchaseRequest, (pr) => pr.chickInRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  purchaseRequests: PurchaseRequest[];
}
