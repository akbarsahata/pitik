import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('feature_whitelist')
export class FeatureWhitelist {
  @PrimaryColumn({ name: 'context', type: 'varchar' })
  context: string;

  @PrimaryColumn({ name: 'identifier', type: 'varchar' })
  identifier: string;

  @Column({ name: 'is_blocked', type: 'bool', default: false })
  isBlocked: boolean;

  @Column({ name: 'block_reason', type: 'text' })
  blockReason: string;
}
