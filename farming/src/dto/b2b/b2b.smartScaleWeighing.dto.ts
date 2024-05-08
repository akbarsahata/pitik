import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from '../common.dto';

// Base
export const roomTypeResponseItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const roomResponseItemDTO = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
  roomType: roomTypeResponseItemDTO,
});

export const b2bSmartScaleWeighingRecordsResponseItemDTO = Type.Object({
  id: Type.String(),
  count: Type.Number(),
  weight: Type.Number(),
});

export const b2bSmartScaleWeighingResponseItemDTO = Type.Object({
  id: Type.String(),
  totalCount: Type.Number(),
  averageWeight: Type.Number(),
  roomId: Type.String(),
  room: roomResponseItemDTO,
  records: Type.Array(b2bSmartScaleWeighingRecordsResponseItemDTO),
  createdDate: Type.String(),
  modifiedDate: Type.String(),
  executionDate: Type.String(),
  startDate: Type.String(),
});

export const getB2BSmartScaleWeighingResponseItemDTO = Type.Object({
  ...b2bSmartScaleWeighingResponseItemDTO.properties,
});

// GET /v1/weighing
export const getB2BSmartScaleWeighingsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  roomId: Type.String(),
  date: Type.Optional(Type.String()),
});

export const getB2BSmartScaleWeighingsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(Type.Omit(getB2BSmartScaleWeighingResponseItemDTO, ['records'])),
});

// GET /v1/weighing/:weighingId
export const getB2BSmartScaleWeighingDetailsParamsDTO = Type.Object({
  weighingId: Type.String(),
});

export const getB2BSmartScaleWeighingDetailsResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BSmartScaleWeighingResponseItemDTO,
});

// POST /v1/weighing
export const createB2BSmartScaleWeighingBodyDTO = Type.Object(
  {
    ...Type.Pick(b2bSmartScaleWeighingResponseItemDTO, ['roomId', 'executionDate', 'startDate'])
      .properties,
    records: Type.Array(
      Type.Pick(b2bSmartScaleWeighingRecordsResponseItemDTO, ['count', 'weight']),
      { minItems: 1 },
    ),
  },
  { additionalProperties: false },
);

export const createB2BSmartScaleWeighingResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BSmartScaleWeighingResponseItemDTO,
});

// PUT /v1/weighing/:weighingId
export const updateB2BSmartScaleWeighingParamsDTO = Type.Object({
  weighingId: Type.String(),
});

export const updateB2BSmartScaleWeighingBodyDTO = Type.Object(
  {
    ...Type.Pick(b2bSmartScaleWeighingResponseItemDTO, ['roomId', 'executionDate', 'startDate'])
      .properties,
    records: Type.Array(
      Type.Pick(b2bSmartScaleWeighingRecordsResponseItemDTO, ['count', 'weight']),
      { minItems: 1 },
    ),
    isOfflineUpdate: Type.Optional(Type.Boolean({ default: false })),
  },
  { additionalProperties: false },
);

export const updateB2BSmartScaleWeighingResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BSmartScaleWeighingResponseItemDTO,
});

export type B2BSmartScaleWeighingResponseItem = Static<typeof b2bSmartScaleWeighingResponseItemDTO>;

export type GetB2BSmartScaleWeighingResponseItem = Static<
  typeof getB2BSmartScaleWeighingResponseItemDTO
>;

export type GetB2BSmartScaleWeighingsQuery = Static<typeof getB2BSmartScaleWeighingsQueryDTO>;

export type GetB2BSmartScaleWeighingsResponse = Static<typeof getB2BSmartScaleWeighingsResponseDTO>;

export type GetB2BSmartScaleWeighingDetailsParams = Static<
  typeof getB2BSmartScaleWeighingDetailsParamsDTO
>;

export type GetB2BSmartScaleWeighingDetailsResponse = Static<
  typeof getB2BSmartScaleWeighingDetailsResponseDTO
>;

export type CreateB2BSmartScaleWeighingBody = Static<typeof createB2BSmartScaleWeighingBodyDTO>;

export type CreateB2BSmartScaleWeighingResponse = Static<
  typeof createB2BSmartScaleWeighingResponseDTO
>;

export type UpdateB2BSmartScaleWeighingParams = Static<typeof updateB2BSmartScaleWeighingParamsDTO>;

export type UpdateB2BSmartScaleWeighingBody = Static<typeof updateB2BSmartScaleWeighingBodyDTO>;

export type UpdateB2BSmartScaleWeighingResponse = Static<
  typeof updateB2BSmartScaleWeighingResponseDTO
>;
