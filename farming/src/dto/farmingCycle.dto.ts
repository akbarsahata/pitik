/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { ChickTypeCategory } from '../datasources/entity/pgsql/ChickType.entity';
import { DailyMonitoringRevisionStatusEnum } from '../datasources/entity/pgsql/DailyMonitoringRevision.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import {
  VAR_ABW_CODE,
  VAR_FCR_TARGET_CODE,
  VAR_MOHA_CODE,
  VAR_TRG_IP_CODE,
} from '../libs/constants/variableCodes';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export enum OperatorTypeEnum {
  KK = 'Kepala Kandang',
  AK = 'Anak Kandang',
}

export enum dailyMonitoringVariableKeyToStandardValue {
  bw = 'minValue',
  ip = 'minValue',
  fcr = 'maxValue',
  mortality = 'maxValue',
}

export const dailyMonitoringVariableKeyToCode = {
  bw: VAR_ABW_CODE,
  ip: VAR_TRG_IP_CODE,
  fcr: VAR_FCR_TARGET_CODE,
  mortality: VAR_MOHA_CODE,
};

export const farmingCycleOperatorItemDTO = Type.Object({
  id: Type.String(),
  userCode: Type.String(),
  fullName: Type.String(),
  phoneNumber: Type.String(),
  role: Type.Enum(OperatorTypeEnum),
});

export const farmingCycleOperatorListDTO = Type.Array(farmingCycleOperatorItemDTO);

export const farmingCycleOperatorParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const farmingCycleByIdParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const farmingCycleItemMemberDTO = Type.Object({
  memberId: Type.String(),
  userId: Type.String(),
  name: Type.String(),
  userType: Type.String(),
});

export const farmingCycleItemMemberGroupDTO = Type.Object({
  leaders: Type.Array(farmingCycleItemMemberDTO),
  workers: Type.Array(farmingCycleItemMemberDTO),
  ppls: Type.Array(farmingCycleItemMemberDTO),
  productionTeam: Type.Array(farmingCycleItemMemberDTO),
});

export const farmItemDTO = Type.Object({
  id: Type.String(),
  farmCode: Type.String(),
  farmName: Type.String(),
  userOwnerId: Type.String(),
  provinceId: Type.Number(),
  cityId: Type.Number(),
  districtId: Type.Number(),
  zipCode: Type.String(),
  addressName: Type.String(),
  address1: Type.String(),
  address2: Type.String(),
  latitude: Type.String(),
  longitude: Type.String(),
  remarks: Type.String(),
  status: Type.Boolean(),
  category: Type.Enum(FarmChickCategory),
});

export const coopItemDTO = Type.Object({
  id: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  farmId: Type.String(),
  coopTypeId: Type.String(),
  chickTypeId: Type.String(),
  numFan: Type.Number(),
  capacityFan: Type.Number(),
  height: Type.Number(),
  length: Type.Number(),
  width: Type.Number(),
  maxCapacity: Type.Number(),
  remarks: Type.String(),
  status: Type.Boolean(),
});

export const farmingCycleItemDTO = Type.Object({
  id: Type.String(),
  farmingCycleCode: Type.String(),
  chickInDate: Type.String(),
  farmingCycleStartDate: Type.String(),
  farmId: Type.String(),
  coopId: Type.String(),
  userPplId: Type.String(),
  farmingCycleId: Type.String(),
  chickTypeId: Type.String(),
  feedBrandId: Type.String(),
  initialPopulation: Type.Number(),
  initialFeedStock: Type.Number(),
  chickSupplier: Type.String(),
  hatchery: Type.String(),
  cycleStatus: Type.Boolean(),
  farmingStatus: Type.String(),
  remarks: Type.String(),
  closedDate: Type.String(),
  isRepopulated: Type.Boolean(),
  farm: farmItemDTO,
  coop: coopItemDTO,
  docInBW: Nullable(Type.Number()),
  docInUniformity: Nullable(Type.Number()),
  pulletInWeeks: Nullable(Type.Number()),
  contract: Nullable(
    Type.Object({
      id: Type.String(),
      code: Type.String(),
    }),
  ),
  branch: Nullable(
    Type.Object({
      id: Type.String(),
      code: Type.String(),
      name: Type.String(),
    }),
  ),
  contractType: Nullable(
    Type.Object({
      id: Type.String(),
      contractName: Type.String(),
      status: Type.String(),
    }),
  ),
  ...farmingCycleItemMemberGroupDTO.properties,
});

