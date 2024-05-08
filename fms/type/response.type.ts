export type TGetByIdResponse<T> = {
  code: number;
  data: T;
};

export type TGetManyResponse<T> = {
  code: number;
  count: number;
  data: T;
};

export type TUserResponse = {
  id: string;
  userType: string;
  userCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  waNumber: string;
  status: boolean;
  ownerId: string | null;
  parentId?: string;
  roleId: string;
  roles: TRoleResponse[];
};

export type TRoleResponse = {
  id: string;
  name: string;
  level: number;
  roleRanks: {
    rank: number;
    context: string;
  };
};

export type TParentResponse = {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  roleId: string;
  parentId: string | null;
  idCms: string;
};

export type TChickenStrainResponse = {
  id: string;
  chickTypeCode: string;
  chickTypeName: string;
  remarks: string | null;
  status: boolean;
};

export type TVariableResponse = {
  id: string;
  variableCode: string;
  variableName: string;
  variableUOM: string;
  variableType: string;
  variableFormula: string;
  digitComa: number;
  status: boolean;
  remarks: string;
};

export type TCoopTypeResponse = {
  id: string;
  coopTypeCode: string;
  coopTypeName: string;
  remarks: string;
  status: boolean;
};

export type TTaskPresetResponse = {
  id: string;
  taskPresetCode: string;
  taskPresetName: string;
  presetType: string;
  status: boolean;
  remarks: string;
  coopType: TCoopTypeResponse;
  tasks: TTaskResponse[];
};

export type TAlertPresetResponse = {
  id: string;
  alertPresetCode: string;
  alertPresetName: string;
  presetType: string;
  status: boolean;
  remarks: string;
  coopType: TCoopTypeResponse;
  coopTypeId: string;
  alerts: TAlertResponse[];
};

export type TTaskResponse = {
  id: string;
  taskCode: string;
  taskName: string;
  harvestOnly: boolean;
  manualTrigger: boolean;
  manualDeadline: number;
  instruction: "";
  status: boolean;
  remarks: string;
};

export type TAlertResponse = {
  id: string;
  alertCode: string;
  alertName: string;
  alertDescription: string;
  eligibleManual: boolean;
  status: boolean;
  remarks: string;
};

export type TFarmResponse = {
  id: string;
  userOwnerId: string;
  farmCode: string;
  farmName: string;
  branchId: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  zipCode: string;
  addressName: string;
  address1: string;
  address2: string;
  latitude: string;
  longitude: string;
  remarks: string;
  status: boolean;
  provinceName: string;
  cityName: string;
  districtName: string;
  ownerName: string;
  owner?: TUserResponse;
};

export type TProvinceResponse = {
  id: number;
  provinceName: string;
  name: string;
};

export type TCityResponse = {
  id: number;
  provinceId: number;
  cityName: string;
  name: string;
};

export type TDistrictResponse = {
  id: number;
  districtName: string;
  cityId: number;
  name: string;
};

export type TTriggerResponse = {
  id: string;
  day: number;
  triggerTime: string;
  deadline: number;
};

export type TTaskLibraryResponse = {
  id: string;
  taskCode: string;
  taskName: string;
  harvestOnly: boolean;
  manualTrigger: boolean;
  manualDeadline: number;
  instruction: string;
  status: boolean;
  remarks: string;
  triggers: TTriggerResponse[];
  instructions: TInstructionResponse[];
};

export type TFeedBrandResponse = {
  id: string;
  feedbrandCode: string;
  feedbrandName: string;
  status: boolean;
  remarks: string;
};

export type TInstructionResponse = {
  id?: string;
  instructionTitle: string;
  dataRequired: 0 | 1 | 2 | undefined;
  dataInstruction?: string;
  dataType?: string;
  dataOption?: string;
  variableId?: string;
  variable?: TVariableResponse;
  feedbrand?: TFeedBrandResponse;
  feedbrandId?: string;
  harvestQty: 0 | 1 | 2 | undefined;
  dataOperator?: string;
  photoRequired: 0 | 1 | 2 | undefined;
  photoInstruction?: string;
  videoRequired: 0 | 1 | 2 | undefined;
  videoInstruction?: string;
  needAdditionalDetail: boolean | undefined;
  additionalDetail?: string;
  checkDataCorrectness: boolean | undefined;
};

