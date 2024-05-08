import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Coop } from './Coop.entity';

@Entity('t_coopimage')
export class CoopImage {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'filename', type: 'varchar', length: 255 })
  filename: string;

  @Column({ name: 'sort', type: 'smallint' })
  sort: number;

  @Column({ name: 'ref_coop_id', type: 'varchar', length: 32 })
  coopId: string;

  @OneToOne(() => Coop)
  @JoinColumn({ name: 'ref_coop_id', referencedColumnName: 'id' })
  coop: Coop;
}
