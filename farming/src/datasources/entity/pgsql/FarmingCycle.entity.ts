import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { ChickType } from './ChickType.entity';
import { Contract } from './Contract.entity';
import { Coop } from './Coop.entity';
import { DailyMonitoring } from './DailyMonitoring.entity';
import { DailyPerformanceD } from './DailyPerformanceD.entity';
import { Farm } from './Farm.entity';
import { FarmingCycleChickStockD } from './FarmingCycleChickStockD.entity';
import { FarmingCycleFeedStockD } from './FarmingCycleFeedStockD.entity';
import { FarmingCycleMemberD } from './FarmingCycleMemberD.entity';
import { HarvestRealization } from './HarvestRealization.entity';
import { HarvestRequest } from './HarvestRequest.entity';
import { Repopulation } from './Repopulation.entity';
import { TaskTicket } from './TaskTicket.entity';
import { TransferRequest } from './TransferRequest.entity';
import { User } from './User.entity';

@Entity('t_farmingcycle')
export class FarmingCycle extends CMSBase {
  @Column({ name: 'farmingcycle_code', type: 'varchar', length: 50 })
  farmingCycleCode: string;

  @Column({ name: 'chick_in_date', type: 'date' })
  chickInDate: string;

  @Column({ name: 'farmingcycle_startdate', type: 'varchar' })
  farmingCycleStartDate: Date;

  @Column({ name: 'closed_date', type: 'varchar' })
  closedDate: Date;

  @Column({ name: 'ref_farm_id', type: 'varchar', length: 50 })
  farmId: string;

  @Column({ name: 'ref_coop_id', type: 'varchar', length: 50 })
  coopId: string;

  @Column({ name: 'ref_user_ppl_id', type: 'varchar', length: 50 })
  userPplId: string;

  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 50 })
  farmingCycleId: string;

  @Column({ name: 'ref_chicktype_id', type: 'varchar', length: 50 })
  chickTypeId: string;

  @Column({ name: 'ref_feedbrand_id', type: 'varchar', length: 50 })
  feedBrandId: string;

  @Column({ name: 'initial_population', type: 'int' })
  initialPopulation: number;

  @Column({ name: 'initial_feedstock', type: 'decimal' })
  initialFeedStock: number;

  @Column({ name: 'chick_supplier', type: 'varchar', length: 50 })
  chickSupplier: string;

  @Column({ name: 'hatchery', type: 'varchar', length: 50 })
  hatchery: string;

  @Column({ name: 'cycle_status', type: 'bool', default: true })
  cycleStatus: boolean;

  @Column({ name: 'farming_status', type: 'char', length: 1 })
  farmingStatus: string;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'actual_doc_in', type: 'timestamp' })
  actualDocIn: Date | null;

  @Column({ name: 'truck_departure_hatchery', type: 'timestamp' })
  truckDepartureTime: Date;

  @Column({ name: 'truck_arrival_hatchery', type: 'timestamp' })
  truckArrivalTime: Date;

  @Column({ name: 'truck_finished_chick_in', type: 'time' })
  truckFinishChickIn: string;

  @Column({ name: 'doc_in_bw', type: 'float' })
  docInBW: number | null;

  @Column({ name: 'doc_in_uniformity', type: 'float' })
  docInUniformity: number | null;

  @Column({ name: 'contract', type: 'varchar' })
  contractId: string | null;

  @Column({ name: 'additional_population', type: 'int' })
  additionalPopulation: number;

  @Column({ name: 'pullet_in_weeks', type: 'int' })
  pulletInWeeks: number | null;

  @Column({ name: 'photos', type: 'jsonb' })
  photos?: {
    photos: string[];
    suratJalanPhotos: string[];
    docInFormPhotos: string[];
    pulletInFormPhotos: string[];
  };

  @OneToOne(() => Farm)
  @JoinColumn({ name: 'ref_farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @OneToOne(() => Coop)
  @JoinColumn({ name: 'ref_coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @OneToOne(() => ChickType)
  @JoinColumn({ name: 'ref_chicktype_id', referencedColumnName: 'id' })
  chickType: ChickType;

  @OneToMany(() => TaskTicket, (tt) => tt.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  taskTickets: TaskTicket[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_ppl_id', referencedColumnName: 'id' })
  userPpl: User;

  @OneToMany(() => FarmingCycleMemberD, (farmingCycleMember) => farmingCycleMember.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  farmingCycleMembers: FarmingCycleMemberD[];

  @OneToMany(() => FarmingCycleChickStockD, (stock) => stock.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  chickStocks: FarmingCycleChickStockD[];

  @OneToMany(() => FarmingCycleFeedStockD, (feedStock) => feedStock.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  feedStocks: FarmingCycleFeedStockD[];

  @OneToMany(() => DailyMonitoring, (d) => d.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  dailyMonitoring: DailyMonitoring[];

  @OneToMany(() => TransferRequest, (tr) => tr.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  transferRequestsExit: TransferRequest[];

  @OneToMany(() => TransferRequest, (tr) => tr.farmingCycleTarget)
  @JoinColumn({ referencedColumnName: 'id' })
  transferRequestsEnter: TransferRequest[];

  @OneToMany(() => DailyPerformanceD, (tr) => tr.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  summary: DailyPerformanceD[];

  @OneToMany(() => HarvestRequest, (hr) => hr.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  harvestRequests: HarvestRequest[];

  @OneToMany(() => HarvestRealization, (hrer) => hrer.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  harvestRealizations: HarvestRealization[];

  @OneToMany(() => Repopulation, (rep) => rep.farmingCycle)
  @JoinColumn({ referencedColumnName: 'id' })
  repopulations: Repopulation[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToOne(() => Contract)
  @JoinColumn({ name: 'contract' })
  contract: Contract | null;
}