export type TTargetLibraryResponse = {
  id: string;
  targetCode: string;
  targetName: string;
  targetDaysCount: number;
  status: boolean;
  remarks: string;
  coopType: TCoopTypeResponse;
  chickType: TChickenStrainResponse;
  variable: TVariableResponse;
  targetDays: TTargetDayResponse[];
};

export type TTargetDayResponse = {
  id: string;
  day: number;
  minValue: number;
  maxValue: number;
};

export type TFarmingCycleResponse = {
  farmingCycleId: string;
  farmingCycleCode: string;
  farmingStatus: string;
  coopName: string;
  coopTypeName: string;
  initialPopulation: number;
  productionTeam: string[];
  coopOperatorTeam: string[];
  farmingCycleStartDate: string;
  closedDate: string;
  contract: string;
  contractName: string;
  docInBW: number;
  docInUniformity: number;
};

// NOTE: The response type of GET farming-cycle/:id is so different
// than the others
export type TFarmingCycleByIdResponse = {
  id: string;
  branch: TBranchResponse;
  chickInDate: string;
  chickSupplier: string;
  chickTypeId: string;
  closedDate: string;
  contract: TContractResponse;
  contractType: TContractTypeResponse;
  coop: TCoopResponse;
  coopId: string;
  cycleStatus: boolean;
  docInBW: number;
  docInUniformity: number;
  farm: TFarmResponse;
  farmId: string;
  farmingCycleCode: string;
  farmingCycleId: string;
  farmingCycleStartDate: string;
  farmingStatus: string;
  feedBrandId: string;
  hatchery: string;
  initialFeedStock: number;
  initialPopulation: number;
  isRepopulated: boolean;
  leaders: {
    memberId: string;
    name: string;
    userId: string;
    userType: string;
  }[];
  ppls: {
    memberId: string;
    name: string;
    userId: string;
    userType: string;
  }[];
  productionTeam: TUserResponse[];
  remarks: string;
  userPplId: string;
  workers: {
    memberId: string;
    name: string;
    userId: string;
    userType: string;
  }[];
};

export type TCoopResponse = {
  id: string;
  branch: TBranchResponse;
  contractType: TContractTypeResponse;
  contract: TContractResponse;
  coopCode: string;
  coopName: string;
  farmId: string;
  coopTypeId: string;
  chickTypeId: string;
  chickType: TChickenStrainResponse;
  chickInDate: string;
  numFan: number;
  capacityFan: number;
  height: number;
  length: number;
  width: number;
  maxCapacity: number;
  remarks: string;
  status: boolean;
  coopType: TCoopTypeResponse;
  otherControllerType: string;
  otherInletType: string;
  otherHeaterType: string;
  farm: TFarmResponse;
  leader: TUserResponse;
  workers: TUserResponse[];
  coopImages: [];
  roleId: string;
  userSupervisorId: string;
  userSupervisorRoleId: string;
  ownerId?: string;
  branchId: string;
  branchName: string;
  contractTypeId: string;
  contractId: string | null;
  contractName: string;
};

export type TSapronakResponse = {
  categoryCode: string;
  subcategoryCode: string;
  price: number;
  uom: string;
  refContractId: string;
};

export type TMarginCostPlusBopResponse = {
  id: string;
  bop: string;
  amount: number;
  paymentTerm: string;
  preConditions: string;
  refContractId: string;
};

export type TInsentiveDealsResponse = {
  lowerIp: string;
  upperIp: string;
  price: number;
  uom: string;
  refContractId: string;
};

export type TDeductionDueToFarmingCycleLoss = {
  id: string;
  precentage: number;
  minimumProfit: number;
  uom: string;
  refContractId: string;
};

export type TDeductionFcBopResponse = {
  id?: string;
  bop: string;
  lossDeductionProfit: number;
  lossDeductionBop: number;
  uomLoss: string;
  uomBop: string;
};

export type TMarketIncentiveResponse = {
  rangeIp: string;
  insentivePrecentage: 2;
  refContractId: string;
};

