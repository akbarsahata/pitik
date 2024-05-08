import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OperationUnit } from './OperationUnit.entity';
import { ProductCategory } from './ProductCategory.entity';
import { Vendor } from './Vendor.entity';

@Entity({ name: 'products_in_operation_unit', schema: 'sales' })
export class ProductsInOperationUnit {
  @PrimaryColumn({ name: 'ref_sales_product_category_id', type: 'varchar', length: 36 })
  salesProductCategoryId: string;

  @PrimaryColumn({ name: 'ref_sales_operation_unit_id', type: 'varchar', length: 36 })
  salesOperationUnitId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @ManyToOne(() => OperationUnit, (sou) => sou.salesProductsInOperationUnit)
  @JoinColumn({ name: 'ref_sales_operation_unit_id', referencedColumnName: 'id' })
  salesOperationUnit: Vendor;

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_sales_product_category_id', referencedColumnName: 'id' })
  salesProductCategory: ProductCategory;
}
