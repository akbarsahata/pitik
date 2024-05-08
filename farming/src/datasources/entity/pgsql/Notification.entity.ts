import { Column, Entity } from 'typeorm';
import { NotificationAppTarget } from '../../../jobs/queues/push-notification.queue';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBaseSimple } from './Base.entity';

export interface NotificationAdditionalParams {
  type?: string;
  coopId?: string;
  taskId?: string;
  alertId?: string;
  taskDate?: string;
  alertDate?: string;
}
@Entity('t_notification')
export class Notification extends CMSBaseSimple {
  @Column({ name: 'ref_user_id', type: 'varchar', length: 32 })
  userId: string;

  @Column({ name: 'ref_reference_id', type: 'varchar', length: 200 })
  referenceId: string;

  @Column({ name: 'subject_id', type: 'varchar', length: 50 })
  subjectId: string;

  @Column({ name: 'notification_type', type: 'varchar', length: 50 })
  notificationType: string;

  @Column({ name: 'headline', type: 'varchar', length: 250 })
  headline: string;

  @Column({ name: 'sub_headline', type: 'varchar', length: 250 })
  subHeadline: string;

  @Column({ name: 'icon', type: 'varchar', length: 50 })
  icon: string;

  @Column({ name: 'icon_path', type: 'varchar', length: 50 })
  iconPath: string;

  @Column({
    name: 'is_read',
    type: 'smallint',
    default: 0,
    transformer: new BoolSmallIntTransformer(),
  })
  isRead: boolean;

  @Column({ name: 'target', type: 'varchar', length: 250 })
  target: string;

  @Column({ name: 'additional_parameters', type: 'jsonb' })
  additionalParameters: NotificationAdditionalParams;

  @Column({ name: 'app_target', type: 'varchar' })
  appTarget: NotificationAppTarget | string;
}
