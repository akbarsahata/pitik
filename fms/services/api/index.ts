import {
  TDailyPerformanceImageResponse,
  TInstructionResponse,
  TTriggerResponse,
} from "@type/response.type";
import axios from "axios";

const TIMEOUT = 30000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

export const postAuthUser = async (payload: {
  username: string;
  password: string;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/auth",
    data: payload,
  });
};

export const postAuthUserWithGoogle = async (credentials: string) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/auth/google",
    data: { credentials },
  });
};

export const deleteAuthSession = async () => {
  return await axios({
    method: "DELETE",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/auth",
  });
};

export const getRoles = async ({
  limit,
  name,
  level,
  context,
}: {
  limit?: number;
  name?: string;
  level?: number;
  context?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      limit,
      name,
      level,
      context,
    },
    url: `/api/roles`,
  });
};

export const getParents = async ({
  limit,
  rank,
  lte = false,
  role,
}: {
  limit?: number;
  rank: number;
  lte?: boolean;
  role?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      limit,
      rank,
      lte,
      role,
    },
    url: `/api/users-supervisor`,
  });
};

export const getUser = async (userId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/users/${userId}`,
  });
};

export const getUsers = async ({
  page,
  limit,
  userType,
  userTypes,
  name,
  email,
  userCode,
  coopName,
  phoneNumber,
  waNumber,
  ownerId,
  status,
}: {
  page: number;
  limit: number;
  userType?: string | undefined;
  userTypes?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  userCode?: string | undefined;
  coopName?: string | undefined;
  phoneNumber?: string | undefined;
  waNumber?: string | undefined;
  ownerId?: string | undefined;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      userType,
      userTypes,
      name,
      email,
      userCode,
      coopName,
      phoneNumber,
      waNumber,
      ownerId,
      status,
    },
    url: `/api/users`,
  });
};

export const postCreateUser = async (payload: {
  userType?: string;
  userCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  waNumber: string;
  password: string;
  status: boolean;
  ownerId?: string | null;
  parentId?: string | undefined;
  roleId?: string;
  roleIds?: (string | undefined)[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/users",
    data: payload,
  });
};

export const putEditUser = async (
  payload: {
    userType?: string;
    userCode: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    waNumber: string;
    password?: string;
    status: boolean;
    ownerId?: string | null;
    parentId?: string | undefined;
    roleId?: string;
    roleIds?: (string | undefined)[];
  },
  userId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/users/${userId}`,
    data: payload,
  });
};

export const getChickenStrain = async (chickenStrainId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/chicken-strains/${chickenStrainId}`,
  });
};

export const getChickenStrains = async ({
  page,
  limit,
  status,
  chickTypeName,
}: {
  page: number;
  limit: number;
  status?: boolean;
  chickTypeName?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      chickTypeName,
      status,
    },
    url: `/api/chicken-strains`,
  });
};

export const postCreateChickenStrain = async (payload: {
  chickTypeCode: string;
  chickTypeName: string;
  remarks: string;
  status: boolean;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/chicken-strains`,
  });
};

export const putEditChickenStrain = async (
  payload: {
    chickTypeCode: string;
    chickTypeName: string;
    remarks: string;
    status: boolean;
  },
  chickenStrainId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/chicken-strains/${chickenStrainId}`,
  });
};

export const getCoopType = async (coopTypeId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/coop-type/${coopTypeId}`,
  });
};

export const getCoopTypes = async ({
  page,
  limit,
  status,
  coopTypeName,
}: {
  page: number;
  limit: number;
  status?: boolean | undefined;
  coopTypeName?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      coopTypeName,
      status,
    },
    url: `/api/coop-type`,
  });
};

export const postCreateCoopType = async (payload: {
  coopTypeCode: string;
  coopTypeName: string;
  remarks: string;
  status: boolean;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/coop-type`,
  });
};

export const putEditCoopType = async (
  payload: {
    coopTypeCode: string;
    coopTypeName: string;
    remarks: string;
    status: boolean;
  },
  coopTypeId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/coop-type/${coopTypeId}`,
  });
};

export const getFarm = async (farmId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/farms/${farmId}`,
  });
};

export const getFarms = async ({
  page,
  limit,
  userOwnerId,
  farmCode,
  farmName,
  provinceId,
  cityId,
  districtId,
  branchId,
  status,
}: {
  page: number;
  limit: number;
  userOwnerId?: string;
  farmCode?: string;
  farmName?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
  branchId?: string;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      userOwnerId,
      farmCode,
      farmName,
      provinceId,
      cityId,
      districtId,
      branchId,
      status,
    },
    url: `/api/farms`,
  });
};

export const postCreateFarm = async (payload: {
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
  address2?: string;
  latitude: string;
  longitude: string;
  remarks: string;
  status: boolean;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/farms",
    data: payload,
  });
};

export const putEditFarm = async (
  payload: {
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
    address2?: string;
    latitude: string;
    longitude: string;
    remarks: string;
    status: boolean;
  },
  farmId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/farms/${farmId}`,
    data: payload,
  });
};

