import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCityResponse,
  TDistrictResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  USER_OWNER = "USER_OWNER",
  FARM_CODE = "FARM_CODE",
  FARM_NAME = "FARM_NAME",
  BRANCH = "BRANCH",
  PROVINCE = "PROVINCE",
  CITY = "CITY",
  DISTRICT = "DISTRICT",
  ZIP_CODE = "ZIP_CODE",
  ADDRESS_NAME = "ADDRESS_NAME",
  ADDRESS1 = "ADDRESS1",
  LATITUDE = "LATITUDE",
  LONGITUDE = "LONGITUDE",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_USER_OWNER = "SET_USER_OWNER",
  SET_FARM_CODE = "SET_FARM_CODE",
  SET_FARM_NAME = "SET_FARM_NAME",
  SET_BRANCH = "SET_BRANCH",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_PROVINCE = "SET_PROVINCE",
  SET_CITY = "SET_CITY",
  SET_DISTRICT = "SET_DISTRICT",
  SET_ZIP_CODE = "SET_ZIP_CODE",
  SET_ADDRESS_NAME = "SET_ADDRESS_NAME",
  SET_ADDRESS1 = "SET_ADDRESS1",
  SET_ADDRESS2 = "SET_ADDRESS2",
  SET_LATITUDE = "SET_LATITUDE",
  SET_LONGITUDE = "SET_LONGITUDE",
  SET_REMARKS = "SET_REMARKS",
  SET_STATUS = "SET_STATUS",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_PROVINCE_DATA = "SET_PROVINCE_DATA",
  SET_CITY_DATA = "SET_CITY_DATA",
  SET_DISTRICT_DATA = "SET_DISTRICT_DATA",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  userOwner: IDropdownItem<TUserResponse> | null;
  farmCode: string;
  farmName: string;
  branch: IDropdownItem<TBranchResponse> | null;
  province: IDropdownItem<TProvinceResponse> | null;
  city: IDropdownItem<TCityResponse> | null;
  district: IDropdownItem<TDistrictResponse> | null;
  zipCode: string;
  addressName: string;
  address1: string;
  address2?: string;
  latitude: string;
  longitude: string;
  remarks?: string;
  status: IDropdownItem<boolean> | null;
  ownerData: TUserResponse[];
  branchData: TBranchResponse[];
  provinceData: TProvinceResponse[];
  cityData: TCityResponse[];
  districtData: TDistrictResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  userOwner: null,
  farmCode: "",
  farmName: "",
  branch: null,
  province: null,
  city: null,
  district: null,
  zipCode: "",
  addressName: "",
  address1: "",
  address2: "",
  latitude: "",
  longitude: "",
  remarks: "",
  status: null,
  ownerData: [],
  branchData: [],
  provinceData: [],
  cityData: [],
  districtData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_USER_OWNER; payload: typeof store.userOwner }
  | { type: ACTION_TYPE.SET_FARM_CODE; payload: typeof store.farmCode }
  | { type: ACTION_TYPE.SET_FARM_NAME; payload: typeof store.farmName }
  | { type: ACTION_TYPE.SET_BRANCH; payload: typeof store.branch }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | { type: ACTION_TYPE.SET_PROVINCE; payload: typeof store.province }
  | { type: ACTION_TYPE.SET_CITY; payload: typeof store.city }
  | { type: ACTION_TYPE.SET_DISTRICT; payload: typeof store.district }
  | { type: ACTION_TYPE.SET_ZIP_CODE; payload: typeof store.zipCode }
  | { type: ACTION_TYPE.SET_ADDRESS_NAME; payload: typeof store.addressName }
  | { type: ACTION_TYPE.SET_ADDRESS1; payload: typeof store.address1 }
  | { type: ACTION_TYPE.SET_ADDRESS2; payload: typeof store.address2 }
  | { type: ACTION_TYPE.SET_LATITUDE; payload: typeof store.latitude }
  | { type: ACTION_TYPE.SET_LONGITUDE; payload: typeof store.longitude }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | { type: ACTION_TYPE.SET_PROVINCE_DATA; payload: typeof store.provinceData }
  | { type: ACTION_TYPE.SET_CITY_DATA; payload: typeof store.cityData }
  | {
      type: ACTION_TYPE.SET_DISTRICT_DATA;
      payload: typeof store.districtData;
    };
