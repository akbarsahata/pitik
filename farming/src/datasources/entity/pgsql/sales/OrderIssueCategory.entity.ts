/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { SalesOrderIssueCategoryInVisit } from './OrderIssueCategoryInVisit.entity';

@Entity({
  name: 'sales_order_issue_category',
  schema: 'sales',
})
export class SalesOrderIssueCategory {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 50 })
  title: string;

  @OneToMany(() => SalesOrderIssueCategoryInVisit, (issue) => issue.salesOrderIssueCategory)
  @JoinColumn({ referencedColumnName: 'id' })
  salesOrderIssueCategoryInVisit: SalesOrderIssueCategoryInVisit[];
}
