/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FarmingCycle } from './FarmingCycle.entity';
import { TaskTicket } from './TaskTicket.entity';

export enum OvkStockOperatorEnum {
  PLUS = '+',
  MINUS = '-',
}

@Entity('farmingcycle_ovkstock_log')
export class FarmingCycleOvkStockLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar' })
  farmingCycleId: string;

  @Column({ name: 'subcategory_code', type: 'varchar' })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar' })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'quantity', type: 'float8' })
  quantity: number;

  @Column({ name: 'operator', type: 'char' })
  operator: string;

  @Column({ name: 'taskticket_id', type: 'varchar' })
  taskTicketId: string;

  @Column({ name: 'taskticket_d_id', type: 'varchar' })
  taskTicketDId: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'remarks', type: 'varchar' })
  remarks: string;

  @Column({ name: 'consumed_date', type: 'date' })
  consumedDate: string;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @ManyToOne(() => TaskTicket, (tt) => tt.feedStocks)
  @JoinColumn({ name: 'taskticket_id', referencedColumnName: 'id' })
  taskTicket: TaskTicket;
}
