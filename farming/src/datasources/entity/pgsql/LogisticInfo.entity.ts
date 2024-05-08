import { Column, Entity } from 'typeorm';
import { CMSBase } from './Base.entity';

@Entity('logistic_info')
export class LogisticInfo extends CMSBase {
  @Column({ name: 'matching_number', type: 'varchar', length: 50 })
  matchingNumber: string;

  @Column({ name: 'coop_id_leader', type: 'varchar', length: 50 })
  coopIdLeader: string;

  @Column({ name: 'coop_id_follower', type: 'varchar', length: 50 })
  coopIdFollower: string;

  @Column({ name: 'purchase_request_id_leader', type: 'varchar', length: 50 })
  purchaseRequestIdLeader: string;

  @Column({ name: 'purchase_request_id_follower', type: 'varchar', length: 50 })
  purchaseRequestIdFollower: string;
}
