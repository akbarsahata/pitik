import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { HTTP_METHOD_ENUM } from '../../../libs/enums';
import { Base } from './Base.entity';
import { RoleAcl } from './RoleAcl.entity';

@Entity('api')
export class Api extends Base {
  @Column({ name: 'group_name', type: 'varchar', length: 255, unique: true })
  groupName: string;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'endpoint', type: 'varchar', length: 500 })
  endpoint: string;

  @Column({
    name: 'method',
    type: 'enum',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  method: keyof typeof HTTP_METHOD_ENUM;

  @OneToMany(() => RoleAcl, (roleAcl) => roleAcl.api)
  @JoinColumn({ referencedColumnName: 'id' })
  roleAcl?: RoleAcl[];
}
