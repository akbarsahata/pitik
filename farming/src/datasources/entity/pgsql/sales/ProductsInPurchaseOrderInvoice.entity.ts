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
import { PurchaseOrderInvoice } from './PurchaseOrderInvoice.entity';

@Entity({ name: 'products_in_purchase_order_invoice', schema: 'sales' })
export class ProductsInPurchaseOrderInvoice {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_purchase_order_invoice_id', type: 'varchar', length: 36 })
  salesPurchaseOrderInvoiceId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'price', type: 'int' })
  price: number;

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

  @ManyToOne(() => PurchaseOrderInvoice, (spoi) => spoi.salesProductsInPurchaseOrderInvoice)
  @JoinColumn({ name: 'ref_sales_purchase_order_invoice_id', referencedColumnName: 'id' })
  salesPurchaseOrderInvoice: PurchaseOrderInvoice;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
