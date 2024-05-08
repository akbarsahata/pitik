/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { SalesCustomer } from './Customer.entity';
import { SalesOrderIssueCategoryInVisit } from './OrderIssueCategoryInVisit.entity';
import { ProductsInVisit } from './ProductsInVisit.entity';

export enum SalesLeadStatus {
  Belum = 'Belum',
  Akan = 'Akan',
  Pernah = 'Pernah',
  Rutin = 'Rutin',
}

export enum SalesProspect {
  Sulit = 'Sulit',
  Normal = 'Normal',
  Mudah = 'Mudah',
}

@Entity({
  name: 'sales_customer_visit',
  schema: 'sales',
})
export class SalesCustomerVisit {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'latitude', type: 'float4' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float4' })
  longitude: number;

  @Column({ name: 'lead_status', type: 'varchar', length: 32 })
  leadStatus: SalesLeadStatus;

  @Column({ name: 'prospect', type: 'varchar', length: 8 })
  prospect: SalesProspect;

  @Column({ name: 'order_issue', type: 'bool' })
  orderIssue: boolean;

  @Column({ name: 'remarks', type: 'varchar', length: 255 })
  remarks: string | null;

  @Column({ name: 'ref_sales_customer_id', type: 'varchar', length: 36 })
  salesCustomerId: string;

  @Column({ name: 'ref_salesperson_id', type: 'varchar', length: 36 })
  salespersonId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => SalesCustomer)
  @JoinColumn({ name: 'ref_sales_customer_id', referencedColumnName: 'id' })
  salesCustomer: SalesCustomer;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_salesperson_id', referencedColumnName: 'id' })
  salesperson: User;

  @OneToMany(() => ProductsInVisit, (spiv) => spiv.salesCustomerVisit)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInVisit: ProductsInVisit[];

  @OneToMany(() => SalesOrderIssueCategoryInVisit, (issue) => issue.salesCustomerVisit)
  @JoinColumn({ referencedColumnName: 'id' })
  salesOrderIssueCategoryInVisit: SalesOrderIssueCategoryInVisit[];
}
