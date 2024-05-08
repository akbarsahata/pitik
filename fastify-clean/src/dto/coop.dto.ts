import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const coopImageItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  filename: Type.String(),
});

export const coopItemInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopCode: Type.String(),
  coopName: Type.String(),
  farmId: Type.String(),
  coopTypeId: Type.String(),
  status: Type.Boolean(),
  userSupervisorId: Type.Optional(Type.String()),
  leaderId: Type.Optional(Type.String()),
  workerIds: Type.Optional(Type.Array(Type.String())),
  memberIds: Type.Optional(Type.Array(Type.String())),
  chickTypeId: Type.Optional(Type.String()),
  chickInDate: Type.Optional(Type.String({ format: 'date' })),
  numFan: Type.Optional(Type.Number()),
  capacityFan: Type.Optional(Type.Number()),
  height: Type.Optional(Type.Number()),
  length: Type.Optional(Type.Number()),
  width: Type.Optional(Type.Number()),
  maxCapacity: Type.Optional(Type.Number()),
  typeControllerId: Type.Optional(Type.String()),
  otherControllerType: Type.Optional(Type.String()),
  typeInletId: Type.Optional(Type.String()),
  otherInletType: Type.Optional(Type.String()),
  typeHeaterId: Type.Optional(Type.String()),
  otherHeaterType: Type.Optional(Type.String()),
  remarks: Type.Optional(Type.String()),
  images: Type.Optional(Type.Array(coopImageItemDTO)),
  branchId: Type.Optional(Type.String()),
  branchName: Type.Optional(Type.String()),
  contractTypeId: Type.Optional(Type.String()),
  contractId: Type.Optional(Type.String()),
});

export const coopTypeItemDTO = Type.Object({
  id: Type.String(),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
});

export const chickTypeItemDTO = Type.Object({
  id: Type.String(),
  chickTypeCode: Type.String(),
  chickTypeName: Type.String(),
});

const toolStatusEnum = {
  Y: 'Y',
  N: 'N',
};

export const toolsDTO = Type.Object({
  name: Type.String(),
  status: Type.Enum(toolStatusEnum),
});

export const userItemDTO = Type.Object({
  id: Type.String(),
  userCode: Type.String(),
  fullName: Type.String(),
});

export const farmItemDTO = Type.Object({
  id: Type.String(),
  farmCode: Type.String(),
  farmName: Type.String(),
  userOwnerId: Type.String(),
  owner: userItemDTO,
});

export const coopItemOutputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopCode: Type.String(),
  coopName: Type.String(),
  farmId: Type.String(),
  coopTypeId: Type.String(),
  chickTypeId: Type.Optional(Type.String()),
  chickInDate: Type.Optional(Nullable(Type.String({ format: 'date' }))),
  numFan: Type.Optional(Type.Number()),
  capacityFan: Type.Optional(Type.Number()),
  height: Type.Optional(Type.Number()),
  length: Type.Optional(Type.Number()),
  width: Type.Optional(Type.Number()),
  maxCapacity: Type.Optional(Type.Number()),
  typeControllerId: Type.Optional(Type.String()),
  typeInletId: Type.Optional(Type.String()),
  typeHeaterId: Type.Optional(Type.String()),
  remarks: Type.Optional(Type.String()),
  status: Type.Boolean(),
  createdBy: Type.String(),
  createdDate: Type.String(),
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(Nullable(chickTypeItemDTO)),
  otherControllerType: Type.Optional(Type.String()),
  controllerType: Type.Optional(toolsDTO),
  otherInletType: Type.Optional(Type.String()),
  inletType: Type.Optional(toolsDTO),
  otherHeaterType: Type.Optional(Type.String()),
  heaterType: Type.Optional(toolsDTO),
  farm: Type.Optional(farmItemDTO),
  leader: Type.Optional(userItemDTO),
  workers: Type.Optional(Type.Array(userItemDTO)),
  coopImages: Type.Optional(Type.Array(coopImageItemDTO)),
  timezone: Type.Optional(Type.String()),
  userSupervisorId: Type.Optional(Nullable(Type.String())),
  userSupervisorRoleId: Type.Optional(Nullable(Type.String())),
  branchId: Type.Optional(Nullable(Type.String())),
  branchName: Type.Optional(Nullable(Type.String())),
  contractTypeId: Type.Optional(Nullable(Type.String())),
  contractId: Type.Optional(Nullable(Type.String())),
  contractName: Type.Optional(Type.String()),
});

export const getCoopsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ownerId: Type.Optional(Type.String()),
  farmName: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  coopTypeId: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  coopCode: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  contractTypeId: Type.Optional(Type.String()),
  farmingCycleStatus: Type.Optional(
    Type.KeyOf(
      Type.Object({
        NEW: Type.String(),
        IN_PROGRESS: Type.String(),
        CLOSED: Type.String(),
        PENDING: Type.String(),
      }),
    ),
  ),
});

export const getCoopsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(coopItemOutputDTO),
});

