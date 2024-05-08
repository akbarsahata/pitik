import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('t_tipeinlet')
export class InletType {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'] })
  status: string;
}