export const farmingCycleByIdResponseDTO = Type.Object({
  data: farmingCycleItemDTO,
});

export const farmingCycleOperatorResponseDTO = Type.Object({
  data: farmingCycleOperatorListDTO,
});

export const assignOperatorsToFarmingCycleBodyDTO = Type.Object({
  operatorIds: Type.Array(Type.String()),
});

export const assignOperatorsToFarmingCycleResponseDTO = Type.Object({
  data: Type.Object({
    farmingCycleMemberIds: Type.Array(Type.String()),
  }),
});

export const farmingCycleSummaryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const farmingInfoItemDTO = Type.Object({
  id: Type.String(),
  initialPopulation: Type.Number(),
  farmingCycleStartDate: Type.String(),
  day: Nullable(Type.Number()),
  mortality: Type.Number(),
  culled: Type.Number(),
  harvested: Type.Number(),
  deadChick: Type.Number(),
  estimatedPopulation: Type.Number(),
});

export const farmingCycleSummaryResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    farmingInfo: farmingInfoItemDTO,
  }),
});

export const farmingCyclePplInfoParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const userItemDTO = Type.Object({
  fullName: Type.String(),
  waNumber: Type.String(),
});

export const farmingCyclePplInfoResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(userItemDTO),
});

export const dailyReportsParamDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const dailyReportsQueryDTO = Type.Partial(paginationDTO);

export const dailyReportsResponseItemDTO = Type.Object({
  taskTicketId: Type.String(),
  status: Type.String(),
  date: Type.String(),
});

export const dailyReportsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(dailyReportsResponseItemDTO),
});

export const submitDailyReportParamDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
});

export const submitDailyReportBodyDTO = Type.Object({
  averageWeight: Type.Optional(Type.Number()),
  mortality: Type.Optional(Type.Number()),
  culling: Type.Number(),
  feedTypeCode: Nullable(Type.String()),
  feedAdditionalInfo: Type.Optional(Type.String()),
  feedQuantity: Type.Number(),
  images: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.Optional(Type.String()),
        url: Type.String(),
      }),
    ),
  ),
  mortalityImage: Type.Optional(Type.String()),
  recordingImage: Type.Optional(Type.String()),
  feedConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        feedStockSummaryId: Type.String(),
        quantity: Type.Number({ minimum: 0 }),
        // TODO: remove this if procurement feature for layer is implemented
        subcategoryCode: Type.Optional(Type.String()),
        subcategoryName: Type.Optional(Type.String()),
        productCode: Type.Optional(Type.String()),
        productName: Type.Optional(Type.String()),
      }),
    ),
  ),
  ovkConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        ovkStockSummaryId: Type.String(),
        quantity: Type.Number({ minimum: 0 }),
        remarks: Type.Optional(Type.String()),
        // TODO: remove this if procurement feature for layer is implemented
        subcategoryCode: Type.Optional(Type.String()),
        subcategoryName: Type.Optional(Type.String()),
        productCode: Type.Optional(Type.String()),
        productName: Type.Optional(Type.String()),
      }),
    ),
  ),
  summary: Type.Optional(Nullable(Type.String())),
  issues: Type.Optional(
    Type.Object({
      infrastructure: Type.Array(Type.String()),
      management: Type.Array(Type.String()),
      farmInput: Type.Array(Type.String()),
      diseases: Type.Array(Type.String()),
      forceMajeure: Type.Array(Type.String()),
      others: Nullable(Type.String()),
    }),
  ),
  treatment: Type.Optional(Type.Array(Type.String())),
  mortalityList: Type.Optional(
    Type.Array(
      Type.Object({
        quantity: Type.Number(),
        cause: Type.String(),
      }),
    ),
  ),
  remarks: Type.Optional(Type.String()),
  isAbnormal: Type.Optional(Type.Boolean()),
  eggDisposal: Type.Optional(Type.Number({ default: 0 })),
  harvestedEgg: Type.Optional(
    Type.Array(
      Type.Object({
        productItemId: Type.String(),
        quantity: Type.Number(),
        weight: Type.Number(),
      }),
    ),
  ),
});