export type TPaymentTermsResponse = {
  paymentTerm: string;
  amount: number;
  uom: string;
  refContractId: string;
};

export type TChickenPriceResponse = {
  id: string;
  lowerRange: string;
  upperRange: string;
  price: number;
  uom: string;
  refContractId: string;
};

export type TContractResponse = {
  id: string;
  code: string;
  refContractTypeId: string;
  customize: boolean;
  isParent: boolean;
  effectiveStartDate: string;
  branchId: string;
  branch: TBranchResponse;
  sapronak: TSapronakResponse[];
  bop: TMarginCostPlusBopResponse[];
  chickenPrice: TChickenPriceResponse[];
  insentiveDeals: TInsentiveDealsResponse[];
  contractMarketInsentive: TMarketIncentiveResponse;
  contractDeductionFcBop: TDeductionFcBopResponse[];
  deductionDueToFarmingCycleLoss: TDeductionDueToFarmingCycleLoss;
  contractType: TContractTypeResponse;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  coopId: string;
  paymentTerms: TPaymentTermsResponse[];
  saving: TDeductionDueToFarmingCycleLoss;
};

export type TDailyPerformanceDaySummaryResponse = {
  id: string;
  dailyIssue: string;
  summary: string;
  day: number;
};

export type TDailyPerformanceTableResponse = {
  id: string;
  farmingCycleCode: string;
  chickInDate: string;
  farmingCycleStartDate: string;
  initialPopulation: number;
  initialFeedStock: number;
  chickSupplier: string;
  hatchery: string;
  cycleStatus: true;
  farmingStatus: string;
  age: number;
  remarks: string;
  farm: TFarmResponse;
  coop: TCoopResponse;
  userPpl: TUserResponse;
  summary: TDailyPerformanceDaySummaryResponse | null;
};

export type TBranchResponse = {
  id: string;
  code: string;
  name: string;
  areaId: string;
  isActive: boolean;
  area: TAreaResponse;
};

export type TContractTypeResponse = {
  id: string;
  contractName: string;
  status: string;
};

export type TFileUploadResponse = {
  id: string;
  filename: string;
};

export type TDailyPerformanceSummaryResponse = {
  farm: {
    owner: string;
    coop: {
      name: string;
      type: string;
      contractType: string | null;
      mm: {
        id: string;
        userCode: string;
        fullName: string;
      } | null;
      ppl: TUserResponse[];
      branch: {
        name: string | null;
        province: {
          name: string;
        };
        city: {
          name: string;
        };
        district: {
          name: string;
        };
      };
    };
  };
  doc: {
    supplier: string | null;
    hatchery: string | null;
    uniformity: number | null;
    bw: number | null;
    arrivalTime: string | null;
    recordingTime: string | null;
    summary: string | null;
  };
  feed: {
    prestarter: string;
    starter: string;
    finisher: string;
  };
  issues: {
    date: string | null;
    infrastructure: string[] | null;
    management: string[] | null;
    farmInput: string[] | null;
    diseases: string[] | null;
    forceMajeure: string[] | null;
    others: string[] | null;
  };
  performance: {
    age: number | null;
    population: {
      initial: number | null;
      current: number | null;
    };
    bw: {
      actual: number | null;
      standard: number | null;
    };
    mortality: {
      actual: number | null;
      standard: number | null;
    };
    fcr: {
      actual: number | null;
      standard: number | null;
    };
    ip: {
      actual: number | null;
      standard: number | null;
    };
    bwDayEight: number | null;
  };
};

export type TDailyPerformanceImageResponse = {
  id: string;
  url: string;
};

