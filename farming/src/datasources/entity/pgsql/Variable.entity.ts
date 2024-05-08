/* eslint-disable no-unused-vars */
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { User } from './User.entity';

export enum VariableType {
  SIMPLE = 'simple',
  FORMULATED = 'formulated',
}

@Entity('t_variable')
export class Variable extends CMSBase {
  @Column({ name: 'variable_code', type: 'varchar', length: 50 })
  variableCode: string;

  @Column({ name: 'variable_name', type: 'varchar', length: 50 })
  variableName: string;

  @Column({ name: 'variable_uom', type: 'varchar', length: 50 })
  variableUOM: string;

  @Column({
    name: 'variable_type',
    type: 'enum',
    enum: VariableType,
    default: VariableType.SIMPLE,
  })
  variableType: VariableType;

  @Column({ name: 'variable_formula', type: 'varchar' })
  variableFormula: string;

  @Column({ name: 'digit_coma', type: 'double precision' })
  digitComa: number;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
