import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { GoodsReceived } from './GoodsReceived.entity';
import { ProductItem } from './ProductItem.entity';

@Entity({ name: 'products_in_goods_received', schema: 'sales' })
export class ProductsInGoodsReceived {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'ref_sales_goods_received_id', type: 'varchar', length: 36 })
  salesGoodsReceivedId: string;

  @Column({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string | null;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'price', type: 'int' })
  price: number | null;

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

  @ManyToOne(() => GoodsReceived, (sgr) => sgr.salesProductsInGoodsReceived)
  @JoinColumn({ name: 'ref_sales_goods_received_id', referencedColumnName: 'id' })
  salesGoodsReceived: GoodsReceived;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem | null;
}
