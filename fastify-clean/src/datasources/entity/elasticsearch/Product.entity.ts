/* eslint-disable no-unused-vars */
export enum ProductCategoryCodeEnum {
  PAKAN = 'PAKAN',
  OVK = 'OVK',
  DOC = 'DOC',
}

export interface Product {
  id: string;
  categoryCode: keyof typeof ProductCategoryCodeEnum;
  categoryName: string;
  subcategoryCode: string;
  subcategoryName: string;
  productCode: string;
  productName: string;
  isActive: boolean;
  uom: string;
  purchaseMultiply: number;
  purchaseUOM: string;
  order: number;
}
