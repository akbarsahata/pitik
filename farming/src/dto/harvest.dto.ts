import { Static, Type } from '@sinclair/typebox';
import { HarvestDealStatusEnum } from '../datasources/entity/pgsql/HarvestDeal.entity';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const harvestStatusEnum = Type.KeyOf(
  Type.Object({
    NEW: Type.String(),
    CLOSED: Type.String(),
    IN_PROGRESS: Type.String(),
    PENDING: Type.String(),
  }),
);

export const userTypeEnum = Type.KeyOf(
  Type.Object({
    owner: Type.String(),
    ppl: Type.String(),
  }),
);

export const getFarmingCycleHarvestsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  farmingCycleId: Type.Optional(Type.String()),
  farmingCycleCode: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  status: Type.Optional(harvestStatusEnum),
});

export const farmItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  branch: Nullable(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
  ),
});

export const coopItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const memberItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  userType: userTypeEnum,
});

export const harvestItemDTO = Type.Object({
  count: Type.Optional(Type.Number()),
  latestHarvestDate: Type.Optional(Type.String()),
  total: Type.Object({
    quantity: Type.Optional(Type.Number()),
    tonnage: Type.Optional(Type.Number()),
  }),
});

export const farmingCycleHarvestItemDTO = Type.Object({
  id: Type.String(),
  farmingCycleCode: Type.String(),
  initialPopulation: Type.Number(),
  populationMortaled: Type.Number(),
  status: harvestStatusEnum,
  farm: farmItemDTO,
  coop: coopItemDTO,
  members: Type.Array(memberItemDTO),
  harvest: harvestItemDTO,
});

export const getFarmingCycleHarvestsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    count: Type.Number(),
    farmingCycles: Type.Array(farmingCycleHarvestItemDTO),
  }),
});

export const getFarmingCycleDetailParamDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getFarmingCycleDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: farmingCycleHarvestItemDTO,
});

export const getHarvestDealQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  deliveryOrder: Type.Optional(Type.String()),
  bakulName: Type.Optional(Type.String()),
  weighingNumber: Type.Optional(Type.String()),
  date: Type.Optional(Type.String({ format: 'date' })),
});

export const getHarvestRealizationQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
});

export const harvestDealItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  date: Type.String(),
  bakulName: Type.String(),
  deliveryOrder: Type.String(),
  weighingNumber: Type.String(),
  status: Type.Enum(HarvestDealStatusEnum),
  total: Type.Object({
    quantity: Type.Optional(Type.Number()),
    tonnage: Type.Optional(Type.Number()),
  }),
  harvestRealizationId: Nullable(Type.String()),
  reason: Type.Optional(Type.String()),
});

export const harvestRealizationItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  date: Type.String(),
  bakulName: Type.String(),
  deliveryOrder: Type.String(),
  weighingNumber: Type.String(),
  status: Type.Enum(RealizationStatusEnum),
  total: Type.Object({
    quantity: Type.Optional(Type.Number()),
    tonnage: Type.Optional(Type.Number()),
  }),
});

export const getHarvestDealResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    count: Type.Number(),
    deals: Type.Array(harvestDealItemDTO),
  }),
});

export const getHarvestRealizationResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    count: Type.Number(),
    realizations: Type.Array(harvestRealizationItemDTO),
  }),
});

export const getRealizationDetailParamDTO = Type.Object({
  farmingCycleId: Type.String(),
  realizationId: Type.String(),
});

export const harvestRealizationDetailItemDTO = Type.Object({
  id: Type.String(),
  harvestDealId: Type.String(),
  date: Type.String(),
  bakulName: Type.String(),
  deliveryOrder: Type.String(),
  truckLicensePlate: Type.String(),
  driver: Type.String(),
  weighingNumber: Type.String(),
  status: Type.Enum(RealizationStatusEnum),
  createdDate: Type.String(),
  total: Type.Object({
    quantity: Type.Number(),
    tonnage: Type.Number(),
  }),
  records: Type.Array(
    Type.Object({
      quantity: Type.Number(),
      tonnage: Type.Number(),
    }),
  ),
});

export const getRealizationDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestRealizationDetailItemDTO,
});

export const createRealizationBodyDTO = Type.Object({
  harvestDealId: Type.String(),
  status: Type.Optional(Type.Enum(RealizationStatusEnum)),
  date: Type.String(),
  truckLicensePlate: Type.String(),
  driver: Type.String(),
  weighingNumber: Type.String(),
  records: Type.Array(
    Type.Object({
      quantity: Type.Number(),
      tonnage: Type.Number(),
    }),
  ),
});

export const updateRealizationBodyDTO = Type.Object({
  harvestDealId: Type.String(),
  status: Type.Optional(Type.Enum(RealizationStatusEnum)),
  date: Type.String(),
  truckLicensePlate: Type.String(),
  driver: Type.String(),
  weighingNumber: Type.String(),
  records: Type.Array(
    Type.Object({
      quantity: Type.Number(),
      tonnage: Type.Number(),
    }),
  ),
});

export const deleteRealizationResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type UserTypeEnum = Static<typeof userTypeEnum>;

export type GetFarmingCycleHarvestsQuery = Static<typeof getFarmingCycleHarvestsQueryDTO>;

export type FarmingCycleHarvestItem = Static<typeof farmingCycleHarvestItemDTO>;

export type GetFarmingCycleHarvestsResponse = Static<typeof getFarmingCycleHarvestsResponseDTO>;

export type GetFarmingCycleDetailParam = Static<typeof getFarmingCycleDetailParamDTO>;

export type GetFarmingCycleDetailResponse = Static<typeof getFarmingCycleDetailResponseDTO>;

export type GetHarvestRealizationQuery = Static<typeof getHarvestRealizationQueryDTO>;

export type GetHarvestDealQuery = Static<typeof getHarvestDealQueryDTO>;

export type HarvestRealizationItem = Static<typeof harvestRealizationItemDTO>;

export type HarvestDealItem = Static<typeof harvestDealItemDTO>;

export type GetHarvestDealResponse = Static<typeof getHarvestDealResponseDTO>;

export type GetHarvestRealizationResponse = Static<typeof getHarvestRealizationResponseDTO>;

export type HarvestRealizationDetailItem = Static<typeof harvestRealizationDetailItemDTO>;

export type GetRealizationDetailParam = Static<typeof getRealizationDetailParamDTO>;

export type GetRealizationDetailResponse = Static<typeof getRealizationDetailResponseDTO>;

export type CreateRealizationBody = Static<typeof createRealizationBodyDTO>;

export type UpdateRealizationBody = Static<typeof updateRealizationBodyDTO>;

export type DeleteRealizationResponse = Static<typeof deleteRealizationResponseDTO>;
