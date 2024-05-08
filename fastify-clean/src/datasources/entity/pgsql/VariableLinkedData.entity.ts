/* eslint-disable no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_variablelinkeddata')
export class VariableLinkedData {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'data_type', type: 'varchar', length: 250 })
  dataType: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;
}