export const submitDailyReportResponseItemDTO = Type.Object({
  day: Type.Number(),
  date: Type.String(),
  performance: Type.Object({
    bw: Type.Object({
      actual: Type.Optional(Type.Number()),
      standard: Type.Optional(Type.Number()),
    }),
    mortality: Type.Object({
      actual: Type.Optional(Type.Number()),
      standard: Type.Optional(Type.Number()),
    }),
  }),
  feed: Type.Object({
    remaining: Type.Optional(Type.Number()),
    stockoutDate: Type.Optional(Type.String()),
  }),
  temperature: Type.Optional(Type.String()),
  humidity: Type.Optional(Type.String()),
  heatStress: Type.Optional(Type.String()),
  issues: Type.Optional(
    Type.Object({
      infrastructure: Type.Array(Type.String()),
      management: Type.Array(Type.String()),
      farmInput: Type.Array(Type.String()),
      diseases: Type.Array(Type.String()),
      forceMajeure: Type.Array(Type.String()),
      others: Nullable(Type.String()),
    }),
  ),
  treatment: Type.Optional(Type.Array(Type.String())),
  summary: Type.Optional(Nullable(Type.String())),
});

export const submitDailyReportResponseDTO = Type.Object({
  code: Type.Number(),
  data: submitDailyReportResponseItemDTO,
});

export const getDailyReportParamDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
});

export const getDailyReportResponseItemDTO = Type.Object({
  revisionStatus: Type.Union([Type.Enum(DailyMonitoringRevisionStatusEnum), Type.Null()]),
  averageWeight: Type.Number(),
  mortality: Type.Number(),
  culling: Type.Number(),
  feedTypeCode: Type.String(),
  feedQuantity: Type.Number(),
  feedAdditionalInfo: Type.Optional(Type.String()),
  images: Type.Array(
    Type.Object({
      id: Type.Optional(Type.String()),
      url: Type.String(),
    }),
  ),
  feedConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        feedStockSummaryId: Type.String(),
        subcategoryCode: Type.String(),
        subcategoryName: Type.String(),
        productCode: Type.String(),
        productName: Type.String(),
        quantity: Type.Number(),
        uom: Type.String(),
      }),
    ),
  ),
  ovkConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        ovkStockSummaryId: Type.String(),
        subcategoryCode: Type.String(),
        subcategoryName: Type.String(),
        productCode: Type.String(),
        productName: Type.String(),
        quantity: Type.Number(),
        uom: Type.String(),
        remarks: Type.Optional(Type.String()),
      }),
    ),
  ),
  issues: Type.Object({
    infrastructure: Type.Array(Type.String()),
    management: Type.Array(Type.String()),
    farmInput: Type.Array(Type.String()),
    diseases: Type.Array(Type.String()),
    forceMajeure: Type.Array(Type.String()),
    others: Nullable(Type.String()),
  }),
  summary: Nullable(Type.String()),
  treatment: Type.Optional(Type.Array(Type.String())),
  mortalityImage: Type.Optional(Nullable(Type.String())),
  recordingImage: Type.Optional(Nullable(Type.String())),
  mortalityList: Type.Optional(
    Type.Array(
      Type.Object({
        quantity: Type.Number(),
        cause: Type.String(),
      }),
    ),
  ),
  isAbnormal: Type.Optional(Type.Boolean()),
  eggDisposal: Type.Optional(Type.Number()),
  harvestedEgg: Type.Optional(
    Type.Array(
      Type.Object({
        productItemId: Type.String(),
        quantity: Type.Number(),
        weight: Type.Number(),
        productItem: Type.Object({
          name: Type.String(),
          uom: Nullable(Type.String()),
        }),
      }),
    ),
  ),
  remarks: Type.Optional(Type.String()),
});

export const getDailyReportResponseDTO = Type.Object({
  code: Type.Number(),
  data: getDailyReportResponseItemDTO,
});

export const dailyReportMarkAsReviewedParamDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
});

export const dailyMonitoringVariableKey = Type.KeyOf(
  Type.Object({
    bw: Type.String(),
    ip: Type.String(),
    fcr: Type.String(),
    mortality: Type.String(),
  }),
);

export const dailyMonitoringVariableParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  variable: dailyMonitoringVariableKey,
});

export const dailyMonitoringVariableResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      day: Type.Number(),
      actual: Type.Number(),
      standard: Type.Number(),
    }),
  ),
});

export const getDailyMonitoringDateParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getDailyMonitoringDateResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      farmingCycleId: Type.String(),
      taskTicketId: Nullable(Type.String()),
      date: Type.String(),
      day: Type.Number(),
    }),
  ),
});

export const getDailyMonitoringDetailParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Type.String(),
});

const dailyMonitoringVariableDTO = Type.Object({
  actual: Nullable(Type.Number()),
  standard: Nullable(Type.Number()),
});

export const dailyPerformanceMonitoringItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  taskTicketId: Nullable(Type.String()),
  date: Type.String(),
  day: Type.Number(),
  reportStatus: Type.String(),
  averageChickenAge: Nullable(Type.Number()),
  bw: dailyMonitoringVariableDTO,
  bwPrediction: Type.Optional(
    Type.Object({
      actual: Nullable(Type.Number()),
      status: Type.Optional(Type.Boolean()),
    }),
  ),
  adg: dailyMonitoringVariableDTO,
  ip: dailyMonitoringVariableDTO,
  fcr: dailyMonitoringVariableDTO,
  feedIntake: dailyMonitoringVariableDTO,
  mortality: dailyMonitoringVariableDTO,
  mortalityCummulative: dailyMonitoringVariableDTO,
  hdp: dailyMonitoringVariableDTO,
  eggWeight: dailyMonitoringVariableDTO,
  eggMass: dailyMonitoringVariableDTO,
  population: Type.Object({
    total: Nullable(Type.Number()),
    remaining: Nullable(Type.Number()),
    harvested: Nullable(Type.Number()),
    mortality: Nullable(Type.Number()),
    culled: Nullable(Type.Number()),
    dead: Nullable(Type.Number()),
  }),
  feed: Type.Object({
    consumption: Nullable(Type.Number()),
    remaining: Nullable(Type.Number()),
    stockoutDate: Nullable(Type.String()),
  }),
  ovk: Type.Object({
    consumption: Nullable(Type.Number()),
  }),
  mortalities: Type.Optional(
    Type.Array(Type.Object({ quantity: Type.Number(), cause: Type.String() })),
  ),
  cull: Type.Optional(Nullable(Type.Number())),
  recordingImage: Type.Optional(Nullable(Type.String())),
  hdpStandard: Type.Optional(Nullable(Type.Number())),
  eggMassStandard: Type.Optional(Nullable(Type.Number())),
  feedStocks: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        qty: Type.Number(),
        productDetail: Nullable(Type.String()),
        notes: Type.String(),
      }),
    ),
  ),
  ovkStocks: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        notes: Type.String(),
        subcategoryCode: Type.String(),
        subcategoryName: Type.String(),
        productCode: Type.String(),
        productName: Type.String(),
        quantity: Type.Number(),
        uom: Type.String(),
      }),
    ),
  ),
});

export const getDailyMonitoringDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: dailyPerformanceMonitoringItemDTO,
});

export const getAllDailyMonitoringsParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getAllDailyMonitoringsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(dailyPerformanceMonitoringItemDTO),
});

export const getFarmingCyclePerformanceParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getFarmingCyclePerformanceResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    coopName: Type.String(),
    day: Type.Number(),
    period: Type.Number(),
    currentTemperature: Nullable(Type.Number()),
    chickInDate: Type.String(),
    averageChickenAge: Nullable(Type.Number()),
    performance: Type.Object({
      bw: Nullable(dailyMonitoringVariableDTO),
      ip: Nullable(dailyMonitoringVariableDTO),
      fcr: Nullable(dailyMonitoringVariableDTO),
      mortality: Nullable(dailyMonitoringVariableDTO),
      hdp: Nullable(dailyMonitoringVariableDTO),
      eggMass: Nullable(dailyMonitoringVariableDTO),
      eggWeight: Nullable(dailyMonitoringVariableDTO),
      feedIntake: Nullable(dailyMonitoringVariableDTO),
    }),
    population: Nullable(
      Type.Object({
        total: Nullable(Type.Number()),
        harvested: Nullable(Type.Number()),
        mortality: Nullable(Type.Number()),
      }),
    ),
    feed: Nullable(
      Type.Object({
        remaining: Nullable(Type.Number()),
        stockoutDate: Nullable(Type.String()),
      }),
    ),
  }),
});

export const updateDOCinPhotoItemDTO = Type.Object({
  url: Type.String({ format: 'uri' }),
});

export const updateDOCinPhotoListDTO = Type.Array(updateDOCinPhotoItemDTO);

export const updateDOCinPhotoItemResponseDTO = Type.Object({
  id: Type.String(),
  url: Type.String({ format: 'uri' }),
});

export const updateDOCinPhotoListResponseDTO = Type.Array(updateDOCinPhotoItemResponseDTO);

export const updateDOCinBodyDTO = Type.Object(
  {
    poCode: Type.Optional(Type.String()),
    erpCode: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String({ format: 'date' })),
    initialPopulation: Type.Number({ minimum: 0 }),
    additionalPopulation: Type.Number({ minimum: 0 }),
    bw: Type.Number({ minimum: 0 }),
    uniformity: Type.Number({ minimum: 0 }),
    truckLeaving: Type.String(),
    truckArrival: Type.String(),
    finishChickIn: Type.String(),
    remarks: Type.String(),
    photos: updateDOCinPhotoListDTO,
    suratJalanPhotos: updateDOCinPhotoListDTO,
    docInFormPhotos: Type.Optional(updateDOCinPhotoListDTO),
    pulletInFormPhotos: Type.Optional(updateDOCinPhotoListDTO),
    pulletInWeeks: Type.Optional(Type.Number({ minimum: 0 })),
  },
  { additionalProperties: false },
);

export const updateDOCinResponseItemDTO = Type.Object({
  id: Type.String(),
  ...updateDOCinBodyDTO.properties,
  hasFinishedDOCin: Type.Boolean(),
  photos: updateDOCinPhotoListResponseDTO,
  suratJalanPhotos: updateDOCinPhotoListDTO,
  docInFormPhotos: updateDOCinPhotoListDTO,
  chickType: Type.Optional(
    Type.Object({
      id: Type.String(),
      chickTypeName: Type.String(),
      category: Type.Enum(ChickTypeCategory),
    }),
  ),
});

export const updateDOCinResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updateDOCinResponseItemDTO,
});

export const updateDOCinParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const updateDOCinJobDTO = Type.Object({
  body: updateDOCinBodyDTO,
  params: updateDOCinParamsDTO,
  user: Type.Object({
    id: Type.String(),
    role: Type.String(),
  }),
});

export const createFarmingCycleBodyDTO = Type.Object({
  coopId: Type.String(),
  farmingCycleStartDate: Type.String(),
  initialPopulation: Type.Number(),
  chickTypeId: Type.String(),
  chickSupplier: Type.String(),
  hatchery: Type.String(),
  remarks: Type.Optional(Type.String()),
  contract: Type.Optional(Type.String()),
  leaderId: Type.Optional(Type.String()),
  workerIds: Type.Optional(Type.Array(Type.String())),
  docInBW: Type.Optional(Type.Number()),
  docInUniformity: Type.Optional(Type.Number()),
  pulletInWeeks: Type.Optional(Type.Number()),
  /** FIXME:
   * Once the next feature is realese, the field below should be mandatory
   * and remove ppIds
   */
  pplIds: Type.Array(Type.String()),
  productionTeamIds: Type.Optional(Type.Array(Type.String())),
});