export const getCoop = async (coopId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/coops/${coopId}`,
  });
};

export const getCoops = async ({
  page,
  limit,
  ownerId,
  farmName,
  farmId,
  coopCode,
  contractTypeId,
  branchId,
  coopName,
  coopTypeId,
  status,
  farmingCycleStatus,
}: {
  page: number;
  limit: number;
  ownerId?: string | undefined;
  farmName?: string | undefined;
  farmId?: string | undefined;
  coopCode?: string | undefined;
  contractTypeId?: string | undefined;
  branchId?: string | undefined;
  coopName?: string | undefined;
  coopTypeId?: string | undefined;
  status?: boolean;
  farmingCycleStatus?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      ownerId,
      farmName,
      farmId,
      coopCode,
      contractTypeId,
      branchId,
      coopName,
      coopTypeId,
      status,
      farmingCycleStatus,
    },
    url: `/api/coops`,
  });
};

export const postCreateCoop = async (payload: {
  owner: string;
  farmId: string;
  coopCode: string;
  coopName: string;
  coopTypeId: string;
  contractTypeId: string;
  leaderId: string;
  workerIds: string[];
  chickTypeId: string;
  numFan: number;
  capacityFan: number;
  height: number;
  lengthData: number;
  width: number;
  maxCapacity: number;
  chickInDate: string;
  remarks: string;
  status: boolean | undefined;
  otherControllerType?: string;
  otherInletType?: string;
  otherHeaterType?: string;
  images: any[];
  userSupervisorId: string | undefined;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/coops",
    data: payload,
  });
};

export const putEditCoop = async (
  payload: {
    owner: string;
    farmId: string;
    coopCode: string;
    coopName: string;
    coopTypeId: string;
    leaderId: string;
    workerIds: string[];
    chickTypeId: string | undefined;
    contractTypeId: string;
    numFan: number;
    capacityFan: number;
    height: number;
    lengthData: number;
    width: number;
    maxCapacity: number;
    chickInDate: string;
    remarks: string;
    status: boolean | undefined;
    otherControllerType?: string;
    otherInletType?: string;
    otherHeaterType?: string;
    images: { filename: string }[];
    userSupervisorId: string | undefined;
  },
  coopId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/coops/${coopId}`,
    data: payload,
  });
};

export const getAlertPreset = async (alertPresetId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/alert-presets/${alertPresetId}`,
  });
};

export const getAlertPresets = async ({
  page,
  limit,
  alertPresetCode,
  alertPresetName,
  coopTypeId,
  status,
}: {
  page: number;
  limit: number;
  alertPresetCode?: string;
  alertPresetName?: string;
  coopTypeId?: string;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      alertPresetCode,
      alertPresetName,
      coopTypeId,
      status,
    },
    url: "/api/alert-presets",
  });
};

export const postCreateAlertPreset = async (payload: {
  alertPresetCode: string;
  alertPresetName: string;
  coopTypeId: string;
  status: boolean | undefined;
  remarks: string;
  alertIds: string[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/alert-presets",
    data: payload,
  });
};

export const putEditAlertPreset = async (
  payload: {
    alertPresetCode: string;
    alertPresetName: string;
    coopTypeId: string;
    status: boolean | undefined;
    remarks: string;
    alertIds: string[];
  },
  alertPresetsId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/alert-presets/${alertPresetsId}`,
  });
};

export const getTaskPreset = async (taskPresetId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/task-presets/${taskPresetId}`,
  });
};

export const getTaskPresets = async ({
  page,
  limit,
  taskPresetCode,
  taskPresetName,
  coopTypeId,
  status,
}: {
  page: number;
  limit: number;
  taskPresetCode?: string;
  taskPresetName?: string;
  coopTypeId?: string;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      taskPresetCode,
      taskPresetName,
      coopTypeId,
      status,
    },
    url: "/api/task-presets",
  });
};

export const postCreateTaskPreset = async (payload: {
  taskPresetCode: string;
  taskPresetName: string;
  coopTypeId: string;
  status: boolean | undefined;
  remarks: string;
  taskIds: string[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/task-presets",
    data: payload,
  });
};

export const putEditTaskPreset = async (
  payload: {
    taskPresetCode: string;
    taskPresetName: string;
    coopTypeId: string;
    status: boolean | undefined;
    remarks: string;
    taskIds: string[];
  },
  taskPresetsId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/task-presets/${taskPresetsId}`,
  });
};

