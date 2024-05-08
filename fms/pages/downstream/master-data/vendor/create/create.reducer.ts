import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_VENDOR_NAME:
      return { ...store, vendorName: action.payload };
    case ACTION_TYPE.SET_PROVINCE:
      return { ...store, province: action.payload };
    case ACTION_TYPE.SET_PROVINCE_DATA:
      return { ...store, provinceData: action.payload };
    case ACTION_TYPE.SET_CITY:
      return { ...store, city: action.payload };
    case ACTION_TYPE.SET_CITY_DATA:
      return { ...store, cityData: action.payload };
    case ACTION_TYPE.SET_DISTRICT:
      return { ...store, district: action.payload };
    case ACTION_TYPE.SET_DISTRICT_DATA:
      return { ...store, districtData: action.payload };
    case ACTION_TYPE.SET_PLUS_CODE:
      return { ...store, plusCode: action.payload };
    case ACTION_TYPE.SET_PURCHASABLE_PRODUCTS:
      return { ...store, purchasableProducts: action.payload };
    case ACTION_TYPE.SET_PURCHASABLE_PRODUCTS_DATA:
      return { ...store, purchasableProductsData: action.payload };
    case ACTION_TYPE.SET_PRICE_BASIS:
      return { ...store, priceBasis: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE:
      return { ...store, confirmationModalVisible: action.payload };
  }
}
