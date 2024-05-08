import { Static, Type } from '@sinclair/typebox';

export const getRoomTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
});

export const roomTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const getRoomTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(roomTypeItemDTO),
});

export type RoomTypeItem = Static<typeof roomTypeItemDTO>;

export type GetRoomTypesQuery = Static<typeof getRoomTypesQueryDTO>;

export type GetRoomTypesResponse = Static<typeof getRoomTypesResponseDTO>;
