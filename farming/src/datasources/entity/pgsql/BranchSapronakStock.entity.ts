import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from './Branch.entity';

@Entity('branch_sapronak_stock')
export class BranchSapronakStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'branch_id', type: 'varchar' })
  branchId: string;

  @Column({ name: 'category_code', type: 'varchar' })
  categoryCode: string;

  @Column({ name: 'category_name', type: 'varchar' })
  categoryName: string;

  @Column({ name: 'subcategory_code', type: 'varchar' })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar' })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'quantity', type: 'float8' })
  quantity: number;

  @Column({ name: 'booked_quantity', type: 'float8' })
  bookedQuantity: number;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar' })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => Branch)
  @JoinColumn({ referencedColumnName: 'id', name: 'branch_id' })
  branch: Branch;
}
