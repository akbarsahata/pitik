import { Static, Type } from '@sinclair/typebox';
import { CustomerSupplierEnum } from '../../datasources/entity/pgsql/sales/Customer.entity';
import {
  SalesLeadStatus,
  SalesProspect,
} from '../../datasources/entity/pgsql/sales/CustomerVisit.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const branchItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const userItemDTO = Type.Object({
  id: Type.String(),
  email: Type.String(),
  fullName: Type.String(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  minValue: Type.Optional(Type.Number()),
  maxValue: Type.Optional(Type.Number()),
  dailyQuantity: Type.Number(),
  price: Type.Number({ minimum: 1000 }),
  uom: Nullable(Type.String({ default: null })),
  value: Nullable(Type.Number({ default: null })),
  category: productCategoryDTO,
});

export const latestVisitDTO = Type.Object({
  id: Type.String(),
  createdDate: Type.String(),
  leadStatus: Type.Enum(SalesLeadStatus),
  remarks: Nullable(Type.String()),
  prospect: Type.Enum(SalesProspect),
  products: Type.Array(productItemDTO),
  salesperson: userItemDTO,
});

export const customerItemDTO = Type.Object({
  id: Type.String(),
  businessName: Type.String(),
  businessType: Type.String(),
  ownerName: Type.String(),
  phoneNumber: Type.String(),
  isArchived: Type.Boolean(),
  salespersonId: Type.String(),
  salesperson: userItemDTO,
  plusCode: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
  provinceId: Type.Number(),
  province: locationItemDTO,
  cityId: Type.Number(),
  city: locationItemDTO,
  districtId: Type.Number(),
  district: locationItemDTO,
  branchId: Type.Optional(Type.String()),
  branch: Nullable(branchItemDTO),
  supplier: Type.Enum(CustomerSupplierEnum),
  supplierDetail: Type.String(),
  latestVisit: Type.Partial(latestVisitDTO),
  products: Type.Array(productItemDTO),
});

export const getSalesCustomersQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(customerItemDTO, [
      'businessName',
      'businessType',
      'ownerName',
      'phoneNumber',
      'isArchived',
      'salespersonId',
      'plusCode',
      'latitude',
      'longitude',
      'provinceId',
      'cityId',
      'supplier',
      'districtId',
      'branchId',
    ]),
  ).properties,
});

export const getSalesCustomersByIdParamsDTO = Type.Object({
  customerId: Type.String(),
});

export const getSalesCustomersByIdResponseItemDTO = Type.Object({
  ...Type.Pick(customerItemDTO, [
    'id',
    'businessName',
    'businessType',
    'isArchived',
    'ownerName',
    'phoneNumber',
    'salespersonId',
    'salesperson',
    'plusCode',
    'provinceId',
    'cityId',
    'province',
    'city',
    'district',
    'districtId',
    'supplier',
    'supplierDetail',
    'products',
    'branch',
  ]).properties,
  ...Type.Partial(Type.Pick(customerItemDTO, ['latestVisit'])).properties,
});

export const getSalesCustomersResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesCustomersByIdResponseItemDTO),
});

export const getSalesCustomersByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesCustomersByIdResponseItemDTO,
});

export const updateSalesCustomersParamsDTO = Type.Object({
  customerId: Type.String(),
});

export const salesCustomersBodyDTO = Type.Object(
  {
    ...Type.Pick(customerItemDTO, [
      'businessName',
      'businessType',
      'ownerName',
      'phoneNumber',
      'salespersonId',
      'plusCode',
      'provinceId',
      'cityId',
      'districtId',
      'supplier',
      'supplierDetail',
      'products',
      'branchId',
    ]).properties,
    ...Type.Partial(Type.Pick(customerItemDTO, ['isArchived'])).properties,
  },
  { additionalProperties: false },
);

export const updateSalesCustomersBodyDTO = Type.Object(
  {
    ...salesCustomersBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesCustomersResponseItemDTO = Type.Object({
  ...Type.Pick(customerItemDTO, [
    'id',
    'businessName',
    'businessType',
    'ownerName',
    'phoneNumber',
    'isArchived',
    'salespersonId',
    'plusCode',
    'provinceId',
    'cityId',
    'districtId',
    'supplier',
    'supplierDetail',
    'branch',
  ]).properties,
  ...Type.Pick(Type.Partial(customerItemDTO), ['products']).properties,
});

export const createSalesCustomersBodyDTO = Type.Object(
  {
    ...salesCustomersBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesCustomersResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateSalesCustomersResponseItemDTO,
});

export const createSalesCustomersResponseItemDTO = Type.Pick(customerItemDTO, [
  'id',
  'businessName',
  'businessType',
  'ownerName',
  'phoneNumber',
  'isArchived',
  'salespersonId',
  'plusCode',
  'provinceId',
  'cityId',
  'districtId',
  'supplier',
  'supplierDetail',
  'products',
  'branch',
]);

export const createSalesCustomersResponseDTO = Type.Object({
  code: Type.Number(),
  data: createSalesCustomersResponseItemDTO,
});

export const getProductsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(productItemDTO),
});

export type GetSalesCustomersQuery = Static<typeof getSalesCustomersQueryDTO>;

export type GetSalesCustomersResponse = Static<typeof getSalesCustomersResponseDTO>;

export type GetSalesCustomersByIdParams = Static<typeof getSalesCustomersByIdParamsDTO>;

export type GetSalesCustomersByIdResponse = Static<typeof getSalesCustomersByIdResponseDTO>;

export type UpdateSalesCustomersParams = Static<typeof updateSalesCustomersParamsDTO>;

export type UpdateSalesCustomersBody = Static<typeof updateSalesCustomersBodyDTO>;

export type UpdateSalesCustomersResponse = Static<typeof updateSalesCustomersResponseDTO>;

export type CreateSalesCustomersResponseItem = Static<typeof createSalesCustomersResponseItemDTO>;

export type CreateSalesCustomersBody = Static<typeof createSalesCustomersBodyDTO>;

export type CreateSalesCustomersResponse = Static<typeof createSalesCustomersResponseDTO>;

export type ProductItem = Static<typeof productItemDTO>;

export type GetProductsResponse = Static<typeof getProductsResponseDTO>;

export type GetSalesCustomersByIdResponseItem = Static<typeof getSalesCustomersByIdResponseItemDTO>;
