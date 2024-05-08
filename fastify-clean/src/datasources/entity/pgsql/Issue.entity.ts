/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { IssueStatusEnum } from '../../../dto/issue.dto';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { FarmingCycleAlertD } from './FarmingCycleAlertD.entity';
import { IssuePhotoD } from './IssuePhotoD.entity';

@Entity('t_issue')
export class Issue extends CMSBase {
  @Column({ name: 'issue_code', type: 'varchar', length: 40 })
  code: string;

  @Column({ name: 'issue_date', type: 'date' })
  date: string;

  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_farmingcyclealert_id', type: 'varchar', length: 32 })
  farmingCycleAlertId: string;

  @Column({ name: 'other_issue', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  otherIssue: boolean;

  @Column({ name: 'other_issue_name', type: 'varchar', length: 50 })
  otherIssueName: string;

  @Column({ name: 'issue_description', type: 'text' })
  description: string;

  @Column({ name: 'issue_status', type: 'enum', enum: IssueStatusEnum })
  issueStatus: IssueStatusEnum;

  @Column({
    name: 'status',
    type: 'smallint',
    default: 0,
    transformer: new BoolSmallIntTransformer(),
  })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToOne(() => FarmingCycleAlertD)
  @JoinColumn({ name: 'ref_farmingcyclealert_id', referencedColumnName: 'id' })
  farmingCycleAlert: FarmingCycleAlertD;

  @OneToMany(() => IssuePhotoD, (ip) => ip.issue)
  @JoinColumn({ referencedColumnName: 'id' })
  photos: IssuePhotoD[];

  dayNum: number;
}
