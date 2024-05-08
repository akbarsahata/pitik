/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { User } from './User.entity';

export enum ChickTypeCategory {
  BROILER = 'BROILER',
  LAYER = 'LAYER',
}

@Entity('t_chicktype')
export class ChickType extends CMSBase {
  @Column({ name: 'chicktype_code', type: 'varchar', length: 50 })
  chickTypeCode: string;

  @Column({ name: 'chicktype_name', type: 'varchar', length: 50 })
  chickTypeName: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'category', type: 'varchar' })
  category: ChickTypeCategory;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User | null;
}
