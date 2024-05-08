import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GoodsReceipt } from './GoodsReceipt.entity';

@Entity('goodsreceiptphoto')
export class GoodsReceiptPhoto {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'goodsreceipt_id', type: 'varchar', length: 32 })
  goodsReceiptId: string;

  @Column({ name: 'url', type: 'varchar' })
  url: string;

  @Column({ name: 'type', type: 'varchar' })
  type: string;

  @ManyToOne(() => GoodsReceipt, (gr) => gr.photos)
  @JoinColumn({ name: 'goodsreceipt_id' })
  goodsReceipt: GoodsReceipt;
}
