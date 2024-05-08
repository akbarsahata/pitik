import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { User } from './User.entity';

@Entity('t_userregister')
export class UserRegister extends CMSBase {
  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ name: 'business_year', type: 'int' })
  businessYear: number;

  @Column({ name: 'coop_type', type: 'varchar', length: 25 })
  coopType: string;

  @Column({ name: 'coop_capacity', type: 'int' })
  coopCapacity: number;

  @Column({ name: 'coop_location', type: 'varchar', length: 255 })
  coopLocation: string;

  @Column({ name: 'address', type: 'varchar', length: 255 })
  address: string;

  @Column({ name: 'district', type: 'varchar', length: 255 })
  district: string;

  @Column({ name: 'region', type: 'varchar', length: 255 })
  region: string;

  @Column({ name: 'province', type: 'varchar', length: 255 })
  province: string;

  @Column({ name: 'approved', type: 'bool', default: false })
  approved: boolean;

  @Column({ name: 'ref_user_id', type: 'varchar', length: 50 })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;
}
