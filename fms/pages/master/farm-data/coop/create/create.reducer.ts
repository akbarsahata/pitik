import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_IS_LOADING:
      return { ...store, isLoading: action.payload };
    case ACTION_TYPE.SET_COOP_CODE:
      return { ...store, coopCode: action.payload };
    case ACTION_TYPE.SET_COOP_NAME:
      return { ...store, coopName: action.payload };
    case ACTION_TYPE.SET_FARM:
      return { ...store, farm: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE:
      return { ...store, coopType: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_OWNER:
      return { ...store, owner: action.payload };
    case ACTION_TYPE.SET_LEADER:
      return { ...store, leader: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE:
      return { ...store, chickType: action.payload };
    case ACTION_TYPE.SET_CONTRACT_TYPE:
      return { ...store, contractType: action.payload };
    case ACTION_TYPE.SET_WORKERS:
      return { ...store, workers: action.payload };
    case ACTION_TYPE.SET_NUM_FAN:
      return { ...store, numFan: action.payload };
    case ACTION_TYPE.SET_CAPACITY_FAN:
      return { ...store, capacityFan: action.payload };
    case ACTION_TYPE.SET_HEIGHT:
      return { ...store, height: action.payload };
    case ACTION_TYPE.SET_LENGTH_DATA:
      return { ...store, lengthData: action.payload };
    case ACTION_TYPE.SET_WIDTH:
      return { ...store, width: action.payload };
    case ACTION_TYPE.SET_MAX_CAPACITY:
      return { ...store, maxCapacity: action.payload };
    case ACTION_TYPE.SET_CHICK_IN_DATE:
      return { ...store, chickInDate: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_IMAGES:
      return { ...store, images: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE:
      return { ...store, controllerType: action.payload };
    case ACTION_TYPE.SET_INLET_TYPE:
      return { ...store, inletType: action.payload };
    case ACTION_TYPE.SET_HEATER_TYPE:
      return { ...store, heaterType: action.payload };
    case ACTION_TYPE.SET_OTHER_CONTROLLER_TYPE:
      return { ...store, otherControllerType: action.payload };
    case ACTION_TYPE.SET_OTHER_INLET_TYPE:
      return { ...store, otherInletType: action.payload };
    case ACTION_TYPE.SET_OTHER_HEATER_TYPE:
      return { ...store, otherHeaterType: action.payload };
    case ACTION_TYPE.SET_SELECTED_IMAGES:
      return { ...store, selectedImages: action.payload };
    case ACTION_TYPE.SET_OWNER_DATA:
      return { ...store, ownerData: action.payload };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_DATA:
      return { ...store, coopTypeData: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE_DATA:
      return { ...store, chickTypeData: action.payload };
    case ACTION_TYPE.SET_CONTRACT_TYPE_DATA:
      return { ...store, contractTypeData: action.payload };
    case ACTION_TYPE.SET_LEADER_DATA:
      return { ...store, leaderData: action.payload };
    case ACTION_TYPE.SET_WORKER_DATA:
      return { ...store, workerData: action.payload };
    case ACTION_TYPE.SET_ROLE_DATA:
      return { ...store, roleData: action.payload };
    case ACTION_TYPE.SET_PARENT_DATA:
      return { ...store, parentData: action.payload };
    case ACTION_TYPE.SET_ROLE:
      return { ...store, role: action.payload };
    case ACTION_TYPE.SET_PARENT:
      return { ...store, parent: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
