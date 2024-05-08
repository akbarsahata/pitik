import { Static, Type } from '@sinclair/typebox';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const activeFarmingCycleItemDTO = Type.Object({
  farmId: Type.String(),
  farmCode: Type.String(),
  farmName: Type.String(),
  coopId: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  farmingCycleId: Type.String(),
  day: Nullable(Type.Number()),
});

export const activeFarmingCycleResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(activeFarmingCycleItemDTO),
});

export const farmItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  userOwnerId: Type.String(),
  farmCode: Type.String(),
  farmName: Type.String(),
  provinceId: Type.Number(),
  cityId: Type.Number(),
  districtId: Type.Number(),
  zipCode: Type.String(),
  addressName: Type.String(),
  address1: Type.String(),
  address2: Type.Optional(Type.String()),
  latitude: Type.String(),
  longitude: Type.String(),
  remarks: Type.Optional(Type.String()),
  status: Type.Boolean(),
  provinceName: Type.Optional(Type.String()),
  cityName: Type.Optional(Type.String()),
  districtName: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  branchName: Type.Optional(Type.String()),
  branchCode: Type.Optional(Type.String()),
  ownerName: Type.Optional(Type.String()),
  category: Type.Optional(Type.Enum(FarmChickCategory)),
});

export const createFarmBodyDTO = Type.Object({
  ...farmItemDTO.properties,
});

export const createFarmResponseDTO = Type.Object({
  code: Type.Number(),
  data: farmItemDTO,
});

export const getFarmsQueryDTO = Type.Object({
  userOwnerId: Type.Optional(Type.String()),
  farmCode: Type.Optional(Type.String()),
  farmName: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  provinceId: Type.Optional(Type.Number()),
  cityId: Type.Optional(Type.Number()),
  districtId: Type.Optional(Type.Number()),
  status: Type.Optional(Type.Boolean()),
  category: Type.Optional(Type.Enum(FarmChickCategory)),
  ...Type.Partial(paginationDTO).properties,
});

export const getFarmResponseItemDTO = Type.Object({
  ...farmItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const getFarmsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getFarmResponseItemDTO),
});

export const getFarmByIdParamDTO = Type.Object({
  id: Type.String(),
});

export const getFarmByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getFarmResponseItemDTO,
});

export const updateFarmParamDTO = Type.Object({
  id: Type.String(),
});

export const updateFarmBodyDTO = Type.Object({
  ...Type.Partial(farmItemDTO).properties,
});

export const updateFarmResponseDTO = Type.Object({
  code: Type.Number(),
  data: getFarmResponseItemDTO,
});

export type ActiveFarmingCycleItem = Static<typeof activeFarmingCycleItemDTO>;

export type ActiveFarmingCycleResponse = Static<typeof activeFarmingCycleResponseDTO>;

export type FarmingItem = Static<typeof farmItemDTO>;

export type CreateFarmBody = Static<typeof createFarmBodyDTO>;

export type CreateFarmResponse = Static<typeof createFarmResponseDTO>;

export type GetFarmsQuery = Static<typeof getFarmsQueryDTO>;

export type GetFarmsResponse = Static<typeof getFarmsResponseDTO>;

export type GetFarmByIdParam = Static<typeof getFarmByIdParamDTO>;

export type GetFarmByIdResponse = Static<typeof getFarmByIdResponseDTO>;

export type UpdateFarmParam = Static<typeof updateFarmParamDTO>;

export type UpdateFarmBody = Static<typeof updateFarmBodyDTO>;

export type UpdateFarmResponse = Static<typeof updateFarmResponseDTO>;

export type GetFarmResponseItem = Static<typeof getFarmResponseItemDTO>;
