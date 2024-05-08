import { Static, Type } from '@sinclair/typebox';
import { OvkStockAdjustmentTypeEnum } from '../datasources/entity/pgsql/FarmingCycleOvkStockAdjustment.entity';

export const ovkStockSummaryItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  used: Type.Number(),
  in: Type.Number(),
  transfer: Type.Number(),
  remainingQuantity: Type.Number(),
  purchaseUom: Type.String(),
  uom: Type.String(),
});

export const ovkStockSummaryResponseItemDTO = Type.Object({
  id: Type.String(),
  ...ovkStockSummaryItemDTO.properties,
});

export const ovkStockSummaryResponseListDTO = Type.Array(ovkStockSummaryResponseItemDTO);

export const getOvkStockSummaryResponseDTO = Type.Object({
  code: Type.Integer(),
  data: ovkStockSummaryResponseListDTO,
});

export const getOvkStockSummaryParamsDTO = Type.Object(
  {
    farmingCycleId: Type.String(),
  },
  { additionalProperties: false },
);

export const getOvkStockSummaryQueryDTO = Type.Object(
  {
    subcategoryCode: Type.Optional(Type.String()),
    subcategoryName: Type.Optional(Type.String()),
    productCode: Type.Optional(Type.String()),
    productName: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const getOvkStockSummaryGroupByTypeItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  subcategoryCode: Type.String(),
  remainingQuantity: Type.Number(),
});

export const getOvkStockSummaryGroupByTypeListDTO = Type.Array(
  getOvkStockSummaryGroupByTypeItemDTO,
);

export const getOvkStockSummaryGroupByTypeResponseItemDTO = Type.Object({
  date: Type.String(),
  summaries: getOvkStockSummaryGroupByTypeListDTO,
});

export const getOvkStockSummaryGroupByTypeResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getOvkStockSummaryGroupByTypeResponseItemDTO,
});

export const OvkStockAdjustmentItemDTO = Type.Object({
  ovkStockSummaryId: Type.String(),
  adjustmentQuantity: Type.Number({ minimum: 1 }),
  type: Type.Enum(OvkStockAdjustmentTypeEnum),
  remarks: Type.Optional(Type.String()),
});

export const createOvkStockAdjustmentBodyDTO = Type.Array(
  Type.Object(
    {
      ...OvkStockAdjustmentItemDTO.properties,
    },
    { additionalProperties: false },
  ),
);

export const createOvkStockClosingAdjustmentBodyDTO = Type.Object({
  value: Type.Number(),
  remarks: Type.String(),
});

export const createOvkStockAdjustmentParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const createOvkStockAdjustmentResponseItemDTO = Type.Object({
  id: Type.String(),
  farmingCycleId: Type.String(),
  ...OvkStockAdjustmentItemDTO.properties,
  type: Type.String(),
});

export const createOvkStockAdjustmentResponseListDTO = Type.Array(
  createOvkStockAdjustmentResponseItemDTO,
);

export const createOvkStockAdjustmentResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createOvkStockAdjustmentResponseListDTO,
});

export const getOvkStockClosingAdjustmentResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createOvkStockClosingAdjustmentBodyDTO,
});

export type OvkStockSummaryItem = Static<typeof ovkStockSummaryItemDTO>;

export type OvkStockSummaryResponseItem = Static<typeof ovkStockSummaryResponseItemDTO>;

export type OvkStockSummaryResponseList = Static<typeof ovkStockSummaryResponseListDTO>;

export type GetOvkStockSummaryResponse = Static<typeof getOvkStockSummaryResponseDTO>;

export type GetOvkStockSummaryParams = Static<typeof getOvkStockSummaryParamsDTO>;

export type GetOvkStockSummaryQuery = Static<typeof getOvkStockSummaryQueryDTO>;

export type OvkStockAdjustmentItem = Static<typeof OvkStockAdjustmentItemDTO>;

export type GetOvkStockSummaryGroupByTypeItem = Static<typeof getOvkStockSummaryGroupByTypeItemDTO>;

export type GetOvkStockSummaryGroupByTypeList = Static<typeof getOvkStockSummaryGroupByTypeListDTO>;

export type GetOvkStockSummaryGroupByTypeResponseItem = Static<
  typeof getOvkStockSummaryGroupByTypeResponseItemDTO
>;

export type GetOvkStockSummaryGroupByTypeResponse = Static<
  typeof getOvkStockSummaryGroupByTypeResponseDTO
>;

export type CreateOvkStockAdjustmentBody = Static<typeof createOvkStockAdjustmentBodyDTO>;

export type CreateOvkStockClosingAdjustmentBody = Static<
  typeof createOvkStockClosingAdjustmentBodyDTO
>;

export type CreateOvkStockAdjustmentParams = Static<typeof createOvkStockAdjustmentParamsDTO>;

export type CreateOvkStockAdjustmentResponseItem = Static<
  typeof createOvkStockAdjustmentResponseItemDTO
>;

export type CreateOvkStockAdjustmentResponseList = Static<
  typeof createOvkStockAdjustmentResponseListDTO
>;

export type CreateOvkStockAdjustmentResponse = Static<typeof createOvkStockAdjustmentResponseDTO>;

export type GetOvkStockClosingAdjustmentResponse = Static<
  typeof getOvkStockClosingAdjustmentResponseDTO
>;
