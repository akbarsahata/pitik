import { IDropdownItem } from "@type/dropdown.interface";
import {
  TCityResponse,
  TDistrictResponse,
  TProductItemResponse,
  TProvinceResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  VENDOR_NAME = "VENDOR_NAME",
  PROVINCE = "PROVINCE",
  CITY = "CITY",
  DISTRICT = "DISTRICT",
  PLUS_CODE = "PLUS_CODE",
  PURCHASABLE_PRODUCTS = "PURCHASABLE_PRODUCTS",
  PRICE_BASIS = "PRICE_BASIS",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_VENDOR_NAME = "SET_VENDOR_NAME",
  SET_PROVINCE = "SET_PROVINCE",
  SET_PROVINCE_DATA = "SET_PROVINCE_DATA",
  SET_CITY = "SET_CITY",
  SET_CITY_DATA = "SET_CITY_DATA",
  SET_DISTRICT = "SET_DISTRICT",
  SET_DISTRICT_DATA = "SET_DISTRICT_DATA",
  SET_PLUS_CODE = "SET_PLUS_CODE",
  SET_PURCHASABLE_PRODUCTS = "SET_PURCHASABLE_PRODUCTS",
  SET_PURCHASABLE_PRODUCTS_DATA = "SET_PURCHASABLE_PRODUCTS_DATA",
  SET_PRICE_BASIS = "SET_PRICE_BASIS",
  SET_STATUS = "SET_STATUS",
  SET_CONFIRMATION_MODAL_VISIBLE = "SET_CONFIRMATION_MODAL_VISIBLE",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  vendorName: string;
  province: IDropdownItem<TProvinceResponse> | null;
  city: IDropdownItem<TCityResponse> | null;
  district: IDropdownItem<TDistrictResponse> | null;
  plusCode: string;
  purchasableProducts: IDropdownItem<TProductItemResponse>[] | null;
  priceBasis: IDropdownItem<string> | null;
  status: IDropdownItem<boolean> | null;
  confirmationModalVisible: boolean;

  provinceData: TProvinceResponse[];
  cityData: TCityResponse[];
  districtData: TDistrictResponse[];
  purchasableProductsData: TProductItemResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  vendorName: "",
  province: null,
  city: null,
  district: null,
  plusCode: "",
  priceBasis: null,
  purchasableProducts: null,
  status: null,
  confirmationModalVisible: false,

  provinceData: [],
  cityData: [],
  districtData: [],
  purchasableProductsData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_VENDOR_NAME; payload: typeof store.vendorName }
  | { type: ACTION_TYPE.SET_PROVINCE; payload: typeof store.province }
  | { type: ACTION_TYPE.SET_PROVINCE_DATA; payload: typeof store.provinceData }
  | { type: ACTION_TYPE.SET_CITY; payload: typeof store.city }
  | { type: ACTION_TYPE.SET_CITY_DATA; payload: typeof store.cityData }
  | { type: ACTION_TYPE.SET_DISTRICT; payload: typeof store.district }
  | { type: ACTION_TYPE.SET_DISTRICT_DATA; payload: typeof store.districtData }
  | { type: ACTION_TYPE.SET_PLUS_CODE; payload: typeof store.plusCode }
  | {
      type: ACTION_TYPE.SET_PURCHASABLE_PRODUCTS;
      payload: typeof store.purchasableProducts;
    }
  | {
      type: ACTION_TYPE.SET_PURCHASABLE_PRODUCTS_DATA;
      payload: typeof store.purchasableProductsData;
    }
  | { type: ACTION_TYPE.SET_PRICE_BASIS; payload: typeof store.priceBasis }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | {
      type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE;
      payload: typeof store.confirmationModalVisible;
    };
