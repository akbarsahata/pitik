import { PO_PRICE } from "@constants/index";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TProductItemResponse, TVendorResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setVendorInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TVendorResponse;
  state: TStore;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.vendorName,
  });

  dispatch({
    type: ACTION_TYPE.SET_VENDOR_NAME,
    payload: data.vendorName,
  });

  const province =
    state.provinceData[
      state.provinceData.findIndex((item) => item.id === data.provinceId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_PROVINCE,
    payload: province
      ? {
          value: province,
          label: province.provinceName,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_TEMP,
    payload: {
      cityId: data.cityId,
      districtId: data.districtId,
    },
  });

  dispatch({
    type: ACTION_TYPE.SET_PLUS_CODE,
    payload: data.plusCode,
  });

  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: { label: data.status ? "Active" : "Inactive", value: data.status },
  });

  const poPrice = PO_PRICE.find((item) => item === data.priceBasis);
  dispatch({
    type: ACTION_TYPE.SET_PRICE_BASIS,
    payload: poPrice ? { label: poPrice, value: poPrice } : null,
  });

  const purchasableProducts = data.purchasableProducts.map((item) => {
    const product = state.purchasableProductsData.find(
      (product) => product.id === item.id
    );
    return {
      label: product?.name,
      value: product,
    };
  });
  dispatch({
    type: ACTION_TYPE.SET_PURCHASABLE_PRODUCTS,
    payload: purchasableProducts as IDropdownItem<TProductItemResponse>[],
  });
};

export const setErrorText = ({
  dispatch,
  error,
}: {
  dispatch: Dispatch<ACTIONS>;
  error: any;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_ERROR_TYPE,
    payload: ERROR_TYPE.GENERAL,
  });
  dispatch({
    type: ACTION_TYPE.SET_ERROR_TEXT,
    payload: `(${error.response.data.code || "500"}) ${
      error.response.data.data?.error?.message ||
      error.response.data.error?.message ||
      error.response.data?.message ||
      "Failed to perform request"
    }`,
  });
};

export const checkRequired = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (isEmptyString(state.vendorName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.VENDOR_NAME,
    });
    return false;
  }
  if (state.province === null || state.province?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PROVINCE,
    });
    return false;
  }
  if (state.city === null || state.city?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CITY,
    });
    return false;
  }
  if (state.district === null || state.district?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DISTRICT,
    });
    return false;
  }
  if (state.plusCode === null || isEmptyString(state.plusCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PLUS_CODE,
    });
    return false;
  }
  if (
    state.purchasableProducts === null ||
    state.purchasableProducts.length === 0
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PURCHASABLE_PRODUCTS,
    });
    return false;
  }
  if (state.priceBasis === null || state.priceBasis?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PRICE_BASIS,
    });
    return false;
  }
  if (state.status === null || state.status?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.STATUS,
    });
    return false;
  }

  return true;
};
