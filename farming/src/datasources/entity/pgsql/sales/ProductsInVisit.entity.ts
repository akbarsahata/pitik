import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { SalesCustomerVisit } from './CustomerVisit.entity';
import { ProductItem } from './ProductItem.entity';

@Entity({
  name: 'sales_products_in_visit',
  schema: 'sales',
})
export class ProductsInVisit {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_customer_visit_id', type: 'varchar', length: 36 })
  salesCustomerVisitId: string;

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

  @ManyToOne(() => SalesCustomerVisit, (scv) => scv.salesProductsInVisit)
  @JoinColumn({ name: 'ref_sales_customer_visit_id', referencedColumnName: 'id' })
  salesCustomerVisit: SalesCustomerVisit;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
