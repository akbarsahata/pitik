import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';

@Entity('privilege')
export class Privilege extends Base {
  @Column({ name: 'ref_user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'ref_api_id', type: 'uuid' })
  apiId: string;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: string;

  @ManyToOne(() => User, (user) => user.privilege)
  @JoinColumn({ name: 'ref_user_id' })
  user: User;
}
