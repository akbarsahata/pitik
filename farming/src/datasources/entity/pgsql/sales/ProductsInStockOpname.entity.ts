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
import { StockOpname } from './StockOpname.entity';

@Entity({ name: 'products_in_stock_opname', schema: 'sales' })
export class ProductsInStockOpname {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_stock_opname_id', type: 'varchar', length: 36 })
  salesStockOpnameId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number | null;

  @Column({ name: 'weight', type: 'float4' })
  weight: number | null;

  @Column({ name: 'previous_quantity', type: 'int' })
  previousQuantity: number | null;

  @Column({ name: 'previous_weight', type: 'float4' })
  previousWeight: number | null;

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

  @ManyToOne(() => StockOpname, (sso) => sso.salesProductsInStockOpname)
  @JoinColumn({ name: 'ref_sales_stock_opname_id', referencedColumnName: 'id' })
  salesStockOpname: ProductsInStockOpname;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