export const getProvinces = async ({ name }: { name?: string }) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      name,
    },
    url: `/api/address/province`,
  });
};

export const getCities = async ({
  provinceId,
  name,
}: {
  provinceId: number;
  name?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      provinceId,
      name,
    },
    url: `/api/address/city`,
  });
};

export const getDistricts = async ({
  cityId,
  name,
}: {
  cityId: number;
  name?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      cityId,
      name,
    },
    url: `/api/address/district`,
  });
};

export const getTasks = async ({
  page,
  limit,
  taskCode,
  taskName,
  harvestOnly,
  manualTrigger,
  manualDeadline,
  status,
}: {
  page: number;
  limit: number;
  taskCode?: string;
  taskName?: string;
  harvestOnly?: boolean;
  manualTrigger?: boolean;
  manualDeadline?: boolean;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/tasks`,
    params: {
      page,
      limit,
      taskCode,
      taskName,
      harvestOnly,
      manualTrigger,
      manualDeadline,
      status,
    },
  });
};

export const getAlerts = async ({
  page,
  limit,
  alertCode,
  alertName,
  harvestOnly,
  manualTrigger,
  manualDeadline,
  status,
}: {
  page?: number;
  limit?: number;
  alertCode?: string;
  alertName?: string;
  harvestOnly?: boolean;
  manualTrigger?: boolean;
  manualDeadline?: boolean;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/alerts`,
    params: {
      page,
      limit,
      alertCode,
      alertName,
      harvestOnly,
      manualTrigger,
      manualDeadline,
      status,
    },
  });
};

export const postUploadFile = async (data: any, folder: string) => {
  return await axios({
    method: "POST",
    timeout: TIMEOUT,
    params: {
      folder,
    },
    url: "/api/upload",
    data: data,
  });
};

export const getTarget = async (targetId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/targets/${targetId}`,
  });
};

export const getTargets = async ({
  page,
  limit,
  targetCode,
  targetName,
  coopTypeId,
  chickTypeId,
  variableId,
  remarks,
  status,
}: {
  page: number;
  limit: number;
  targetCode?: string;
  targetName?: string;
  coopTypeId?: string;
  chickTypeId?: string;
  variableId?: string;
  remarks?: string;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      targetCode,
      targetName,
      coopTypeId,
      chickTypeId,
      variableId,
      remarks,
      status,
    },
    url: `/api/targets`,
  });
};

export const postCreateTarget = async (payload: {
  targetCode: string;
  targetName: string;
  coopTypeId: string;
  chickTypeId: string;
  targetDaysCount: number;
  variableId: string;
  remarks: string;
  status: boolean;
  targets?: { day: number; minValue: number; maxValue: number }[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/targets",
    data: payload,
  });
};

export const putEditTarget = async (
  payload: {
    targetCode: string;
    targetName: string;
    coopTypeId: string;
    chickTypeId: string;
    targetDaysCount: number;
    variableId: string;
    remarks: string;
    status: boolean;
    targets: any[];
  },
  targetsId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/targets/${targetsId}`,
  });
};

export const getVariable = async (variableId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/variables/${variableId}`,
  });
};

export const getVariables = async ({
  page,
  limit,
  variableCode,
  variableName,
  variableUOM,
  variableType,
  status,
}: {
  page: number;
  limit: number;
  variableCode?: string;
  variableName?: string;
  variableUOM?: string;
  variableType?: string;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      variableCode,
      variableName,
      variableUOM,
      variableType,
      status,
    },
    url: `/api/variables`,
  });
};

export const postCreateVariable = async (payload: {
  variableCode: string;
  variableName: string;
  variableUOM?: string;
  variableType: string;
  digitComa?: number;
  remarks?: string;
  status: boolean;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/variables",
    data: payload,
  });
};

export const putEditVariable = async (
  payload: {
    variableCode: string;
    variableName: string;
    variableUOM?: string;
    variableType: string;
    digitComa?: number;
    remarks?: string;
    status: boolean;
  },
  variableId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/variables/${variableId}`,
  });
};

export const getTaskLibraries = async ({
  page,
  limit,
  taskCode,
  taskName,
  harvestOnly,
  manualTrigger,
  manualDeadline,
  status,
}: {
  page: number;
  limit: number;
  taskCode?: string | undefined;
  taskName?: string | undefined;
  harvestOnly?: boolean | undefined;
  manualTrigger?: boolean | undefined;
  manualDeadline?: number | undefined;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      taskCode,
      taskName,
      harvestOnly,
      manualTrigger,
      manualDeadline,
      status,
    },
    url: `/api/task-libraries`,
  });
};

