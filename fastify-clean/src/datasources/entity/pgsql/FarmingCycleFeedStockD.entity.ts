import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';

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

  @ManyToOne(() => FarmingCycle, (fc) => fc.feedStocks)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