export const createFarmingCycleItemResponseDTO = Type.Object({
  id: Type.String(),
  farmId: Type.String(),
  coopId: Type.String(),
  initialPopulation: Type.Number(),
  cycleStatus: Type.Boolean(),
  farmingStatus: Type.String(),
  farmingCycleStartDate: Type.String({ format: 'date' }),
  chickTypeId: Type.String(),
  chickSupplier: Type.String(),
  hatchery: Type.String(),
  remarks: Type.String(),
  contract: Type.String(),
  docInBW: Type.Optional(Nullable(Type.Number())),
  docInUniformity: Type.Optional(Nullable(Type.Number())),
  pulletInWeeks: Type.Optional(Type.Number()),
});

export const createFarmingCycleResponseDTO = Type.Object({
  code: Type.Number(),
  data: createFarmingCycleItemResponseDTO,
});

export const updateFarmingCycleParamDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const updateFarmingCycleBodyDTO = Type.Object({
  ...createFarmingCycleBodyDTO.properties,
  farmingStatus: Type.Optional(Type.String()),
  closedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const updateFarmingCycleItemResponseDTO = Type.Object({
  ...updateFarmingCycleBodyDTO.properties,
});

export const updateFarmingCycleResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Partial(updateFarmingCycleItemResponseDTO),
});

export const getFarmingCyclesQueryDTO = Type.Object({
  farmingCycleCode: Type.Optional(Type.String()),
  farmingStatus: Type.Optional(Type.String()),
  coopTypeId: Type.Optional(Type.String()),
  chickTypeName: Type.Optional(Type.String()),
  chickTypeId: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  contract: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  contractTypeId: Type.Optional(Type.String()),
  farmCategory: Type.Optional(Type.Enum(FarmChickCategory)),
  ...Type.Partial(paginationDTO).properties,
});

export const getFarmingCycleResponseItemDTO = Type.Object({
  farmingCycleId: Type.String(),
  farmingCycleCode: Type.String(),
  farmingStatus: Type.String(),
  coopName: Type.String(),
  coopTypeName: Type.String(),
  initialPopulation: Type.Number(),
  productionTeam: Type.Array(Type.String()),
  coopOperatorTeam: Type.Array(Type.String()),
  farmingCycleStartDate: Type.String(),
  closedDate: Type.String(),
  ownerName: Type.String(),
  isRepopulated: Type.Boolean(),
  branchName: Type.String(),
  contract: Type.String(),
  contractName: Type.String(),
  farmCategory: Type.Enum(FarmChickCategory),
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const getFarmingCyclesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(Type.Partial(getFarmingCycleResponseItemDTO)),
});

export const dailyReportItemDTO = Type.Object({
  taskTicketId: Type.String(),
  bw: Nullable(Type.Number()),
  feed: Nullable(Type.Number()),
  feedType: Nullable(Type.String()),
  feedAdditionalInfo: Type.Optional(Nullable(Type.String())),
  dead: Nullable(Type.Number()),
  culled: Nullable(Type.Number()),
  yellowCardImages: Nullable(
    Type.Array(
      Type.Object({
        id: Type.Optional(Type.String()),
        url: Type.String(),
      }),
    ),
  ),
  feedConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        feedStockSummaryId: Type.String(),
        quantity: Type.Number({ minimum: 0 }),
      }),
    ),
  ),
  ovkConsumptions: Type.Optional(
    Type.Array(
      Type.Object({
        ovkStockSummaryId: Type.String(),
        quantity: Type.Number({ minimum: 0 }),
      }),
    ),
  ),
  summary: Type.Optional(Nullable(Type.String())),
  issues: Type.Optional(
    Type.Object({
      infrastructure: Type.Array(Type.String()),
      management: Type.Array(Type.String()),
      farmInput: Type.Array(Type.String()),
      diseases: Type.Array(Type.String()),
      forceMajeure: Type.Array(Type.String()),
      others: Nullable(Type.String()),
    }),
  ),
});

export const calculateDailyMonitoringsQueryDTO = Type.Object({
  taskTicketId: Type.Optional(Type.String()),
});

