import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { InternalTransfer } from './InternalTransfer.entity';
import { ProductItem } from './ProductItem.entity';

@Entity({ name: 'products_in_internal_transfer', schema: 'sales' })
export class ProductsInInternalTransfer {
  @PrimaryColumn({ name: 'ref_internal_transfer_id', length: 36 })
  internalTransferId: string;

  @PrimaryColumn({ name: 'ref_product_item_id', length: 36 })
  productItemId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp' })
  deletedDate: Date | null;

  @OneToOne(() => InternalTransfer)
  @JoinColumn({ name: 'ref_internal_transfer_id' })
  internalTransfer: InternalTransfer;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_product_item_id' })
  productItem: ProductItem;
}
