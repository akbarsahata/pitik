import { Static, Type } from '@sinclair/typebox';
import {
  OperationUnitCategoryEnum,
  OperationUnitJagalPriceBasisEnum,
  OperationUnitTypeEnum,
} from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const userItemDTO = Type.Object({
  id: Type.String(),
  email: Type.String(),
  fullName: Type.String(),
});

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const branchItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  productItems: Type.Array(productItemDTO, { default: [] }),
});

export const jagalItemDTO = Type.Object({
  priceBasis: Type.Union([Type.Enum(OperationUnitJagalPriceBasisEnum), Type.Null()]),
  liveBird: Type.Object({
    quantity: Nullable(Type.Number()),
    weight: Nullable(Type.Number()),
    price: Nullable(Type.Number()),
    lossPrecentage: Nullable(Type.Number({ minimum: 0, maximum: 100 })),
  }),
  operationalDays: Nullable(Type.Number()),
  operationalExpenses: Nullable(Type.Number()),
});

export const operationUnitItemDTO = Type.Object({
  id: Type.String(),
  operationUnitName: Type.String(),
  provinceId: Type.Number(),
  province: locationItemDTO,
  cityId: Type.Number(),
  city: locationItemDTO,
  districtId: Type.Number(),
  district: locationItemDTO,
  branchId: Type.String(),
  branch: branchItemDTO,
  plusCode: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
  status: Type.Boolean(),
  category: Type.Enum(OperationUnitCategoryEnum),
  type: Type.Enum(OperationUnitTypeEnum),
  innardsPrice: Nullable(Type.Number()),
  headPrice: Nullable(Type.Number()),
  feetPrice: Nullable(Type.Number()),
  jagalData: Nullable(jagalItemDTO),
  totalStockWeight: Type.Number(),
  purchasableProducts: Type.Array(productCategoryDTO),
  productionTeams: Type.Array(userItemDTO),
  createdDate: Type.String(),
  createdBy: Nullable(Type.String()),
  modifiedDate: Type.String(),
  modifiedBy: Nullable(Type.String()),
});

export const getSalesOperationUnitsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(operationUnitItemDTO, [
      'operationUnitName',
      'provinceId',
      'cityId',
      'districtId',
      'branchId',
      'plusCode',
      'status',
      'type',
      'category',
    ]),
  ).properties,
  withinProductionTeam: Type.Optional(Nullable(Type.Boolean())),
});

export const getSalesOperationUnitsByIdResponseItemDTO = Type.Object({
  ...Type.Pick(operationUnitItemDTO, [
    'id',
    'operationUnitName',
    'province',
    'city',
    'district',
    'branch',
    'plusCode',
    'latitude',
    'longitude',
    'status',
    'category',
    'type',
    'innardsPrice',
    'headPrice',
    'feetPrice',
    'jagalData',
    'purchasableProducts',
    'productionTeams',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
    'totalStockWeight',
  ]).properties,
});

export const getSalesOperationUnitsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesOperationUnitsByIdResponseItemDTO),
});

export const getSalesOperationUnitByIdParamsDTO = Type.Object({
  operationUnitId: Type.String(),
});

export const getLatestStockQueryDTO = Type.Object({
  productCategoryId: Type.Optional(Type.String()),
});

export const getSalesOperationUnitByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesOperationUnitsByIdResponseItemDTO,
});

export const jagalBodyItemDTO = Type.Object({
  priceBasis: Type.Optional(Type.Enum(OperationUnitJagalPriceBasisEnum)),
  liveBird: Type.Optional(
    Type.Object({
      quantity: Type.Optional(Type.Number()),
      weight: Type.Optional(Type.Number()),
      price: Type.Optional(Type.Number()),
      lossPrecentage: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    }),
  ),
  operationalDays: Type.Optional(Type.Number()),
  operationalExpenses: Type.Optional(Type.Number()),
});

