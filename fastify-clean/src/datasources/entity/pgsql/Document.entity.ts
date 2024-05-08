import { Column, Entity } from 'typeorm';
import { CMSBaseSimple } from './Base.entity';

@Entity('document')
export class Document extends CMSBaseSimple {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 50 })
  type: string;

  @Column({ name: 'version', type: 'int' })
  version: number;

  @Column({ name: 'identifier_key', type: 'varchar', length: 255 })
  identifierKey: string;

  @Column({ name: 'identifier_value', type: 'varchar', length: 255 })
  identifierValue: string;

  @Column({ name: 'url', type: 'varchar', length: 500 })
  url: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;
}
