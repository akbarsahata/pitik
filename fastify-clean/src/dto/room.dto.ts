import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const roomTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const floorTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const controllerTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const userItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  userCode: Type.Optional(Type.String()),
  fullName: Type.Optional(Type.String()),
});

export const farmItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  farmCode: Type.Optional(Type.String()),
  farmName: Type.Optional(Type.String()),
  owner: userItemDTO,
});

export const buildingTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const buildingItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  buildingType: buildingTypeItemDTO,
  farm: farmItemDTO,
});

export const coopItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopCode: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
});

export const heaterTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const heaterInRoomItemDTO = Type.Object({
  roomId: Type.String(),
  heaterTypeId: Type.String(),
  quantity: Type.Number(),
  heaterType: heaterTypeItemDTO,
});

export const fanItemDTO = Type.Object({
  id: Type.String(),
  size: Type.Number(),
  capacity: Type.Number(),
});

export const roomItemDTO = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
  population: Type.Number(),
  inletWidth: Nullable(Type.Number()),
  inletLength: Nullable(Type.Number()),
  inletPosition: Type.Union([
    Type.KeyOf(
      Type.Object({
        DEPAN: Type.String(),
        SAMPING: Type.String(),
        LETTER_U: Type.String(),
      }),
    ),
    Type.Null(),
  ]),
  isActive: Type.Boolean(),
  isCoolingPadExist: Type.Boolean(),
  buildingId: Type.String(),
  roomTypeId: Type.String(),
  floorTypeId: Type.String(),
  controllerTypeId: Nullable(Type.String()),
  coopId: Nullable(Type.String()),
  building: buildingItemDTO,
  roomType: roomTypeItemDTO,
  floorType: floorTypeItemDTO,
  controllerType: Nullable(controllerTypeItemDTO),
  coop: Nullable(coopItemDTO),
  heaterInRooms: Type.Array(heaterInRoomItemDTO),
  fans: Type.Array(fanItemDTO),
});

export const getRoomsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  $order: Type.Optional(
    Type.KeyOf(
      Type.Object({
        population__ASC: Type.String(),
        population__DESC: Type.String(),
        modifiedDate__ASC: Type.String(),
        modifiedDate__DESC: Type.String(),
      }),
    ),
  ),
  buildingId: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
  farmId: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  buildingName: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  buildingTypeId: Type.Optional(Type.String()),
  roomTypeId: Type.Optional(Type.String()),
  floorTypeId: Type.Optional(Type.String()),
});

export const getRoomsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(roomItemDTO),
});

export const getRoomByIdParamsDTO = Type.Object({
  roomId: Type.String(),
});

export const getRoomByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: roomItemDTO,
});

export const createRoomBodyDTO = Type.Object({
  population: Type.Number(),
  inletWidth: Nullable(Type.Number()),
  inletLength: Nullable(Type.Number()),
  inletPosition: Type.Union([
    Type.KeyOf(
      Type.Object({
        DEPAN: Type.String(),
        SAMPING: Type.String(),
        LETTER_U: Type.String(),
      }),
    ),
    Type.Null(),
  ]),
  isActive: Type.Boolean(),
  isCoolingPadExist: Type.Boolean(),
  buildingId: Type.String(),
  roomTypeId: Type.String(),
  floorTypeId: Type.String(),
  controllerTypeId: Nullable(Type.String()),
  coopId: Nullable(Type.String()),
  fans: Type.Array(
    Type.Object({
      size: Type.Number(),
      capacity: Type.Number(),
    }),
  ),
  heaterInRooms: Type.Array(
    Type.Object({
      heaterTypeId: Type.String(),
      quantity: Type.Number(),
    }),
  ),
});

export const updateRoomBodyDTO = Type.Object({
  ...createRoomBodyDTO.properties,
  fans: Type.Array(
    Type.Object({
      id: Type.Optional(Type.String()),
      size: Type.Number(),
      capacity: Type.Number(),
    }),
  ),
  heaterInRooms: Type.Array(
    Type.Object({
      roomId: Type.Optional(Type.String()),
      heaterTypeId: Type.String(),
      quantity: Type.Number(),
    }),
  ),
});

export type GetRoomsQuery = Static<typeof getRoomsQueryDTO>;

export type GetRoomsResponse = Static<typeof getRoomsResponseDTO>;

export type GetRoomByIdParams = Static<typeof getRoomByIdParamsDTO>;

export type GetRoomByIdResponse = Static<typeof getRoomByIdResponseDTO>;

export type CreateRoomBody = Static<typeof createRoomBodyDTO>;

export type UpdateRoomBody = Static<typeof updateRoomBodyDTO>;
