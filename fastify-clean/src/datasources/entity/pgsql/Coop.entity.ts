import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { ChickInRequest } from './ChickInRequest.entity';
import { ChickType } from './ChickType.entity';
import { Contract } from './Contract.entity';
import { ControllerType } from './ControllerType.entity';
import { CoopImage } from './CoopImage.entity';
import { CoopMemberD } from './CoopMemberD.entity';
import { CoopType } from './CoopType.entity';
import { Farm } from './Farm.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { HeaterType } from './HeaterType.entity';
import { InletType } from './InletType.entity';
import { PurchaseRequest } from './PurchaseRequest.entity';
import { TransferRequest } from './TransferRequest.entity';
import { User } from './User.entity';

@Entity('t_coop')
export class Coop extends CMSBase {
  @Column({ name: 'coop_code', type: 'varchar', length: 50 })
  coopCode: string;

  @Column({ name: 'coop_name', type: 'varchar', length: 50 })
  coopName: string;

  @Column({ name: 'ref_farm_id', type: 'varchar', length: 32 })
  farmId: string;

  @Column({ name: 'ref_cooptype_id', type: 'varchar', length: 32 })
  coopTypeId: string;

  @Column({ name: 'ref_chicktype_id', type: 'varchar', length: 32 })
  chickTypeId: string;

  @Column({ name: 'chick_in_date', type: 'date' })
  chickInDate: string | null;

  @Column({ name: 'num_fan', type: 'int' })
  numFan: number;

  @Column({ name: 'capacity_fan', type: 'float' })
  capacityFan: number;

  @Column({ name: 'height', type: 'float' })
  height: number;

  @Column({ name: 'length', type: 'float' })
  length: number;

  @Column({ name: 'width', type: 'float' })
  width: number;

  @Column({ name: 'max_capacity', type: 'int' })
  maxCapacity: number;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'user_supervisor_id', type: 'varchar', length: 50 })
  userSupervisorId: string | null;

  @OneToOne(() => Farm)
  @JoinColumn({ name: 'ref_farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @OneToOne(() => CoopType)
  @JoinColumn({ name: 'ref_cooptype_id', referencedColumnName: 'id' })
  coopType: CoopType;

  @OneToMany(() => CoopMemberD, (coopMember) => coopMember.coop)
  @JoinColumn({ referencedColumnName: 'id' })
  coopMembers?: CoopMemberD[];

  @OneToOne(() => ControllerType)
  @JoinColumn({ name: 'ref_tipecontroller_id', referencedColumnName: 'id' })
  controllerType: ControllerType | null;

  @Column({ name: 'tipe_controller', type: 'varchar', length: 50 })
  otherControllerType: string;

  @OneToOne(() => InletType)
  @JoinColumn({ name: 'ref_tipeinlet_id', referencedColumnName: 'id' })
  inletType: InletType;

  @Column({ name: 'tipe_inlet', type: 'varchar', length: 50 })
  otherInletType: string;

  @OneToOne(() => HeaterType)
  @JoinColumn({ name: 'ref_tipepemanas_id', referencedColumnName: 'id' })
  heaterType: HeaterType | null;

  @Column({ name: 'tipe_pemanas', type: 'varchar', length: 50 })
  otherHeaterType: string;

  @OneToMany(() => CoopImage, (coopImage) => coopImage.coop)
  @JoinColumn({ referencedColumnName: 'id' })
  coopImages: CoopImage[];

  @OneToOne(() => ChickType)
  @JoinColumn({ name: 'ref_chicktype_id', referencedColumnName: 'id' })
  chickType: ChickType;

  @Column({ name: 'active_farmingcycle_id', type: 'varchar', length: 32, nullable: true })
  activeFarmingCycleId?: string | null;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'active_farmingcycle_id', referencedColumnName: 'id' })
  activeFarmingCycle: FarmingCycle;

  @Column({ name: 'last_closed_date', type: 'date' })
  lastClosedDate?: string;

  @Column({ name: 'total_period', type: 'int' })
  totalPeriod: number;

  @Column({ name: 'chickinrequest_id', type: 'varchar', length: 32 })
  chickInRequestId?: string | null;

  @Column({ name: 'timezone', type: 'varchar', length: 10 })
  timezone: string;

  @Column({ name: 'ref_contract_id', type: 'varchar', length: 32 })
  contractId?: string | null;

  @OneToOne(() => ChickInRequest)
  @JoinColumn({ name: 'chickinrequest_id', referencedColumnName: 'id' })
  chickInRequest?: ChickInRequest;

  @OneToMany(() => TransferRequest, (tr) => tr.coopSource)
  @JoinColumn({ referencedColumnName: 'id' })
  exitingTransferRequests: TransferRequest[];

  @OneToMany(() => TransferRequest, (tr) => tr.coopTarget)
  @JoinColumn({ referencedColumnName: 'id' })
  enteringTransferRequests: TransferRequest[];

  @Column({ name: 'purchase_request_ovk_id', type: 'varchar', length: 32 })
  purchaseRequestOvkId: string | null;

  @ManyToOne(() => PurchaseRequest)
  @JoinColumn({ name: 'purchase_request_ovk_id', referencedColumnName: 'id' })
  purchaseRequestOvk?: PurchaseRequest;

  @OneToOne(() => Contract)
  @JoinColumn({ name: 'ref_contract_id', referencedColumnName: 'id' })
  contract: Contract;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