export const taskTicketJobDTO = Type.Object({
  farmingCycleId: Type.String(),
  farmingCycleStartDate: Type.String({ format: 'date' }),
  farmingCycleStatus: Type.Integer(),
  farmingCycleTaskId: Type.String(),
  taskId: Type.String(),
  taskCode: Type.String(),
  taskName: Type.String(),
  instruction: Type.String(),
  farmingCycleTaskTriggerId: Type.String(),
  triggerDay: Type.String(),
  triggerTime: Type.String(),
  triggerDate: Type.String(),
  triggerDeadline: Type.Number(),
  reportedDate: Type.String(),
  farmId: Type.String(),
  farmName: Type.String(),
  coopId: Type.String(),
  coopName: Type.String(),
  farmOwnerId: Type.String(),
  farmOwnerCode: Type.String(),
});

export const lateTaskTicketJobDTO = Type.Object({
  farmingCycleId: Type.String(),
  farmOwnerId: Type.String(),
  coopId: Type.String(),
  coopName: Type.String(),
});

export const alertJobDTO = Type.Object({
  farmingCycleId: Type.String(),
  farmingCycleStartDate: Type.String({ format: 'date' }),
  chickTypeId: Type.String(),
  coopTypeId: Type.String(),
  farmingCycleAlertId: Type.String(),
  alertId: Type.String(),
  alertCode: Type.String(),
  alertName: Type.String(),
  alertDescription: Type.String(),
  farmName: Type.String(),
  farmOwnerId: Type.String(),
  coopName: Type.String(),
});

export const requestDailyMonitoringRevisionParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  dailyReportDate: Type.String(),
});

export const requestDailyMonitoringRevisionBodyDTO = Type.Object({
  reason: Type.String(),
  changes: Type.Array(Type.String()),
});

export type DailyMonitoringVariableKey = Static<typeof dailyMonitoringVariableKey>;

export type FarmingCycleOperatorItem = Static<typeof farmingCycleOperatorItemDTO>;

export type FarmingCycleOperatorList = Static<typeof farmingCycleOperatorListDTO>;

export type FarmingCycleOperatorParams = Static<typeof farmingCycleOperatorParamsDTO>;

export type FarmingCycleByIdParams = Static<typeof farmingCycleByIdParamsDTO>;

export type FarmingCycleItem = Static<typeof farmingCycleItemDTO>;

export type FarmingCycleItemMember = Static<typeof farmingCycleItemMemberDTO>;

export type FarmingCycleItemMemberGroup = Static<typeof farmingCycleItemMemberGroupDTO>;

export type FarmingCycleByIdResponse = Static<typeof farmingCycleByIdResponseDTO>;

export type FarmingCycleOperatorResponse = Static<typeof farmingCycleOperatorResponseDTO>;

export type AssignOperatorsToFarmingCycleBody = Static<typeof assignOperatorsToFarmingCycleBodyDTO>;

export type AssignOperatorsToFarmingCycleResponse = Static<
  typeof assignOperatorsToFarmingCycleResponseDTO
>;

export type FarmingCycleSummaryParams = Static<typeof farmingCycleSummaryParamsDTO>;

export type FarmingInfoItem = Static<typeof farmingInfoItemDTO>;

export type CoopItem = Static<typeof coopItemDTO>;

export type FarmingCycleSummaryResponse = Static<typeof farmingCycleSummaryResponseDTO>;

export type FarmingCyclePplInfoParams = Static<typeof farmingCyclePplInfoParamsDTO>;

export type FarmingCyclePplInfoResponse = Static<typeof farmingCyclePplInfoResponseDTO>;

export type UserItem = Static<typeof userItemDTO>;

export type DailyReportsParam = Static<typeof dailyReportsParamDTO>;

export type DailyReportsQuery = Static<typeof dailyReportsQueryDTO>;

export type DailyReportsResponseItem = Static<typeof dailyReportsResponseItemDTO>;

export type DailyReportsResponse = Static<typeof dailyReportsResponseDTO>;

export type SubmitDailyReportParam = Static<typeof submitDailyReportParamDTO>;

export type SubmitDailyReportBody = Static<typeof submitDailyReportBodyDTO>;

export type SubmitDailyReportResponseItem = Static<typeof submitDailyReportResponseItemDTO>;

export type SubmitDailyReportResponse = Static<typeof submitDailyReportResponseDTO>;

export type GetDailyReportParam = Static<typeof getDailyReportParamDTO>;