export const getFeedbrands = async ({
  page,
  limit,
  feedbrandCode,
  feedbrandName,
  status,
}: {
  page: number;
  limit: number;
  feedbrandCode?: string | undefined;
  feedbrandName?: string | undefined;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      feedbrandCode,
      feedbrandName,
      status,
    },
    url: `/api/feed-brands`,
  });
};

export const postCreateTaskLibrary = async (payload: {
  taskCode: string;
  taskName: string;
  harvestOnly: boolean;
  manualTrigger: boolean;
  manualDeadline: number;
  instruction?: string;
  status: boolean;
  remarks?: string;
  triggers?: TTriggerResponse[];
  instructions?: TInstructionResponse[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/task-libraries",
    data: payload,
  });
};

export const putEditTaskLibrary = async (
  payload: {
    taskCode: string;
    taskName: string;
    harvestOnly: boolean;
    manualTrigger: boolean;
    manualDeadline: number;
    instruction?: string;
    status: boolean;
    remarks?: string;
    triggers?: TTriggerResponse[];
    instructions?: TInstructionResponse[];
  },
  taskLibraryId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/task-libraries/${taskLibraryId}`,
    data: payload,
  });
};

export const getTaskLibrary = async (taskLibraryId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/task-libraries/${taskLibraryId}`,
  });
};

export const getDailyPerformanceSummary = async (
  dailyPerformanceId: string
) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/daily-performances/farming-cycles/${dailyPerformanceId}`,
  });
};

export const getDailyPerformanceDetails = async (
  dailyPerformanceId: string
) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/daily-performances/farming-cycles/${dailyPerformanceId}/details`,
  });
};

export const getDailyPerformances = async ({
  page,
  limit,
  farmingStatus,
  farmingCycleCode,
  ownerId,
  pplId,
  farmId,
  coopId,
  provinceId,
  cityId,
  districtId,
  branchId,
  summary,
}: {
  page: number;
  limit: number;
  farmingStatus: string | undefined;
  farmingCycleCode?: string;
  ownerId?: string;
  pplId?: string;
  farmId?: string;
  coopId?: string;
  provinceId?: number;
  cityId?: number;
  districtId?: number;
  branchId?: string;
  summary?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      farmingStatus,
      farmingCycleCode,
      ownerId,
      pplId,
      farmId,
      coopId,
      provinceId,
      cityId,
      districtId,
      branchId,
      summary,
    },
    url: `/api/daily-performances`,
  });
};

export const getBranches = async () => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/branches`,
  });
};

export const getContractTypes = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/contract-types`,
    params: {
      page,
      limit,
    },
  });
};

export const getAreas = async () => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/areas`,
  });
};

export const getFarmingCycle = async (farmingCycleId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/farming-cycles/${farmingCycleId}`,
  });
};

export const getFarmingCycles = async ({
  page,
  limit,
  farmingCycleCode,
  farmingStatus,
  coopTypeId,
  chickTypeName,
  chickTypeId,
  contract,
  branchId,
  ownerId,
  farmId,
  coopId,
  coopName,
}: {
  page: number;
  limit: number;
  farmingCycleCode?: string;
  farmingStatus?: string;
  coopTypeId?: string;
  chickTypeName?: string;
  chickTypeId?: string;
  contract?: string;
  branchId?: string;
  ownerId?: string;
  farmId?: string;
  coopId?: string;
  coopName?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      farmingCycleCode,
      farmingStatus,
      coopTypeId,
      chickTypeName,
      chickTypeId,
      contract,
      branchId,
      ownerId,
      farmId,
      coopId,
      coopName,
    },
    url: `/api/farming-cycles`,
  });
};

export const getFarmingCycleRepopulate = async (farmingCycleId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/farming-cycles/${farmingCycleId}/repopulations`,
  });
};

export const postCreateFarmingCycle = async (payload: {
  coopId: string;
  farmingCycleStartDate: string;
  chickTypeId: string;
  chickSupplier: string;
  hatchery: string;
  remarks?: string;
  contract: string;
  leaderId: string;
  workerIds: string[];
  pplIds: string[];
  initialPopulation: number;
  docInBW: number;
  docInUniformity: number;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/farming-cycles",
    data: payload,
  });
};

export const postFarmingCycleRepopulate = async (
  payload: {
    approvedAmount: number;
    repopulateDate: string;
    repopulateReason: string;
  },
  farmingCycleId: string
) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/farming-cycles/${farmingCycleId}/repopulations`,
    data: payload,
  });
};

