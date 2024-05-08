import { Static, Type } from '@sinclair/typebox';
import { FeedStockAdjustmentTypeEnum } from '../datasources/entity/pgsql/FarmingCycleFeedStockAdjustment.entity';

export const feedStockSummaryItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  remainingQuantity: Type.Number(),
  purchaseUom: Type.String(),
  uom: Type.String(),
});

export const feedStockSummaryResponseItemDTO = Type.Object({
  id: Type.String(),
  used: Type.Number(),
  in: Type.Number(),
  transfer: Type.Number(),
  ...feedStockSummaryItemDTO.properties,
});

export const feedStockSummaryResponseListDTO = Type.Array(feedStockSummaryResponseItemDTO);

export const getFeedStockSummaryResponseDTO = Type.Object({
  code: Type.Integer(),
  data: feedStockSummaryResponseListDTO,
});

export const getFeedStockSummaryParamsDTO = Type.Object(
  {
    farmingCycleId: Type.String(),
  },
  { additionalProperties: false },
);

export const getFeedStockSummaryQueryDTO = Type.Object(
  {
    subcategoryCode: Type.Optional(Type.String()),
    subcategoryName: Type.Optional(Type.String()),
    productCode: Type.Optional(Type.String()),
    productName: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const getFeedStockSummaryGroupByTypeItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  subcategoryCode: Type.String(),
  remainingQuantity: Type.Number(),
});

export const getFeedStockSummaryGroupByTypeListDTO = Type.Array(
  getFeedStockSummaryGroupByTypeItemDTO,
);

export const getFeedStockSummaryGroupByTypeResponseItemDTO = Type.Object({
  date: Type.String(),
  summaries: getFeedStockSummaryGroupByTypeListDTO,
});

export const getFeedStockSummaryGroupByTypeResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getFeedStockSummaryGroupByTypeResponseItemDTO,
});

export const feedStockAdjustmentItemDTO = Type.Object({
  feedStockSummaryId: Type.String(),
  adjustmentQuantity: Type.Number({ minimum: 1 }),
  type: Type.Enum(FeedStockAdjustmentTypeEnum),
  remarks: Type.Optional(Type.String()),
});

export const createFeedStockAdjustmentBodyDTO = Type.Array(
  Type.Object(
    {
      ...feedStockAdjustmentItemDTO.properties,
    },
    { additionalProperties: false },
  ),
);

export const createFeedStockAdjustmentParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const createFeedStockAdjustmentResponseItemDTO = Type.Object({
  id: Type.String(),
  farmingCycleId: Type.String(),
  ...feedStockAdjustmentItemDTO.properties,
  type: Type.String(),
  remarks: Type.Optional(Type.String()),
});

export const createFeedStockAdjustmentResponseListDTO = Type.Array(
  createFeedStockAdjustmentResponseItemDTO,
);

export const createFeedStockAdjustmentResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createFeedStockAdjustmentResponseListDTO,
});

export type FeedStockSummaryItem = Static<typeof feedStockSummaryItemDTO>;

export type FeedStockSummaryResponseItem = Static<typeof feedStockSummaryResponseItemDTO>;

export type FeedStockSummaryResponseList = Static<typeof feedStockSummaryResponseListDTO>;

export type GetFeedStockSummaryResponse = Static<typeof getFeedStockSummaryResponseDTO>;

export type GetFeedStockSummaryParams = Static<typeof getFeedStockSummaryParamsDTO>;

export type GetFeedStockSummaryQuery = Static<typeof getFeedStockSummaryQueryDTO>;

export type FeedStockAdjustmentItem = Static<typeof feedStockAdjustmentItemDTO>;

export type GetFeedStockSummaryGroupByTypeItem = Static<
  typeof getFeedStockSummaryGroupByTypeItemDTO
>;

export type GetFeedStockSummaryGroupByTypeList = Static<
  typeof getFeedStockSummaryGroupByTypeListDTO
>;

export type GetFeedStockSummaryGroupByTypeResponseItem = Static<
  typeof getFeedStockSummaryGroupByTypeResponseItemDTO
>;

export type GetFeedStockSummaryGroupByTypeResponse = Static<
  typeof getFeedStockSummaryGroupByTypeResponseDTO
>;

export type CreateFeedStockAdjustmentBody = Static<typeof createFeedStockAdjustmentBodyDTO>;

export type CreateFeedStockAdjustmentParams = Static<typeof createFeedStockAdjustmentParamsDTO>;

export type CreateFeedStockAdjustmentResponseItem = Static<
  typeof createFeedStockAdjustmentResponseItemDTO
>;

export type CreateFeedStockAdjustmentResponseList = Static<
  typeof createFeedStockAdjustmentResponseListDTO
>;

export type CreateFeedStockAdjustmentResponse = Static<typeof createFeedStockAdjustmentResponseDTO>;
