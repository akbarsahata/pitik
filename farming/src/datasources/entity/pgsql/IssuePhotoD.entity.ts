import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Issue } from './Issue.entity';

@Entity('t_issuephoto_d')
export class IssuePhotoD extends CMSBase {
  @Column({ name: 'ref_issue_id', type: 'varchar', length: 32 })
  issueId: string;

  @Column({ name: 'image_url', type: 'varchar', length: 200 })
  imageUrl: string;

  @ManyToOne(() => Issue, (i) => i.photos)
  @JoinColumn({ name: 'ref_issue_id', referencedColumnName: 'id' })
  issue: Issue;
}
