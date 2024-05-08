import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { TaskTicketD } from './TaskTicketD.entity';

@Entity('t_taskticketvideo_d')
export class TaskTicketVideoD extends CMSBase {
  @Column({ name: 'ref_taskticketdetail_id', type: 'varchar', length: 32 })
  taskTicketDetailId: string;

  @Column({ name: 'video_url', type: 'varchar', length: 200 })
  videoUrl: string;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date;

  @Column({ name: 'url_compress', type: 'varchar', length: 4000 })
  urlCompress: string;

  @ManyToOne(() => TaskTicketD, (ttd) => ttd.videos)
  @JoinColumn({ name: 'ref_taskticketdetail_id', referencedColumnName: 'id' })
  taskTicketD: TaskTicketD;
}
