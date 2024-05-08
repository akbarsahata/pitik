import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SalesCustomer } from './Customer.entity';
import { ProductItem } from './ProductItem.entity';

@Entity({
  name: 'sales_products_in_customer',
  schema: 'sales',
})
export class ProductsInCustomer {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_customer_id', type: 'varchar', length: 36 })
  salesCustomerId: string;

  @Column({ name: 'daily_quantity', type: 'int' })
  dailyQuantity: number;

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

  @ManyToOne(() => SalesCustomer, (scv) => scv.salesProducts)
  @JoinColumn({ name: 'ref_sales_customer_id', referencedColumnName: 'id' })
  salesCustomer: SalesCustomer;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