export const putEditFarmingCycle = async (
  payload: {
    coopId: string;
    farmingCycleStartDate: string;
    chickTypeId: string;
    chickSupplier: string;
    hatchery: string;
    remarks?: string;
    contract: string;
    leaderId: string;
    workerIds: string[];
    pplIds: string[];
    initialPopulation: number;
    docInBW: number;
    docInUniformity: number;
    farmingStatus: string;
    closedDate?: string | undefined;
  },
  farmingCycleId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: payload,
    url: `/api/farming-cycles/${farmingCycleId}`,
  });
};

export const putEditDailyPerformance = async (
  payload: {
    taskTicketId: string;
    dailyPerformanceId: string;
    bw: number | undefined;
    feed: number | undefined;
    dead: number | undefined;
    culled: number | undefined;
    yellowCardImages: TDailyPerformanceImageResponse[] | undefined;
    summary: string | undefined;
    issues: {
      infrastructure: string[];
      management: string[];
      farmInput: string[];
      diseases: string[];
      forceMajeure: string[];
      others: string | null;
    };
    treatment: string[] | undefined;
  }[],
  fcId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/daily-performances/farming-cycles/${fcId}/details`,
    data: payload,
  });
};

export const getAvailableCoops = async () => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/coops/available`,
  });
};

export const getBuildings = async ({
  page,
  limit,
  farmId,
  buildingTypeId,
  ownerId,
  buildingName,
  status,
}: {
  page: number;
  limit: number;
  farmId?: string;
  buildingTypeId?: string;
  ownerId?: string;
  buildingName?: string;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      farmId,
      buildingTypeId,
      ownerId,
      buildingName,
      status,
    },
    url: "/api/buildings",
  });
};

export const getBuildingTypes = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: boolean;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      status,
    },
    url: "/api/building-types",
  });
};

export const postCreateBuilding = async (payload: {
  farmId: string;
  name: string;
  buildingTypeId: string;
  status: boolean;
  length: number;
  width: number;
  height: number;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/buildings",
    data: payload,
  });
};

export const getBuilding = async (buildingId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/buildings/${buildingId}`,
  });
};

export const putEditBuilding = async (
  payload: {
    farmId: string;
    name: string;
    buildingTypeId: string;
    status: boolean;
    length: number;
    width: number;
    height: number;
  },
  buildingId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/buildings/${buildingId}`,
    data: payload,
  });
};

export const getRooms = async ({
  page,
  limit,
  buildingId,
  status,
  farmId,
  ownerId,
  coopId,
  buildingTypeId,
  roomTypeId,
  floorTypeId,
}: {
  page: number;
  limit: number;
  buildingId?: string;
  status?: boolean;
  farmId?: string;
  ownerId?: string;
  coopId?: string;
  buildingTypeId?: string;
  roomTypeId?: string;
  floorTypeId?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      buildingId,
      status,
      farmId,
      ownerId,
      coopId,
      buildingTypeId,
      roomTypeId,
      floorTypeId,
    },
    url: "/api/rooms",
  });
};

export const getRoomTypes = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      status,
    },
    url: `/api/room-types`,
  });
};

export const getFloorTypes = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      status,
    },
    url: `/api/floor-types`,
  });
};

export const getControllerTypes = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      status,
    },
    url: `/api/controller-types`,
  });
};

export const getHeaterTypes = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      status,
    },
    url: `/api/heater-types`,
  });
};

export const postCreateRoom = async (payload: {
  population: number;
  inletWidth: number | undefined;
  inletLength: number | undefined;
  inletPosition: string | undefined;
  status: boolean;
  isCoolingPadExist: boolean;
  buildingId: string;
  roomTypeId: string;
  floorTypeId: string;
  controllerTypeId: string | undefined;
  coopId: string;
  heaterInRooms: {
    heaterTypeId: string;
    quantity: number;
  }[];
  fans: {
    size: number;
    capacity: number;
  }[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/rooms",
    data: payload,
  });
};

export const getRoom = async (roomId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/rooms/${roomId}`,
  });
};

export const putEditRoom = async (
  payload: {
    population: number;
    inletWidth: number | undefined;
    inletLength: number | undefined;
    inletPosition: string | undefined;
    status: boolean;
    isCoolingPadExist: boolean;
    buildingId: string;
    roomTypeId: string;
    floorTypeId: string;
    controllerTypeId: string | undefined;
    coopId: string;
    heaterInRooms: {
      heaterTypeId: string;
      quantity: number;
    }[];
    fans: {
      size: number;
      capacity: number;
    }[];
  },
  roomId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/rooms/${roomId}`,
    data: payload,
  });
};

export const getDeviceTypes = async ({
  page,
  limit,
  value,
  text,
}: {
  page: number;
  limit: number;
  value?: string;
  text?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      value,
      text,
    },
    url: `/api/devices-sensor/device-types`,
  });
};

