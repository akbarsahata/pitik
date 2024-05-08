import { Column, Entity } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';

@Entity('t_feedbrand')
export class FeedBrand extends CMSBase {
  @Column({ name: 'feedbrand_code', type: 'varchar', length: 50 })
  feedbrandCode: string;

  @Column({ name: 'feedbrand_name', type: 'varchar', length: 50 })
  feedbrandName: string;

  @Column({ name: 'status', type: 'bool', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;
}
