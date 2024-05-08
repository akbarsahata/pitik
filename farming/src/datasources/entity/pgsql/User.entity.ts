import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { B2BOrganizationMember } from './b2b/B2BOrganizationMember.entity';
import { CMSBase } from './Base.entity';
import { Branch } from './Branch.entity';

@Entity('t_user')
export class User extends CMSBase {
  @Column({ name: 'user_code', type: 'varchar', length: 50 })
  userCode: string;

  @Column({ name: 'user_name', type: 'varchar', length: 50 })
  userName: string;

  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ name: 'wa_number', type: 'varchar', length: 50 })
  waNumber: string;

  @Column({ name: 'user_type', type: 'varchar', length: 50 })
  userType: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'auth_code', type: 'varchar', length: 32 })
  authCode: string;

  @Column({ name: 'password', type: 'varchar', length: 128 })
  password: string;

  @Column({ name: 'reset_code', type: 'varchar', length: 32 })
  resetCode: string;

  @Column({ name: 'reset_expired', type: 'timestamp' })
  resetExpired: string;

  @Column({ name: 'ref_owner_id', type: 'varchar', length: 32 })
  ownerId: string;

  @Column({ name: 'ref_branch_id', type: 'varchar', length: 32 })
  branchId: string;

  @Column({
    name: 'accept_tnc',
    type: 'smallint',
    default: 0,
    transformer: new BoolSmallIntTransformer(),
  })
  acceptTnc: boolean;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_owner_id', referencedColumnName: 'id' })
  owner: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User | null;

  @OneToOne(() => Branch)
  @JoinColumn({ name: 'ref_branch_id', referencedColumnName: 'id' })
  branch: Branch | null;

  @OneToMany(() => B2BOrganizationMember, (b2bOrgMember) => b2bOrgMember.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'ref_user_id' })
  organization: B2BOrganizationMember[];
}
