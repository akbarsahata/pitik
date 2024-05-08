import { Static, Type } from '@sinclair/typebox';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';

export const getRoomTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
  farmCategory: Type.Optional(Type.Enum(FarmChickCategory)),
});

export const roomTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
  farmCategory: Type.Enum(FarmChickCategory),
});

export const getRoomTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(roomTypeItemDTO),
});

export type RoomTypeItem = Static<typeof roomTypeItemDTO>;

export type GetRoomTypesQuery = Static<typeof getRoomTypesQueryDTO>;

export type GetRoomTypesResponse = Static<typeof getRoomTypesResponseDTO>;
