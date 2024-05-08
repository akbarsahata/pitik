import { Static, Type } from '@sinclair/typebox';
import {
  VendorPriceBasisEnum,
  VendorTypeEnum,
} from '../../datasources/entity/pgsql/sales/Vendor.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const branchItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const vendorItemDTO = Type.Object({
  id: Type.String(),
  vendorName: Type.String(),
  provinceId: Type.Number(),
  province: locationItemDTO,
  cityId: Type.Number(),
  city: locationItemDTO,
  districtId: Type.Number(),
  district: locationItemDTO,
  branchId: Type.String(),
  branch: Nullable(branchItemDTO),
  plusCode: Type.String(),
  priceBasis: Type.Enum(VendorPriceBasisEnum),
  status: Type.Boolean(),
  type: Type.Optional(Type.Enum(VendorTypeEnum)),
  purchasableProducts: Type.Array(productCategoryDTO),
});

export const getSalesVendorsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(vendorItemDTO, [
      'vendorName',
      'priceBasis',
      'status',
      'plusCode',
      'provinceId',
      'cityId',
      'districtId',
      'type',
      'branchId',
    ]),
  ).properties,
});

export const getSalesVendorsByIdResponseItemDTO = Type.Object({
  ...Type.Pick(vendorItemDTO, [
    'id',
    'vendorName',
    'status',
    'priceBasis',
    'plusCode',
    'provinceId',
    'cityId',
    'province',
    'city',
    'district',
    'districtId',
    'purchasableProducts',
    'type',
    'branch',
  ]).properties,
});

export const getSalesVendorsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesVendorsByIdResponseItemDTO),
});

export const getSalesVendorByIdParamsDTO = Type.Object({
  vendorId: Type.String(),
});

export const getSalesVendorByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesVendorsByIdResponseItemDTO,
});

export const salesVendorBodyDTO = Type.Object({
  ...Type.Pick(vendorItemDTO, [
    'vendorName',
    'priceBasis',
    'plusCode',
    'provinceId',
    'cityId',
    'districtId',
    'type',
    'branchId',
  ]).properties,
  purchasableProducts: Type.Array(Type.String()),
  ...Type.Partial(Type.Pick(vendorItemDTO, ['status'])).properties,
});

export const createSalesVendorBodyDTO = Type.Object(
  {
    ...salesVendorBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesVendorResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesVendorsByIdResponseItemDTO,
});

export const updateSalesVendorParamsDTO = Type.Object({
  vendorId: Type.String(),
});

export const updateSalesVendorBodyDTO = Type.Object(
  {
    ...salesVendorBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesVendorResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesVendorsByIdResponseItemDTO,
});

export type GetSalesVendorsQuery = Static<typeof getSalesVendorsQueryDTO>;

export type GetSalesVendorsByIdResponseItem = Static<typeof getSalesVendorsByIdResponseItemDTO>;

export type GetSalesVendorsResponse = Static<typeof getSalesVendorsResponseDTO>;

export type GetSalesVendorByIdParams = Static<typeof getSalesVendorByIdParamsDTO>;

export type GetSalesVendorByIdResponse = Static<typeof getSalesVendorByIdResponseDTO>;

export type CreateSalesVendorBody = Static<typeof createSalesVendorBodyDTO>;

export type CreateSalesVendorResponse = Static<typeof createSalesVendorResponseDTO>;

export type UpdateSalesVendorParams = Static<typeof updateSalesVendorParamsDTO>;

export type UpdateSalesVendorBody = Static<typeof updateSalesVendorBodyDTO>;

export type UpdateSalesVendorResponse = Static<typeof updateSalesVendorResponseDTO>;
