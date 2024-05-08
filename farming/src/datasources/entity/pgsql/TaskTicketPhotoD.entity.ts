import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { TaskTicketD } from './TaskTicketD.entity';

@Entity('t_taskticketphoto_d')
export class TaskTicketPhotoD extends CMSBase {
  @Column({ name: 'ref_taskticketdetail_id', type: 'varchar', length: 32 })
  taskTicketDetailId: string;

  @Column({ name: 'image_url', type: 'varchar', length: 200 })
  imageUrl: string;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date;

  @ManyToOne(() => TaskTicketD, (ttd) => ttd.photos)
  @JoinColumn({ name: 'ref_taskticketdetail_id', referencedColumnName: 'id' })
  taskTicketD: TaskTicketD;
}