export const jagalBodyInternalItemDTO = Type.Object({
  liveBird: Type.Object({
    quantity: Type.Number(),
    weight: Type.Number(),
    price: Type.Number(),
    lossPrecentage: Type.Number({ minimum: 0, maximum: 100 }),
  }),
  operationalDays: Type.Number(),
  operationalExpenses: Type.Number(),
});

export const jagalBodyExternalItemDTO = Type.Object({
  priceBasis: Type.Enum(OperationUnitJagalPriceBasisEnum),
});

export const salesOperationUnitBodyDTO = Type.Object({
  ...Type.Pick(operationUnitItemDTO, [
    'operationUnitName',
    'provinceId',
    'cityId',
    'districtId',
    'branchId',
    'plusCode',
    'status',
    'type',
    'innardsPrice',
    'headPrice',
    'feetPrice',
    'category',
  ]).properties,
  jagalData: Type.Optional(jagalBodyItemDTO),
  purchasableProducts: Type.Array(Type.String()),
  productionTeams: Type.Optional(Type.Array(Type.String())),
});

export const createSalesOperationUnitBodyDTO = Type.Object(
  {
    ...salesOperationUnitBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesOperationUnitResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesOperationUnitsByIdResponseItemDTO,
});

export const updateSalesOperationUnitParamsDTO = Type.Object({
  operationUnitId: Type.String(),
});

export const updateSalesOperationUnitBodyDTO = Type.Object(
  {
    ...salesOperationUnitBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesOperationUnitResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesOperationUnitsByIdResponseItemDTO,
});

// Latest Stocks
export const latestStockItemDTO = Type.Object({
  productItemId: Type.String(),
  totalQuantity: Type.Number(),
  totalWeight: Type.Number(),
  availableQuantity: Type.Number(),
  availableWeight: Type.Number(),
  reservedQuantity: Type.Number(),
  reservedWeight: Type.Number(),
});

export const latestStockItemWithCategoryDetailDTO = Type.Object({
  productCategoryId: Type.String(),
  productCategoryName: Type.String(),
  totalQuantity: Type.Number(),
  totalWeight: Type.Number(),
  productItems: Type.Array(
    Type.Object({
      ...latestStockItemDTO.properties,
      name: Type.String(),
    }),
  ),
});

export const latestStockResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(latestStockItemWithCategoryDetailDTO),
});

export const createCheckInBodyDTO = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export const createCheckInResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    distance: Type.Number(),
  }),
});

export type GetSalesOperationUnitsQuery = Static<typeof getSalesOperationUnitsQueryDTO>;

export type GetSalesOperationUnitsByIdResponseItem = Static<
  typeof getSalesOperationUnitsByIdResponseItemDTO
>;

export type GetSalesOperationUnitsResponse = Static<typeof getSalesOperationUnitsResponseDTO>;

export type GetSalesOperationUnitByIdParams = Static<typeof getSalesOperationUnitByIdParamsDTO>;

export type GetSalesOperationUnitByIdResponse = Static<typeof getSalesOperationUnitByIdResponseDTO>;

export type CreateSalesOperationUnitBody = Static<typeof createSalesOperationUnitBodyDTO>;

export type CreateSalesOperationUnitResponse = Static<typeof createSalesOperationUnitResponseDTO>;

export type UpdateSalesOperationUnitParams = Static<typeof updateSalesOperationUnitParamsDTO>;

export type UpdateSalesOperationUnitBody = Static<typeof updateSalesOperationUnitBodyDTO>;

export type UpdateSalesOperationUnitResponse = Static<typeof updateSalesOperationUnitResponseDTO>;

// Latest Stocks

export type LatestStockItem = Static<typeof latestStockItemDTO>;

export type LatestStockItemWithCategoryDetail = Static<typeof latestStockItemWithCategoryDetailDTO>;

export type LatestStockResponse = Static<typeof latestStockResponseDTO>;

export type CreateCheckInBody = Static<typeof createCheckInBodyDTO>;

export type CreateCheckInResponse = Static<typeof createCheckInResponseDTO>;

export type GetLatestStockQuery = Static<typeof getLatestStockQueryDTO>;
