/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { TaskTicket } from './TaskTicket.entity';

export enum FeedStockOperatorEnum {
  PLUS = '+',
  MINUS = '-',
}

@Entity('t_farmingcyclefeedstock_d')
export class FarmingCycleFeedStockD extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_user_id', type: 'varchar', length: 32 })
  userId: string;

  @Column({ name: 'ref_taskticket_id', type: 'varchar', length: 32 })
  taskTicketId: string;

  @Column({ name: 'ref_taskticketd_id', type: 'varchar', length: 32 })
  taskTicketDId: string;

  @Column({ name: 'operator', type: 'varchar', length: 32 })
  operator: string;

  @Column({ name: 'qty', type: 'float' })
  qty: number;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @Column({ name: 'feed_product_detail', type: 'text', nullable: true })
  productDetail: string | null;

  @Column({ name: 'consumed_date', type: 'date' })
  consumedDate: string;

  @Column({ name: 'uom', type: 'varchar', default: 'karung' })
  uom: string;

  @ManyToOne(() => FarmingCycle, (fc) => fc.taskTickets)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @ManyToOne(() => TaskTicket, (tt) => tt.feedStocks)
  @JoinColumn({ name: 'ref_taskticket_id', referencedColumnName: 'id' })
  taskTicket: TaskTicket;
}
