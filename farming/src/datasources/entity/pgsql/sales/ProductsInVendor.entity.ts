import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';
import { Vendor } from './Vendor.entity';

@Entity({ name: 'products_in_vendor', schema: 'sales' })
export class ProductsInVendor {
  @PrimaryColumn({ name: 'ref_sales_product_category_id', type: 'varchar', length: 36 })
  salesProductCategoryId: string;

  @PrimaryColumn({ name: 'ref_sales_vendor_id', type: 'varchar', length: 36 })
  salesVendorId: string;

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

  @ManyToOne(() => Vendor, (sv) => sv.salesProductsInVendor)
  @JoinColumn({ name: 'ref_sales_vendor_id', referencedColumnName: 'id' })
  salesVendor: Vendor;

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_sales_product_category_id', referencedColumnName: 'id' })
  salesProductCategory: ProductCategory;
}
