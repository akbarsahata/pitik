import { Static, Type } from '@sinclair/typebox';

export const gamificationPointSummaryDTO = Type.Object({
  targetMaxPoint: Type.Integer(),
  currentTargetPoint: Type.Integer(),
  currentTargetLevel: Type.Integer(),
  currentPoint: Type.Integer(),
  currentLevel: Type.Integer(),
  ipPrediction: Type.Integer(),
});

export const gamificationPointSummaryResponseDTO = Type.Object({
  data: gamificationPointSummaryDTO,
});

export const gamificationPointSummaryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const gamificationPointHistoryItemDTO = Type.Object({
  taskName: Type.String(),
  pointEarned: Type.Integer(),
});

export const gamificationPointHistoryListDTO = Type.Array(gamificationPointHistoryItemDTO);

export const gamificationPointHistoryResponseDTO = Type.Object({
  data: gamificationPointHistoryListDTO,
});

export const gamificationPointHistoryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const gamificationPointHistoryQueryDTO = Type.Object({
  date: Type.Optional(Type.String({ format: 'date' })),
});

export const gamificationCoopPointHistoryItemDTO = Type.Object({
  farmingCycleCode: Type.String(),
  chickInDate: Type.String({ format: 'date' }),
  totalPoint: Type.Integer(),
  correctnessPercentage: Type.Integer(),
});

export const gamificationCoopPointHistoryListDTO = Type.Array(gamificationCoopPointHistoryItemDTO);

export const gamificationCoopPointHistoryResponseDTO = Type.Object({
  data: gamificationCoopPointHistoryListDTO,
});

export const gamificationCoopPointHistoryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const gamificationTaskSubmittedDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
  userSubmitterId: Type.String(),
});

export const gamificationTaskVerifiedDTO = Type.Object({
  dataVerificationId: Type.String(),
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
  userVerifierId: Type.String(),
  onTimeStatus: Type.Boolean({ default: false }),
});

export const gamificationTaskPointDTO = Type.Object({
  farmingCycleId: Type.String(),
  dataVerificationId: Type.Optional(Type.String()),
  taskTicketId: Type.String(),
  userSubmitterId: Type.String(),
  userVerifierId: Type.Optional(Type.String()),
  earnedPoints: Type.Integer({ minimum: 0 }),
});

export type GamificationPointSummary = Static<typeof gamificationPointSummaryDTO>;

export type GamificationPointSummaryResponse = Static<typeof gamificationPointSummaryResponseDTO>;

export type GamificationPointSummaryParams = Static<typeof gamificationPointSummaryParamsDTO>;

export type GamificationPointHistoryItem = Static<typeof gamificationPointHistoryItemDTO>;

export type GamificationPointHistoryList = Static<typeof gamificationPointHistoryListDTO>;

export type GamificationPointHistoryResponse = Static<typeof gamificationPointHistoryResponseDTO>;

export type GamificationPointHistoryParams = Static<typeof gamificationPointHistoryParamsDTO>;

export type GamificationPointHistoryQuery = Static<typeof gamificationPointHistoryQueryDTO>;

export type GamificationCoopPointHistoryItem = Static<typeof gamificationCoopPointHistoryItemDTO>;

export type GamificationCoopPointHistoryList = Static<typeof gamificationCoopPointHistoryListDTO>;

export type GamificationCoopPointHistoryResponse = Static<
  typeof gamificationCoopPointHistoryResponseDTO
>;

export type GamificationCoopPointHistoryParams = Static<
  typeof gamificationCoopPointHistoryParamsDTO
>;

export type GamificationTaskSubmitted = Static<typeof gamificationTaskSubmittedDTO>;

export type GamificationTaskVerified = Static<typeof gamificationTaskVerifiedDTO>;

export type GamificationTaskPoint = Static<typeof gamificationTaskPointDTO>;