export type GetDailyReportResponseItem = Static<typeof getDailyReportResponseItemDTO>;

export type GetDailyReportResponse = Static<typeof getDailyReportResponseDTO>;

export type DailyReportMarkAsReviewedParam = Static<typeof dailyReportMarkAsReviewedParamDTO>;

export type DailyMonitoringVariableParams = Static<typeof dailyMonitoringVariableParamsDTO>;

export type DailyMonitoringVariableResponse = Static<typeof dailyMonitoringVariableResponseDTO>;

export type GetDailyMonitoringDateParams = Static<typeof getDailyMonitoringDateParamsDTO>;

export type GetDailyMonitoringDateResponse = Static<typeof getDailyMonitoringDateResponseDTO>;

export type GetDailyMonitoringDetailParams = Static<typeof getDailyMonitoringDetailParamsDTO>;

export type DailyPerformanceMonitoringItem = Static<typeof dailyPerformanceMonitoringItemDTO>;

export type GetDailyMonitoringDetailResponse = Static<typeof getDailyMonitoringDetailResponseDTO>;

export type GetAllDailyMonitoringsParams = Static<typeof getAllDailyMonitoringsParamsDTO>;

export type GetAllDailyMonitoringsResponse = Static<typeof getAllDailyMonitoringsResponseDTO>;

export type GetFarmingCyclePerformanceParams = Static<typeof getFarmingCyclePerformanceParamsDTO>;

export type GetFarmingCyclePerformanceResponse = Static<
  typeof getFarmingCyclePerformanceResponseDTO
>;

export type UpdateDOCinPhotoItem = Static<typeof updateDOCinPhotoItemDTO>;

export type UpdateDOCinPhotoList = Static<typeof updateDOCinPhotoListDTO>;

export type UpdateDOCinPhotoItemResponse = Static<typeof updateDOCinPhotoItemResponseDTO>;

export type UpdateDOCinPhotoListResponse = Static<typeof updateDOCinPhotoListResponseDTO>;

export type UpdateDOCinBody = Static<typeof updateDOCinBodyDTO>;

export type UpdateDOCinResponseItem = Static<typeof updateDOCinResponseItemDTO>;

export type UpdateDOCinResponse = Static<typeof updateDOCinResponseDTO>;

export type UpdateDOCinParams = Static<typeof updateDOCinParamsDTO>;

export type UpdateDOCinJob = Static<typeof updateDOCinJobDTO>;

export type CreateFarmingCycleBody = Static<typeof createFarmingCycleBodyDTO>;

export type CreateFarmingCycleResponse = Static<typeof createFarmingCycleResponseDTO>;

export type CreateFarmingCycleItemResponse = Static<typeof createFarmingCycleItemResponseDTO>;

export type UpdateFarmingCycleParam = Static<typeof updateFarmingCycleParamDTO>;

export type UpdateFarmingCycleBody = Static<typeof updateFarmingCycleBodyDTO>;

export type UpdateFarmingCycleItemResponse = Static<typeof updateFarmingCycleItemResponseDTO>;

export type UpdateFarmingCycleResponse = Static<typeof updateFarmingCycleResponseDTO>;

export type GetFarmingCyclesQuery = Static<typeof getFarmingCyclesQueryDTO>;

export type GetFarmingCycleResponse = Static<typeof getFarmingCycleResponseItemDTO>;

export type GetFarmingCyclesResponse = Static<typeof getFarmingCyclesResponseDTO>;

export type DailyReportItem = Static<typeof dailyReportItemDTO>;

export type CalculateDailyMonitoringsQuery = Static<typeof calculateDailyMonitoringsQueryDTO>;

export type TaskTicketJob = Static<typeof taskTicketJobDTO>;

export type LateTaskTicketTicketJob = Static<typeof lateTaskTicketJobDTO>;

export type AlertJob = Static<typeof alertJobDTO>;

export type RequestDailyMonitoringRevisionParams = Static<
  typeof requestDailyMonitoringRevisionParamsDTO
>;

export type RequestDailyMonitoringRevisionBody = Static<
  typeof requestDailyMonitoringRevisionBodyDTO
>;