export const getDevicesSensor = async ({
  page,
  limit,
  phoneNumber,
  farmId,
  buildingId,
  status,
  isOnline,
  deviceType,
  mac,
  firmWareVersion,
  coopId,
  roomId,
  deviceId,
}: {
  page: number;
  limit: number;
  phoneNumber?: string;
  farmId?: string;
  buildingId?: string;
  status?: boolean;
  deviceType?: string;
  isOnline?: boolean;
  mac?: string;
  firmWareVersion?: string;
  coopId?: string;
  roomId?: string;
  deviceId?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      phoneNumber,
      farmId,
      buildingId,
      deviceType,
      status,
      isOnline,
      mac,
      firmWareVersion,
      coopId,
      roomId,
      deviceId,
    },
    url: "/api/devices-sensor",
  });
};

export const getDeviceSensor = async (deviceId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/devices-sensor/${deviceId}`,
  });
};

export const deleteDevicesSensor = async (deviceId: string) => {
  return await axios({
    method: "DELETE",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/devices-sensor/${deviceId}`,
  });
};

export const getFirmware = async ({
  page,
  limit,
  version,
  description,
  deviceType,
}: {
  page?: number;
  limit?: number;
  version?: string;
  description?: string;
  deviceType?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      version,
      description,
      deviceType,
    },
    url: "/api/firmware",
  });
};

export const postCreateDevice = async (payload: {
  deviceType: string;
  totalFan?: number;
  totalCamera?: number;
  heaterId?: string;
  coolingPad?: boolean;
  lamp?: boolean;
  status: boolean;
  isOnline: boolean;
  deviceId: string | undefined;
  controllerTypeId: string | undefined;
  mac: string;
  farmId: string | undefined;
  buildingId: string | undefined;
  coopId: string | undefined;
  roomId: string | undefined;
  areaId?: string;
  sensors: {
    sensorType: string | null;
    sensorCode: string;
    position: string | null;
    roomId: string | null;
    status: number | undefined;
    ipCamera: string | null;
  }[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/devices-sensor",
    data: payload,
  });
};

export const postCreateFirmware = async (payload: {
  version: string;
  fileName: string;
  fileSize: string;
  description: string;
  deviceType: string;
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/firmware",
    data: payload,
  });
};

export const deleteDeleteFirmware = async (deviceId: string) => {
  return await axios({
    method: "DELETE",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/firmware/${deviceId}`,
  });
};

export const postAssignOtas = async (payload: {
  firmwareId: string;
  deviceIds: string[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/devices-sensor/assign-otas",
    data: payload,
  });
};

export const putEditDevice = async (
  payload: {
    coopCode?: string;
    farmId?: string;
    buildingId?: string;
    deviceType: string;
    totalFan?: number;
    totalCamera?: number;
    heaterId?: string;
    coolingPad?: boolean;
    controllerTypeId: string | undefined;
    lamp?: boolean;
    status: boolean;
    isOnline?: boolean;
    deviceId: string | undefined;
    mac: string;
    coopId: string | undefined;
    roomId: string | undefined;
    areaId?: string;
    sensors: {
      sensorType: string | null;
      sensorCode: string;
      position: string | null;
      roomId: string | null;
      status: number | undefined;
      ipCamera: string | null;
    }[];
    description?: string | null;
  },
  deviceId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/devices-sensor/${deviceId}`,
    data: payload,
  });
};

export const getCoopContractMitraGaransiDetail = async (branchId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/mitra-garansi/detail/${branchId}`,
  });
};

export const getContractMitraGaransi = async (contractId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/mitra-garansi/${contractId}`,
  });
};

export const postCreateContractMitraGaransi = async (payload: {
  coopId?: string;
  customize: boolean;
  refContractTypeId?: string;
  branchId: string;
  refContractParent?: string;
  effectiveStartDate: string;
  sapronak: {
    categoryCode: string;
    subcategoryCode: string;
    price: number;
    uom: string;
  }[];
  chickenPrice: {
    lowerRange: string;
    upperRange: string;
    price: number;
  }[];
  insentiveDeals: {
    lowerIp: string;
    upperIp: string;
    price: number;
  }[];
  saving: {
    precentage: number;
    minimumProfit: number;
  };
  deductionDueToFarmingCycleLoss: {
    precentage: number;
    minimumProfit: number;
  };
  contractMarketInsentive: {
    rangeIp: string;
    insentivePrecentage: number | null;
  };
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/contract/mitra-garansi",
    data: payload,
  });
};

