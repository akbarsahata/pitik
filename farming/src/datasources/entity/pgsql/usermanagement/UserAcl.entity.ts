import { Column, Entity, Unique } from 'typeorm';
import { Base } from './Base.entity';

@Entity({
  name: 'useracl',
  schema: 'usermanagement',
})
@Unique(['userId', 'apiId'])
export class UserAcl extends Base {
  @Column({ name: 'ref_user_id', type: 'varchar', length: 50 })
  userId: string;

  @Column({ name: 'ref_api_id', type: 'varchar', length: 50 })
  apiId: string;
}
