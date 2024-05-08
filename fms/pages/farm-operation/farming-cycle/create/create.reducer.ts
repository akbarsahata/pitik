import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_COOP:
      return { ...store, coop: action.payload };
    case ACTION_TYPE.SET_OWNER_ID:
      return { ...store, ownerId: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE:
      return { ...store, chickType: action.payload };
    case ACTION_TYPE.SET_CONTRACT:
      return { ...store, contract: action.payload };
    case ACTION_TYPE.SET_BRANCH:
      return { ...store, branch: action.payload };
    case ACTION_TYPE.SET_CHICK_SUPPLIER_TYPE:
      return { ...store, chickSupplierType: action.payload };
    case ACTION_TYPE.SET_OTHER_CHICK_SUPPLIER_TYPE:
      return { ...store, otherChickSupplierType: action.payload };
    case ACTION_TYPE.SET_FARM_START_DATE:
      return { ...store, farmStartDate: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_HATCHERY:
      return { ...store, hatchery: action.payload };
    case ACTION_TYPE.SET_INITIAL_POPULATION:
      return { ...store, initialPopulation: action.payload };
    case ACTION_TYPE.SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE:
      return { ...store, isOtherChickSupplierVisible: action.payload };
    case ACTION_TYPE.SET_LEADER:
      return { ...store, leader: action.payload };
    case ACTION_TYPE.SET_WORKERS:
      return { ...store, workers: action.payload };
    case ACTION_TYPE.SET_PPLS:
      return { ...store, ppls: action.payload };
    case ACTION_TYPE.SET_DOC_IN_BW:
      return { ...store, docInBW: action.payload };
    case ACTION_TYPE.SET_DOC_IN_UNIFORMITY:
      return { ...store, docInUniformity: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE_DATA:
      return { ...store, chickTypeData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_LEADER_DATA:
      return { ...store, leaderData: action.payload };
    case ACTION_TYPE.SET_WORKER_DATA:
      return { ...store, workerData: action.payload };
    case ACTION_TYPE.SET_PPL_DATA:
      return { ...store, pplData: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