export type TDailyPerformanceDetailsResponse = {
  taskTicketId: string | undefined;
  dailyPerformanceId: string | null;
  id?: string | undefined;
  date: string | null;
  day: number | undefined;
  status: string | null;
  yellowCardImages: TDailyPerformanceImageResponse[] | null;
  feed: number | null;
  ovk: string[] | null;
  dead: number | null;
  culled: number | null;
  summary: string;
  bw: {
    actual: number | null;
    standard: number | null;
  };
  adg: {
    actual: number | null;
    standard: number | null;
  };
  growth: {
    actual: number | null;
    standard: number | null;
  };
  mortality: {
    actual: number | null;
    standard: number | null;
  };
  mortalityCummulative: {
    actual: number | null;
    standard: number | null;
  };
  population: {
    total: number | null;
    remaining: number | null;
    harvested: number | null;
    dailyHarvest: number | null;
    dead: number | null;
  };
  feedIntake: {
    actual: number | null;
    standard: number | null;
  };
  feedConsumption: {
    actual: number | null;
    standard: number | null;
  };
  fcr: {
    actual: number | null;
    standard: number | null;
  };
  ip: {
    actual: number | null;
    standard: number | null;
  };
  issues: {
    infrastructure: string[];
    management: string[];
    farmInput: string[];
    diseases: string[];
    forceMajeure: string[];
    others: string | null;
  };
  treatment: string[];
};

export type TBuildingTypeResponse = {
  id: string;
  name: string;
  isActive: boolean;
};

export type TBuildingResponse = {
  id: string;
  name: string;
  isActive: boolean;
  length: number;
  width: number;
  height: number;
  farmId: string;
  buildingTypeId: string;
  farm: TFarmResponse;
  buildingType: TBuildingTypeResponse;
};

export type TRoomTypeResponse = {
  id: string;
  name: string;
  isActive: boolean;
};

export type TFloorTypeResponse = {
  id: string;
  name: string;
  isActive: boolean;
};

export type TControllerTypeResponse = {
  id: string;
  name: string;
  isActive: boolean;
};

export type THeaterTypeResponse = {
  id: string;
  name: string;
  isActive: boolean;
};

export type TFanResponse = {
  id: string;
  size: number | null;
  capacity: number | null;
};

export type THeaterInRoomsResponse = {
  roomId: string;
  heaterTypeId: string;
  quantity: number;
  heaterType: THeaterTypeResponse;
};

export type TRoomResponse = {
  id: string;
  roomCode: string;
  population: number;
  inletWidth: number;
  inletLength: number;
  inletPosition: string;
  isActive: boolean;
  isCoolingPadExist: boolean;
  buildingId: string;
  roomTypeId: string;
  floorTypeId: string;
  controllerTypeId: string;
  coopId: string;
  building: TBuildingResponse;
  roomType: TRoomTypeResponse;
  floorType: TFloorTypeResponse;
  controllerType: TControllerTypeResponse;
  coop: TCoopResponse;
  heaterInRooms: THeaterInRoomsResponse[];
  fans: TFanResponse[];
};

export type TFarmingCycleRepopulateResponse = {
  id: string;
  approvedAmount: number;
  repopulateDate: string;
  repopulateDay: number;
  repopulateReason: string;
  newFarmingCycleStartDate: string;
  newInitialPopulation: number;
  initialPopulation: number;
};

export type TAreaResponse = {
  id: string;
  code: string;
  name: number;
  isActive: boolean;
};

export type TSensorResponse = {
  id: string;
  sensorCode: string;
  sensorType: string;
  position: string;
  status: number;
  additional: Record<string, unknown> | null;
  roomId: string;
  room: TRoomResponse;
  ipCamera: string;
};

export type TDevicesSensorResponse = {
  id: string;
  deviceType: string;
  controllerType: string;
  phoneNumber: string;
  registrationDate: string;
  status: boolean;
  isOnline: boolean;
  mac: string;
  firmWareVersion: string;
  sensors: TSensorResponse[];
  coopId: string;
  roomId: string;
  deviceId: string;
  area: TAreaResponse;
  coop: TCoopResponse;
  room: TRoomResponse;
  errors: [];
  totalFan: number;
  heaterId: string;
  coolingPad: boolean;
  lamp: boolean;
};

export type TFirmwareSensorResponse = {
  id: string;
  version: string;
  fileName: string;
  fileSize: number;
  deviceType: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
};

export type TDeviceTypeResponse = {
  text: string;
  value: string;
};

export type TContractBranchDetail = {
  id: string;
  coopName: string;
  startDate: string;
  contractType: string;
};

export type TRealizationRecord = {
  id?: string;
  quantity: number | null;
  tonnage: number | null;
};