export const getCoopByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getCoopByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopItemOutputDTO,
});

export const createCoopBodyDTO = Type.Object({
  ...coopItemInputDTO.properties,
});

export const createCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopItemOutputDTO,
});

export const updateCoopBodyDTO = Type.Object({
  ...Type.Partial(coopItemInputDTO).properties,
});

export const updateCoopParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopItemOutputDTO,
});

export const getIdleCoopQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
  ignoreCache: Type.Optional(Type.Boolean()),
});

export const idleCoopItemDTO = Type.Object({
  id: Type.String(),
  coopName: Type.String(),
  coopDistrict: Type.String(),
  coopCity: Type.String(),
  period: Type.Number(),
  closedDate: Type.Optional(Type.String()),
  status: Type.Number(),
  statusText: Type.String(),
  chickInRequestId: Type.String(),
  purchaseRequestOvkId: Type.String(),
  chickInRequest: Type.Object({
    id: Type.String(),
    isApproved: Type.Boolean(),
  }),
  purchaseRequestOvk: Type.Object({
    id: Type.String(),
    isApproved: Type.Boolean(),
    farmingCycleId: Type.String(),
  }),
});

export const getIdleCoopsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(idleCoopItemDTO),
});

export const getActiveCoopQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
  ignoreCache: Type.Optional(Type.Boolean()),
});

export const coopPerformanceItemDTO = Type.Object({
  bw: Type.Optional(
    Type.Object({
      actual: Type.Number(),
      standard: Type.Number(),
    }),
  ),
  ip: Type.Optional(
    Type.Object({
      actual: Type.Number(),
      standard: Type.Number(),
    }),
  ),
});

export const activeCoopItemDTO = Type.Object({
  id: Type.String(),
  coopName: Type.String(),
  coopDistrict: Type.String(),
  coopCity: Type.String(),
  isNew: Type.Boolean(),
  period: Type.Number(),
  day: Type.Number(),
  farmingCycleId: Type.String(),
  farmId: Type.String(),
  startDate: Type.Optional(Type.String()),
  isActionNeeded: Type.Boolean(),
  ...coopPerformanceItemDTO.properties,
});

export const getActiveCoopsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(activeCoopItemDTO),
});

export const deleteCoopImageParamDTO = Type.Object({
  id: Type.String(),
});

/**
 * production member = pitik's internal employeee (FS, PPL, etc)
 */
export const productionTeamMemberDTO = Type.Object({
  id: Type.String(),
  fullName: Type.String(),
  userType: Type.String(),
});

export const getAvailableCoopItemDTO = Type.Object({
  id: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  initialPopulation: Type.Number(),
  ownerId: Type.String(),
  productionTeam: Type.Array(productionTeamMemberDTO),
  branch: Nullable(Type.Any()),
  contract: Nullable(Type.Any()),
  contractType: Nullable(Type.Any()),
});

export const getAvailableCoopQueryDTO = Type.Object({
  coopName: Type.Optional(Type.String()),
  ...Type.Partial(paginationDTO).properties,
});

export const getAvailableCoopResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getAvailableCoopItemDTO),
});

export type CoopItemInput = Static<typeof coopItemInputDTO>;

export type CoopItemOutput = Static<typeof coopItemOutputDTO>;

export type GetCoopsQuery = Static<typeof getCoopsQueryDTO>;

export type GetCoopsResponse = Static<typeof getCoopsResponseDTO>;

export type GetCoopByIdParams = Static<typeof getCoopByIdParamsDTO>;

export type GetCoopByIdResponse = Static<typeof getCoopByIdResponseDTO>;

export type CreateCoopBody = Static<typeof createCoopBodyDTO>;

export type CreateCoopResponse = Static<typeof createCoopResponseDTO>;

export type UpdateCoopBody = Static<typeof updateCoopBodyDTO>;

export type UpdateCoopParams = Static<typeof updateCoopParamsDTO>;

export type UpdateCoopResponse = Static<typeof updateCoopResponseDTO>;

export type GetIdleCoopQuery = Static<typeof getIdleCoopQueryDTO>;

export type IdleCoopItem = Static<typeof idleCoopItemDTO>;

export type GetIdleCoopsResponse = Static<typeof getIdleCoopsResponseDTO>;

export type GetActiveCoopQuery = Static<typeof getActiveCoopQueryDTO>;

export type ActiveCoopItem = Static<typeof activeCoopItemDTO>;

export type GetActiveCoopsResponse = Static<typeof getActiveCoopsResponseDTO>;

export type DeleteCoopImageParam = Static<typeof deleteCoopImageParamDTO>;

export type CoopPerformanceItem = Static<typeof coopPerformanceItemDTO>;

export type AvailableCoopItem = Static<typeof getAvailableCoopItemDTO>;

export type GetAvailableCoopQuery = Static<typeof getAvailableCoopQueryDTO>;

export type GetAvailableCoopResponse = Static<typeof getAvailableCoopResponseDTO>;
