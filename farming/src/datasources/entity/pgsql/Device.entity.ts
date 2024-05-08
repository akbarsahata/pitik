import { Column, Entity } from 'typeorm';
import { CMSBaseSimple } from './Base.entity';

@Entity('t_device')
export class Device extends CMSBaseSimple {
  @Column({ name: 'ref_user_id', type: 'varchar', length: 32 })
  userId: string;

  @Column({ name: 'uuid', type: 'varchar', length: 50 })
  uuid: string;

  @Column({ name: 'token', type: 'varchar', length: 250 })
  token: string;

  @Column({ name: 'type', type: 'varchar', length: 50 })
  type: string;

  @Column({ name: 'os', type: 'varchar', length: 50 })
  os: string;

  @Column({ name: 'model', type: 'varchar', length: 50 })
  model: string;
}
