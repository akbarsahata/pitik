import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

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

export const buildingTypeDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export const getBuildingsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  farmId: Type.Optional(Type.String()),
  buildingTypeId: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
  ownerId: Type.Optional(Type.String()),
  buildingName: Type.Optional(Type.String()),
  $order: Type.Optional(
    Type.KeyOf(
      Type.Object({
        name__ASC: Type.String(),
        name__DESC: Type.String(),
        modifiedDate__ASC: Type.String(),
        modifiedDate__DESC: Type.String(),
        farm__farmName__ASC: Type.String(),
        farm__farmName__DESC: Type.String(),
      }),
    ),
  ),
});

export const buildingItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
  length: Type.Number(),
  width: Type.Number(),
  height: Type.Number(),
  farmId: Type.String(),
  buildingTypeId: Type.String(),
  farm: farmItemDTO,
  buildingType: buildingTypeDTO,
});

export const getBuildingsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(buildingItemDTO),
});

export const createBuildingBodyDTO = Type.Object({
  name: Type.String(),
  isActive: Type.Boolean(),
  length: Type.Number(),
  width: Type.Number(),
  height: Type.Number(),
  farmId: Type.String(),
  buildingTypeId: Type.String(),
  coopId: Type.Optional(Type.String()),
});

export const updateBuildingBodyDTO = Type.Partial(createBuildingBodyDTO);

export const getBuildingResponseDTO = Type.Object({
  code: Type.Number(),
  data: buildingItemDTO,
});

export const getBuildingParamsDTO = Type.Object({
  buildingId: Type.String(),
});

export const getBuildingByCoopIdParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const getBuildingByCoopIdItemRoomDTO = Type.Object({
  roomId: Type.String(),
  roomCode: Type.String(),
  roomTypeName: Type.String(),
});

export const getBuildingByCoopIdItemDTO = Type.Object({
  buildingId: Type.String(),
  buildingName: Type.String(),
  ...getBuildingByCoopIdItemRoomDTO.properties,
});

export const getBuildingByCoopIdResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getBuildingByCoopIdItemDTO),
});

export type BuildingTypeItem = Static<typeof buildingItemDTO>;

export type GetBuildingsQuery = Static<typeof getBuildingsQueryDTO>;

export type GetBuildingsResponse = Static<typeof getBuildingsResponseDTO>;

export type CreateBuildingBody = Static<typeof createBuildingBodyDTO>;

export type UpdateBuildingBody = Static<typeof updateBuildingBodyDTO>;

export type GetBuildingResponse = Static<typeof getBuildingResponseDTO>;

export type GetBuildingParams = Static<typeof getBuildingParamsDTO>;

export type GetBuildingByCoopIdParams = Static<typeof getBuildingByCoopIdParamsDTO>;

export type GetBuildingByCoopIdItem = Static<typeof getBuildingByCoopIdItemDTO>;

export type GetBuildingByCoopIdItemRoom = Static<typeof getBuildingByCoopIdItemRoomDTO>;

export type GetBuildingByCoopIdResponse = Static<typeof getBuildingByCoopIdResponseDTO>;
