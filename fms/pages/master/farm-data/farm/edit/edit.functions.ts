import { isEmptyString } from "@services/utils/string";
import { TFarmResponse, TUserResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setFarmInitialData = ({
  dispatch,
  data,
  ownerData,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TFarmResponse;
  ownerData: TUserResponse[];
  state: TStore;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.farmName,
  });
  dispatch({
    type: ACTION_TYPE.SET_FARM_CODE,
    payload: data.farmCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_FARM_NAME,
    payload: data.farmName,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      value: data.status,
      label: data.status ? "Active" : "Inactive",
    },
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
    type: ACTION_TYPE.SET_ZIP_CODE,
    payload: data.zipCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_ADDRESS_NAME,
    payload: data.addressName,
  });
  dispatch({
    type: ACTION_TYPE.SET_ADDRESS1,
    payload: data.address1,
  });
  dispatch({
    type: ACTION_TYPE.SET_ADDRESS2,
    payload: data.address2,
  });
  dispatch({
    type: ACTION_TYPE.SET_LATITUDE,
    payload: data.latitude,
  });
  dispatch({
    type: ACTION_TYPE.SET_LONGITUDE,
    payload: data.longitude,
  });
  dispatch({
    type: ACTION_TYPE.SET_REMARKS,
    payload: data.remarks,
  });

  const owner =
    ownerData[ownerData.findIndex((item) => item.id === data.userOwnerId)];

  dispatch({
    type: ACTION_TYPE.SET_USER_OWNER,
    payload: owner
      ? {
          value: owner,
          label: `(${owner?.userCode}) ${owner?.fullName}`,
        }
      : null,
  });

  const branch =
    state.branchData[
      state.branchData.findIndex((item) => item.id === data.branchId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_BRANCH,
    payload: branch
      ? {
          value: branch,
          label: `(${branch?.code}) ${branch?.name}`,
        }
      : null,
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
  if (state.branch === null || isEmptyString(state.branch?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BRANCH,
    });
    return false;
  }

  if (state.userOwner === null || isEmptyString(state.userOwner?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.USER_OWNER,
    });
    return false;
  }

  if (isEmptyString(state.farmCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM_CODE,
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

  if (isEmptyString(state.farmName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM_NAME,
    });
    return false;
  }

  if (state.province === null || state.province?.value.id === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PROVINCE,
    });
    return false;
  }

  if (state.city === null || state.city?.value.id === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CITY,
    });
    return false;
  }

  if (state.district === null || state.district?.value.id === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DISTRICT,
    });
    return false;
  }

  if (isEmptyString(state.zipCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ZIP_CODE,
    });
    return false;
  }

  if (isEmptyString(state.addressName) || state.addressName.length > 50) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ADDRESS_NAME,
    });
    return false;
  }

  if (isEmptyString(state.address1)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ADDRESS1,
    });
    return false;
  }

  if (isEmptyString(state.latitude)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.LATITUDE,
    });
    return false;
  }

  if (isEmptyString(state.longitude)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.LONGITUDE,
    });
    return false;
  }

  return true;
};
