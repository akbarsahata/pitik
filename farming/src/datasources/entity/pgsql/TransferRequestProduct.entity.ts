import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TransferRequest } from './TransferRequest.entity';

@Entity('transferrequestproduct')
export class TransferRequestProduct {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ name: 'transferrequest_id', type: 'varchar', length: 32 })
  transferRequestId: string;

  @Column({ name: 'category_code', type: 'varchar' })
  categoryCode: string;

  @Column({ name: 'category_name', type: 'varchar' })
  categoryName: string;

  @Column({ name: 'subcategory_code', type: 'varchar' })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar' })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'quantity', type: 'int8' })
  quantity: number;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'returned_date', type: 'date', nullable: true })
  returnedDate: Date | null;

  @ManyToOne(() => TransferRequest, (tr) => tr.photos)
  @JoinColumn({ name: 'transferrequest_id' })
  transferRequest: TransferRequest;
}
