/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProductItem } from './ProductItem.entity';

@Entity({
  name: 'operation_unit_latest_stock',
  schema: 'sales',
})
export class OperationUnitLatestStock {
  @PrimaryColumn({ name: 'ref_operation_unit_id', type: 'varchar', length: 36 })
  operationUnitId: string;

  @PrimaryColumn({ name: 'ref_product_item_id', type: 'varchar', length: 36 })
  productItemId: string;

  @Column({ name: 'total_quantity', type: 'int4' })
  totalQuantity: number;

  @Column({ name: 'total_weight', type: 'float4' })
  totalWeight: number;

  @Column({ name: 'available_quantity', type: 'int4' })
  availableQuantity: number;

  @Column({ name: 'available_weight', type: 'float4' })
  availableWeight: number;

  @Column({ name: 'reserved_quantity', type: 'int4' })
  reservedQuantity: number;

  @Column({ name: 'reserved_weight', type: 'float4' })
  reservedWeight: number;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_product_item_id', referencedColumnName: 'id' })
  productItem: ProductItem;
}
