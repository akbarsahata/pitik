import { Column, Entity } from 'typeorm';
import { Base } from './Base.entity';

@Entity({
  name: 'app',
  schema: 'usermanagement',
})
export class App extends Base {
  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'url', type: 'varchar', length: 255 })
  url: string;

  @Column({ name: 'logo', type: 'varchar', length: 255 })
  logo: string;

  @Column({ name: 'about', type: 'text' })
  about: string;

  @Column({ name: 'key', type: 'varchar', length: 500 })
  key: string;

  @Column({ name: 'ref_user_id', type: 'uuid' })
  userId: string;
}
