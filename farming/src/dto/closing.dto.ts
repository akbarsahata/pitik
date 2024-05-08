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
    initialPopulation: Type.Number(),
    remainingPopulation: Type.Number(),
    margin: Type.Number(),
  }),
});

export const feedAdjustmentParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const ovkLeftoverParamsDTO = Type.Object({
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
  adjustment: Type.Object({
    plus: Type.Number(),
    minus: Type.Number(),
  }),
  leftoverInCoop: Type.Number(),
  leftoverTotal: Type.Number(),
});

export const getFeedLeftoverResponseDTO = Type.Object({
  code: Type.Number(),
  data: feedLeftoverItemDTO,
});

export const ovkLeftoverItemDTO = Type.Object({
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

export const getOvkLeftoverResponseDTO = Type.Object({
  code: Type.Number(),
  data: ovkLeftoverItemDTO,
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

export const getClosingIpResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    averageAge: Type.Number(),
    deplesi: Type.Number(),
    farmingCycleCode: Type.String(),
    fcrAct: Type.Number(),
    fcrStd: Type.Number(),
    feed: Type.Number(),
    finalPopulation: Type.Number(),
    initialPopulation: Type.Number(),
    ip: Type.Number(),
    tonnage: Type.Number(),
    farmingCycleId: Type.String(),
  }),
});

export const closingParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const closingQueryDTO = Type.Object({
  feed: Type.Optional(Type.Number()),
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

export const setMortalityAdjustmentResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const setFeedAdjustmentResponseDTO = setMortalityAdjustmentResponseDTO;

export type MortalityAdjustmentParams = Static<typeof mortalityAdjustmentParamsDTO>;

export type MortalityAdjustmentItem = Static<typeof mortalityAdjustmentItemDTO>;

export type MortalityAdjustmentBody = Static<typeof mortalityAdjustmentBodyDTO>;

export type GetMortalityAdjustmentResponse = Static<typeof getMortalityAdjustmentResponseDTO>;

export type GetRemainingPopulationResponse = Static<typeof getRemainingPopulationResponseDTO>;

export type FeedAdjustmentParams = Static<typeof feedAdjustmentParamsDTO>;

export type OvkLeftoverParams = Static<typeof ovkLeftoverParamsDTO>;

export type FeedLeftoverItem = Static<typeof feedLeftoverItemDTO>;

export type GetFeedLeftoverResponse = Static<typeof getFeedLeftoverResponseDTO>;

export type OvkLeftoverItem = Static<typeof ovkLeftoverItemDTO>;

export type GetOvkLeftoverResponse = Static<typeof getOvkLeftoverResponseDTO>;

export type FeedAdjustmentItem = Static<typeof feedAdjustmentItemDTO>;

export type FeedAdjustmentBody = Static<typeof feedAdjustmentBodyDTO>;

export type GetFeedAdjustmentResponse = Static<typeof getFeedAdjustmentResponseDTO>;

export type ClosingParams = Static<typeof closingParamsDTO>;

export type ClosingQuery = Static<typeof closingQueryDTO>;

export type ClosingResponseItem = Static<typeof closingResponseItemDTO>;

export type ClosingResponse = Static<typeof closingResponseDTO>;

export type GetClosingIpResponse = Static<typeof getClosingIpResponseDTO>;

export type SetMortalityAdjustmentResponse = Static<typeof setMortalityAdjustmentResponseDTO>;

export type SetFeedAdjustmentResponse = Static<typeof setFeedAdjustmentResponseDTO>;