export const putEditContractMitraGaransi = async (
  payload: {
    customize: boolean;
    coopId?: string;
    refContractTypeId?: string;
    refContractParent?: string;
    branchId: string;
    effectiveStartDate: string;
    sapronak: {
      categoryCode: string;
      subcategoryCode: string;
      price: number;
      uom: string;
    }[];
    chickenPrice: {
      lowerRange: string;
      upperRange: string;
      price: number;
    }[];
    insentiveDeals: {
      lowerIp: string;
      upperIp: string;
      price: number;
    }[];
    saving: {
      precentage: number;
      minimumProfit: number;
    };
    deductionDueToFarmingCycleLoss: {
      precentage: number;
      minimumProfit: number;
    };
    contractMarketInsentive: {
      rangeIp: string;
      insentivePrecentage: number | null;
    };
  },
  contractId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/mitra-garansi/${contractId}`,
    data: payload,
  });
};

export const getCoopContractCostPlusDetail = async (branchId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/cost-plus/detail/${branchId}`,
  });
};

export const getContractCostPlus = async (contractId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/cost-plus/${contractId}`,
  });
};

export const postCreateContractCostPlus = async (payload: {
  customize: boolean;
  refContractTypeId?: string;
  branchId: string;
  effectiveStartDate: string;
  sapronak: {
    categoryCode: string;
    subcategoryCode: string;
    price: number;
    uom: string;
  }[];
  bop: {
    preConditions: string;
    bop: number;
    amount: number;
    paymentTerm: string;
  }[];
  insentiveDeals: {
    lowerIp: string;
    upperIp: string;
    price: number;
  }[];
  contractDeductionFcBop: {
    lossDeductionProfit: number;
    lossDeductionBop: number;
  }[];
  contractMarketInsentive: {
    rangeIp: string;
    insentivePrecentage: number | null;
  };
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/contract/cost-plus",
    data: payload,
  });
};

export const putEditContractCostPlus = async (
  payload: {
    customize: boolean;
    refContractTypeId?: string;
    branchId: string;
    effectiveStartDate: string;
    sapronak: {
      categoryCode: string;
      subcategoryCode: string;
      price: number;
      uom: string;
    }[];
    bop: {
      preConditions: string;
      bop: string;
      amount: number;
      paymentTerm: string;
    }[];
    insentiveDeals: {
      lowerIp: string;
      upperIp: string;
      price: number;
    }[];
    contractDeductionFcBop: {
      lossDeductionProfit: number;
      lossDeductionBop: number;
    }[];
    contractMarketInsentive: {
      rangeIp: string;
      insentivePrecentage: number | null;
    };
  },
  contractId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/cost-plus/${contractId}`,
    data: payload,
  });
};

export const getCoopContractOwnFarmDetail = async (coopId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/own-farm/detail/${coopId}`,
  });
};

export const getContractOwnFarm = async (contractId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/own-farm/${contractId}`,
  });
};

export const postCreateContractOwnFarm = async (payload: {
  customize: boolean;
  refContractTypeId?: string;
  coopId: string;
  effectiveStartDate: string;
  bop: {
    id: string;
    preConditions: string;
    bop: string;
    amount: number;
    paymentTerm: string;
  }[];
  paymentTerms: {
    paymentTerm: string;
    amount: number;
  }[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/contract/own-farm",
    data: payload,
  });
};

export const putEditContractOwnFarm = async (
  payload: {
    customize: boolean;
    refContractTypeId?: string;
    coopId: string;
    effectiveStartDate: string;
    bop: {
      id: string;
      preConditions: string;
      bop: string;
      amount: number;
      paymentTerm: string;
    }[];
    paymentTerms: {
      paymentTerm: string;
      amount: number;
    }[];
  },
  contractId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/own-farm/${contractId}`,
    data: payload,
  });
};

export const getContract = async (contractId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/contract/${contractId}`,
  });
};

export const getContracts = async ({
  page,
  limit,
  customize,
  isParent,
  refContractTypeId,
  branchId,
  effectiveStartDate,
}: {
  page: number;
  limit: number;
  customize?: boolean;
  isParent?: boolean;
  refContractTypeId?: string | undefined;
  branchId?: string | undefined;
  effectiveStartDate?: string | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      customize,
      refContractTypeId,
      branchId,
      effectiveStartDate,
    },
    url: "/api/contract",
  });
};

