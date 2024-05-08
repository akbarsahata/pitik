import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { City } from './City.entity';

@Entity('branch_city')
export class BranchCity {
  @PrimaryColumn({ name: 'ref_city_id', type: 'int' })
  cityId: number;

  @Column({ name: 'ref_branch_id', type: 'varchar', length: 32 })
  branchId: string;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @ManyToOne(() => Branch, (branch) => branch.branchCities)
  @JoinColumn({ name: 'ref_branch_id' })
  branch: Branch;

  @OneToOne(() => City)
  @JoinColumn({ name: 'ref_city_id' })
  city: City;
}
