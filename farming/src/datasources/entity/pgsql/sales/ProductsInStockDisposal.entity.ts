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
import { StockDisposal } from './StockDisposal.entity';

@Entity({ name: 'products_in_stock_disposal', schema: 'sales' })
export class ProductsInStockDisposal {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_stock_disposal_id', type: 'varchar', length: 36 })
  salesStockDisposalId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
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

  @ManyToOne(() => StockDisposal, (ssd) => ssd.salesProductsInStockDisposal)
  @JoinColumn({ name: 'ref_sales_stock_disposal_id', referencedColumnName: 'id' })
  salesStockDisposal: StockDisposal;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