export const getIotTicket = async (iotTicketId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/iot-ticketing/${iotTicketId}`,
  });
};

export const getIotTickets = async ({
  page,
  limit,
  macAddress,
  deviceId,
  farmId,
  coopId,
  branchId,
  incident,
  picId,
  status,
}: {
  page: number;
  limit: number;
  macAddress?: string | undefined;
  deviceId?: string | undefined;
  farmId?: string | undefined;
  coopId?: string | undefined;
  branchId?: string | undefined;
  incident?: string | undefined;
  picId?: string | undefined;
  status?: string | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      macAddress,
      deviceId,
      farmId,
      coopId,
      branchId,
      incident,
      picId,
      status,
    },
    url: "/api/iot-ticketing",
  });
};

export const getFarmingCycleHarvests = async ({
  page,
  limit,
  farmingCycleCode,
  farmId,
  coopId,
  branchId,
  ownerId,
  status,
}: {
  page: number;
  limit: number;
  farmingCycleCode: string;
  farmId: string;
  coopId: string;
  branchId: string;
  ownerId: string;
  status: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      farmingCycleCode,
      farmId,
      coopId,
      branchId,
      ownerId,
      status,
    },
    url: `/api/harvests/farming-cycles`,
  });
};

export const getFarmingCycleHarvestDetail = async (farmingCycleId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}`,
  });
};

export const getFarmingCycleHarvestRealizations = async (
  farmingCycleId: string
) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}/realizations`,
  });
};

//Mark harvest realization as deleted
export const deleteHarvestRealizationItem = async (
  farmingCycleId: string,
  realizationId: string
) => {
  return await axios({
    method: "DELETE",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}/realizations/${realizationId}`,
  });
};

export const postCreateRealization = async (
  payload: {
    status: "DRAFT" | "FINAL" | "DELETED";
    date: string;
    bakulName: number;
    deliveryOrder: string;
    truckLicensePlate: string;
    driver: string;
    weighingNumber: string;
    records: {
      id?: string;
      quantity: number;
      tonnage: number;
    }[];
  },
  farmingCycleId: string
) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}/realizations`,
    data: payload,
  });
};

export const getDetailHarvestRealization = async (
  farmingCycleId: string,
  realizationId: string
) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}/realizations/${realizationId}`,
  });
};

export const patchIotTicket = async (
  payload: {
    status: string;
    pic?: string;
    notes: string;
  },
  iotTicketId: string
) => {
  return await axios({
    method: "PATCH",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/iot-ticketing/${iotTicketId}`,
    data: payload,
  });
};

export const getUsersMe = async () => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/users/me",
  });
};

export const putDraftHarvestRealization = async (
  payload: {
    status: "DRAFT" | "FINAL" | "DELETED";
    date: string;
    bakulName: string;
    deliveryOrder: string;
    truckLicensePlate: string;
    driver: string;
    weighingNumber: string;
    records: {
      id?: string;
      quantity: number | null;
      tonnage: number | null;
    }[];
  },
  farmingCycleId: string,
  realizationId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/harvests/farming-cycles/${farmingCycleId}/realizations/${realizationId}`,
    data: payload,
  });
};

export const getReportDeviceOfflineTracker = async ({
  page,
  limit,
  startDate,
  endDate,
  farmId,
  coopId,
}: {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  farmId?: string;
  coopId?: string;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      startDate,
      endDate,
      farmId,
      coopId,
    },
    url: "/api/devices-sensor/offline-tracker",
  });
};

export const getReportHistoricalData = async ({
  page,
  limit,
  macAddress,
  startDate,
  endDate,
  interval,
}: {
  page: number;
  limit: number;
  macAddress: string | undefined;
  startDate: string;
  endDate: string;
  interval: number;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      macAddress,
      startDate,
      endDate,
      interval,
    },
    url: "/api/devices-sensor/historical-report",
  });
};

export const getVendor = async (vendorId: string) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/sales/vendors/${vendorId}`,
  });
};

export const getVendors = async ({
  page,
  limit,
  vendorName,
  provinceId,
  cityId,
  districtId,
  status,
}: {
  page?: number;
  limit?: number;
  vendorName?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
  status?: boolean | undefined;
}) => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    params: {
      page,
      limit,
      vendorName,
      provinceId,
      cityId,
      districtId,
      status,
    },
    url: "/api/sales/vendors",
  });
};

export const getProductCategories = async () => {
  return await axios({
    method: "GET",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/sales/product-categories",
  });
};

export const postCreateVendor = async (payload: {
  vendorName: string;
  status: boolean;
  priceBasis: string | undefined;
  plusCode: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  purchasableProducts: string[];
}) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: "/api/sales/vendors",
    data: payload,
  });
};

export const putEditVendor = async (
  payload: {
    vendorName: string;
    status: boolean;
    priceBasis: string;
    plusCode: string;
    provinceId: number;
    cityId: number;
    districtId: number;
    purchasableProducts: string[];
  },
  vendorId: string
) => {
  return await axios({
    method: "PUT",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: `/api/sales/vendors/${vendorId}`,
    data: payload,
  });
};

export const postSetAmmonia = async (macAddress: string) => {
  return await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    data: {
      macAddress,
    },
    url: "/api/devices-sensor/setAmmonia",
  });
};
