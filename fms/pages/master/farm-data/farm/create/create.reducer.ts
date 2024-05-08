import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_USER_OWNER:
      return { ...store, userOwner: action.payload };
    case ACTION_TYPE.SET_FARM_CODE:
      return { ...store, farmCode: action.payload };
    case ACTION_TYPE.SET_FARM_NAME:
      return { ...store, farmName: action.payload };
    case ACTION_TYPE.SET_BRANCH:
      return { ...store, branch: action.payload };
    case ACTION_TYPE.SET_BRANCH_DATA:
      return { ...store, branchData: action.payload };
    case ACTION_TYPE.SET_PROVINCE:
      return { ...store, province: action.payload };
    case ACTION_TYPE.SET_CITY:
      return { ...store, city: action.payload };
    case ACTION_TYPE.SET_DISTRICT:
      return { ...store, district: action.payload };
    case ACTION_TYPE.SET_ZIP_CODE:
      return { ...store, zipCode: action.payload };
    case ACTION_TYPE.SET_ADDRESS_NAME:
      return { ...store, addressName: action.payload };
    case ACTION_TYPE.SET_ADDRESS1:
      return { ...store, address1: action.payload };
    case ACTION_TYPE.SET_ADDRESS2:
      return { ...store, address2: action.payload };
    case ACTION_TYPE.SET_LATITUDE:
      return { ...store, latitude: action.payload };
    case ACTION_TYPE.SET_LONGITUDE:
      return { ...store, longitude: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_OWNER_DATA:
      return { ...store, ownerData: action.payload };
    case ACTION_TYPE.SET_PROVINCE_DATA:
      return { ...store, provinceData: action.payload };
    case ACTION_TYPE.SET_CITY_DATA:
      return { ...store, cityData: action.payload };
    case ACTION_TYPE.SET_DISTRICT_DATA:
      return { ...store, districtData: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
