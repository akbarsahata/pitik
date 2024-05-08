import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GoodsReceipt } from './GoodsReceipt.entity';

@Entity('goodsreceiptproduct')
export class GoodsReceiptProduct {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'goodsreceipt_id', type: 'varchar', length: 32 })
  goodsReceiptId: string;

  @Column({ name: 'category_code', type: 'varchar', length: 50 })
  categoryCode: string;

  @Column({ name: 'category_name', type: 'varchar', length: 50 })
  categoryName: string;

  @Column({ name: 'subcategory_code', type: 'varchar', length: 50 })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar', length: 50 })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar', length: 50 })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar', length: 50 })
  productName: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'uom', type: 'varchar', length: 15 })
  uom: string;

  @Column({ name: 'po_product_id', type: 'varchar', length: 50 })
  poProductId: string;

  @Column({ name: 'is_returned', type: 'bool', nullable: true })
  isReturned: boolean | null;

  @ManyToOne(() => GoodsReceipt, (gr) => gr.goodsReceiptProducts)
  @JoinColumn({ name: 'goodsreceipt_id' })
  goodsReceipt: GoodsReceipt;
}
