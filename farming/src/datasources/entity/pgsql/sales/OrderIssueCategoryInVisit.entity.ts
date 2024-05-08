/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SalesCustomerVisit } from './CustomerVisit.entity';
import { SalesOrderIssueCategory } from './OrderIssueCategory.entity';

@Entity({
  name: 'sales_order_issue_category_in_visit',
  schema: 'sales',
})
export class SalesOrderIssueCategoryInVisit {
  @PrimaryColumn({ name: 'ref_sales_customer_visit_id', type: 'varchar', length: 36 })
  salesCustomerVisitId: string;

  @PrimaryColumn({ name: 'ref_order_issue_category_id', type: 'varchar', length: 36 })
  salesOrderIssueCategoryId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => SalesOrderIssueCategory, (category) => category.salesOrderIssueCategoryInVisit)
  @JoinColumn({ name: 'ref_order_issue_category_id', referencedColumnName: 'id' })
  salesOrderIssueCategory: SalesOrderIssueCategory;

  @ManyToOne(() => SalesCustomerVisit, (visit) => visit.salesOrderIssueCategoryInVisit)
  @JoinColumn({ name: 'ref_sales_customer_visit_id', referencedColumnName: 'id' })
  salesCustomerVisit: SalesCustomerVisit;
}
