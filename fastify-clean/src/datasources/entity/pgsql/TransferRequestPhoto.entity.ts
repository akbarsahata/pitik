import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TransferRequest } from './TransferRequest.entity';

@Entity('transferrequestphoto')
export class TransferRequestPhoto {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'transferrequest_id', type: 'varchar', length: 32 })
  transferRequestId: string;

  @Column({ name: 'url', type: 'varchar' })
  url: string;

  @ManyToOne(() => TransferRequest, (tr) => tr.photos)
  @JoinColumn({ name: 'transferrequest_id' })
  transferRequest: TransferRequest;
}