export type THarvest = {
  count: number;
  latestHarvestDate: string;
  total: TRealizationRecord;
};

export type TFarmingCycleMember = {
  id: string;
  name: string;
  userType: "ppl" | "owner";
};

export type TFarmingCycleHarvestItem = {
  id: string;
  farmingCycleCode: string;
  initialPopulation: number;
  status: string;
  farm: {
    id: string;
    name: string;
  };
  coop: {
    id: string;
    name: string;
  };
  members: TFarmingCycleMember[];
  harvest: THarvest;
};

export type TFarmingCycleHarvestTableResponse = {
  farmingCycles: TFarmingCycleHarvestItem[];
};

export type THarvestDetailResponse = {
  id: string;
  farmingCycleCode: string;
  initialPopulation: number;
  status: "NEW" | "IN_PROGRESS" | "PENDING" | "CLOSED";
  farm: {
    id: string;
    name: string;
    branch: {
      id: string;
      name: string;
    };
  };
  coop: {
    id: string;
    name: string;
  };
  members: TFarmingCycleMember[];
  harvest: THarvest;
};

export type TRealizationInFarmingCycleItem = {
  harvestNo?: number;
  id: string;
  date: string;
  bakulName: string;
  deliveryOrder: string;
  weighingNumber: string;
  status: "DRAFT" | "FINAL" | "DELETED";
  total: TRealizationRecord;
};

export type TRealizationsInFarmingCycleResponse = {
  realizations: TRealizationInFarmingCycleItem[];
};

export type THarvestRealizationDetailResponse = {
  id: string;
  date: string;
  bakulName: string;
  deliveryOrder: string;
  truckLicensePlate: string;
  driver: string;
  weighingNumber: string;
  status: "DRAFT" | "FINAL" | "DELETED";
  createdDate: string;
  total: TRealizationRecord;
  records: TRealizationRecord[];
};

export type TReportDeviceOfflineTrackertResponse = {
  no: number;
  id: string;
  totalOfflineCount: number;
  totalOfflineTime: string;
  status: boolean;
  isOnline: boolean;
  mac: string;
  firmWareVersion: string;
  coopCode: string;
  deviceId: string;
  coopId: string;
  roomId: string;
  farmId: string;
  coop: TCoopResponse;
  room: TRoomResponse;
  createdDate: string;
  modifiedDate: string;
};

export type TReportHistoricalData = {
  time: string;
  temperature: Record<string, number | null>;
  humidity: Record<string, number | null>;
  lamp: Record<string, number | null>;
  ammonia: Record<string, number | null>;
  windSpeed: Record<string, number | null>;
};

export type TReportHistoricalDataAll = {
  time: string;
  all: Record<string, number | null>;
};

export type TIotTicketDeviceStatusResponse = {
  open: number;
  onMaintenance: number;
  resolved: number;
  others: number;
};

export type TIotTicketDataResponse = {
  id: string;
  status: string;
  refDeviceId: string;
  refUserId: string;
  createdOn: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  macAddress: string;
  deviceId: string;
  coopCode: string;
  farmName: string;
  branchName: string;
  incident: string;
  pic: string;
  action: string;
};

export type TIotTicketHistoryResponse = {
  id: string;
  actionStatus: string;
  refTicketingId: string;
  notes: string;
  timeAction: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
};

export type TIotTicketDetailsResponse = {
  id: string;
  status: string;
  refDeviceId: string;
  refUserId: string;
  createdOn: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  macAddress: string;
  deviceId: string;
  coopCode: string;
  farmName: string;
  branchName: string;
  incident: string;
  pic: string;
  action: string;
  notes: string;
  history: TIotTicketHistoryResponse[];
};

export type TProductItemResponse = {
  id: string;
  name: string;
};

export type TVendorResponse = {
  id: string;
  vendorName: string;
  provinceId: number;
  province: TProvinceResponse;
  cityId: number;
  city: TCityResponse;
  districtId: number;
  district: TDistrictResponse;
  plusCode: string;
  priceBasis: string;
  status: boolean;
  purchasableProducts: TProductItemResponse[];
};
