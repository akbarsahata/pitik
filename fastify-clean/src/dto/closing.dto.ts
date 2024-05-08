import { Static, Type } from '@sinclair/typebox';

export const mortalityAdjustmentParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const mortalityAdjustmentItemDTO = Type.Object({
  value: Type.Number(),
  remarks: Type.String(),
});

export const mortalityAdjustmentBodyDTO = Type.Object({
  ...mortalityAdjustmentItemDTO.properties,
});

export const getMortalityAdjustmentResponseDTO = Type.Object({
  code: Type.Number(),
  data: mortalityAdjustmentItemDTO,
});

export const getRemainingPopulationResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    remainingPopulation: Type.Number(),
    margin: Type.Number(),
  }),
});

export const feedAdjustmentParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const feedLeftoverItemDTO = Type.Object({
  received: Type.Number(),
  consumed: Type.Number(),
  transfer: Type.Object({
    delivered: Type.Number(),
    notDeliveredYet: Type.Number(),
  }),
  adjusted: Type.Number(),
  leftoverInCoop: Type.Number(),
  leftoverTotal: Type.Number(),
});

export const getFeedLeftoverResponseDTO = Type.Object({
  code: Type.Number(),
  data: feedLeftoverItemDTO,
});

export const feedAdjustmentItemDTO = Type.Object({
  value: Type.Number(),
  remarks: Type.String(),
});

export const feedAdjustmentBodyDTO = Type.Object({
  ...feedAdjustmentItemDTO.properties,
});

export const getFeedAdjustmentResponseDTO = Type.Object({
  code: Type.Number(),
  data: feedAdjustmentItemDTO,
});

export const closingParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const closingResponseItemDTO = Type.Object({
  harvested: Type.Number(),
  mortaled: Type.Number(),
  feedConsumed: Type.Number(),
});

export const closingResponseDTO = Type.Object({
  code: Type.Number(),
  data: closingResponseItemDTO,
});

export type MortalityAdjustmentParams = Static<typeof mortalityAdjustmentParamsDTO>;

export type MortalityAdjustmentItem = Static<typeof mortalityAdjustmentItemDTO>;

export type MortalityAdjustmentBody = Static<typeof mortalityAdjustmentBodyDTO>;

export type GetMortalityAdjustmentResponse = Static<typeof getMortalityAdjustmentResponseDTO>;

export type GetRemainingPopulationResponse = Static<typeof getRemainingPopulationResponseDTO>;

export type FeedAdjustmentParams = Static<typeof feedAdjustmentParamsDTO>;

export type FeedLeftoverItem = Static<typeof feedLeftoverItemDTO>;

export type GetFeedLeftoverResponse = Static<typeof getFeedLeftoverResponseDTO>;

export type FeedAdjustmentItem = Static<typeof feedAdjustmentItemDTO>;

export type FeedAdjustmentBody = Static<typeof feedAdjustmentBodyDTO>;

export type GetFeedAdjustmentResponse = Static<typeof getFeedAdjustmentResponseDTO>;

export type ClosingParams = Static<typeof closingParamsDTO>;

export type ClosingResponseItem = Static<typeof closingResponseItemDTO>;

export type ClosingResponse = Static<typeof closingResponseDTO>;
