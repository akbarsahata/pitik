import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProductItem } from './ProductItem.entity';
import { PurchaseOrder } from './PurchaseOrder.entity';

@Entity({ name: 'products_in_purchase_order', schema: 'sales' })
export class ProductsInPurchaseOrder {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_purchase_order_id', type: 'varchar', length: 36 })
  salesPurchaseOrderId: string;

  @Column({ name: 'quantity', type: 'int4' })
  quantity: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'weight', type: 'float' })
  weight: number;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @ManyToOne(() => PurchaseOrder, (spo) => spo.salesProductsInPurchaseOrder)
  @JoinColumn({ name: 'ref_sales_purchase_order_id', referencedColumnName: 'id' })
  salesPurchaseOrder: PurchaseOrder;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
