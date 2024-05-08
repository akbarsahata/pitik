import { isEmptyString, isFutureDate } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TFarmingCycleByIdResponse, TUserResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setFarmingCycleInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TFarmingCycleByIdResponse;
  state: TStore;
}) => {
  let workerIds: string[] = [];
  data.workers.map((worker) => workerIds.push(worker.userId));
  dispatch({
    type: ACTION_TYPE.SET_INITIAL_WORKER_IDS,
    payload: workerIds,
  });

  dispatch({
    type: ACTION_TYPE.SET_COOP,
    payload: data.coop
      ? {
          value: data.coop,
          label: `(${data.coop?.coopCode}) ${data.coop?.coopName}`,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_TEMP,
    payload: { leaderId: data.leaders[0]?.userId },
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.farmingCycleCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_OWNER_ID,
    payload: data.farm?.userOwnerId,
  });

  dispatch({
    type: ACTION_TYPE.SET_REMARKS,
    payload: data.remarks,
  });
  dispatch({
    type: ACTION_TYPE.SET_FARM_START_DATE,
    payload: data.farmingCycleStartDate,
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_FARM_START_DATE,
    payload: data.farmingCycleStartDate,
  });
  dispatch({
    type: ACTION_TYPE.SET_DOC_IN_BW,
    payload: data.docInBW,
  });
  dispatch({
    type: ACTION_TYPE.SET_DOC_IN_UNIFORMITY,
    payload: data.docInUniformity,
  });
  const chickType =
    state.chickTypeData[
      state.chickTypeData.findIndex((item) => item.id === data.chickTypeId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_CHICK_TYPE,
    payload: chickType
      ? {
          value: chickType,
          label: `(${chickType?.chickTypeCode}) ${chickType?.chickTypeName}`,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_BRANCH,
    payload: data.branch
      ? {
          label: `(${data.branch.code}) ${data.branch.name}`,
          value: data.branch,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_CONTRACT,
    payload: data.contract
      ? {
          label: `(${data.contractType.contractName}) ${data.contract.code}`,
          value: data.contract,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_INITIAL_POPULATION,
    payload: data.initialPopulation,
  });
  dispatch({
    type: ACTION_TYPE.SET_HATCHERY,
    payload: data.hatchery,
  });
  dispatch({
    type: ACTION_TYPE.SET_CHICK_SUPPLIER_TYPE,
    payload: data.chickSupplier
      ? {
          value: data.chickSupplier,
          label: data.chickSupplier,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_FARMING_STATUS,
    payload: data.farmingStatus,
  });
  dispatch({
    type: ACTION_TYPE.SET_CLOSED_DATE,
    payload: data.closedDate,
  });

  let ppls: IDropdownItem<TUserResponse>[] = [];
  data.ppls.map((responsePpl) => {
    const ppl =
      state.pplData[
        state.pplData.findIndex((item) => item.id === responsePpl.userId)
      ];

    ppls.push({
      value: ppl,
      label: `(${ppl?.userCode}) ${ppl?.fullName}`,
    });
  });
  dispatch({
    type: ACTION_TYPE.SET_PPLS,
    payload: ppls,
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
  isOtherChickSupplierVisible,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  isOtherChickSupplierVisible: boolean;
}): boolean => {
  if (state.coop === null || isEmptyString(state.coop?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP,
    });
    return false;
  }

  if (state.ppls === null || state.ppls?.length === 0) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PPLS,
    });
    return false;
  }

  if (
    state.docInBW !== undefined &&
    (state.docInBW < 0 || state.docInBW > 100)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_IN_BW,
    });
    return false;
  }

  if (
    state.docInUniformity !== undefined &&
    (state.docInUniformity < 0 || state.docInUniformity > 100)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_IN_UNIFORMITY,
    });
    return false;
  }

  if (isEmptyString(state.farmStartDate as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM_START_DATE,
    });
    return false;
  }

  if (
    state.farmStartDate !== state.oldFarmStartDate &&
    isFutureDate(state.farmStartDate as string, undefined, true)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM_START_DATE,
    });
    return false;
  }

  if (state.chickType === null || isEmptyString(state.chickType?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICK_TYPE,
    });
    return false;
  }

  if (
    isOtherChickSupplierVisible &&
    isEmptyString(state.otherChickSupplierType as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OTHER_CHICK_SUPPLIER_TYPE,
    });
    return false;
  }

  if (
    state.chickSupplierType === null ||
    isEmptyString(state.chickSupplierType?.value)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICK_SUPPLIER_TYPE,
    });
    return false;
  }

  if (isEmptyString(state.hatchery as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.HATCHERY,
    });
    return false;
  }

  return true;
};

export const checkRepopulateRequirement = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (
    state.repopulateDate === null ||
    isEmptyString(state.repopulateDate?.value)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.REPOPULATE_DATE,
    });
    return false;
  }

  if (
    state.approvedAmount === undefined ||
    state.approvedAmount <= 0 ||
    (state.initialPopulation && state.approvedAmount > state.initialPopulation)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.APPROVED_AMOUNT,
    });
    return false;
  }

  if (
    state.repopulateReason === null ||
    isEmptyString(state.repopulateReason?.value)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.REPOPULATE_REASON,
    });
    return false;
  }

  if (
    state.repopulateReason.value === "Other" &&
    isEmptyString(state.otherRepopulateReason as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OTHER_REPOPULATE_REASON,
    });
    return false;
  }

  return true;
};
