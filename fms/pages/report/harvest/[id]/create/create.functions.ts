import { isEmptyString } from "@services/utils/string";
import {
  ACTIONS,
  ERROR_TYPE,
  TState,
  TWeighingDataPayload,
} from "./create.constants";

export const setErrorText = ({
  dispatch,
  error,
}: {
  dispatch: any;
  error: any;
}) => {
  dispatch({
    type: ACTIONS.SET_ERROR_TYPE,
    payload: { data: ERROR_TYPE.GENERAL },
  });
  dispatch({
    type: ACTIONS.SET_ERROR_TEXT,
    payload: {
      data: `(${error.response.data.code || "500"}) ${
        error.response.data.data?.error?.message ||
        error.response.data.error?.message ||
        error.response.data?.message ||
        "Failed to perform request"
      }`,
    },
  });
};

export const handleOnChangeTotalHarvest = (
  unitsOfMeasurement: "tonnage" | "quantity",
  onChangeValue: number,
  dataTimbang: TWeighingDataPayload,
  state: TState,
  dispatch: any
) => {
  const newArr = [...state.records];
  const index = newArr.findIndex((data) => data.id === dataTimbang.id);
  newArr[index][unitsOfMeasurement] = onChangeValue;

  const totalQuantity = newArr.reduce(
    (total, record) => total + (record.quantity || 0),
    0
  );

  const totalTonnage = newArr.reduce(
    (total, record) => total + (record.tonnage || 0),
    0
  );

  dispatch({
    type: ACTIONS.SET_WEIGHING_DATA,
    payload: {
      data: newArr,
    },
  });

  dispatch({
    type: ACTIONS.SET_TOTAL,
    payload: {
      data: {
        ...state.total,
        quantity: totalQuantity,
        tonnage: totalTonnage,
      },
    },
  });
};

export const checkRequired = ({
  dispatch,
  state,
}: {
  dispatch: any;
  state: TState;
}): boolean => {
  if (isEmptyString(state.date)) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.DATE },
    });
    return false;
  }
  if (
    isEmptyString(state.harvestBasketName) ||
    state.harvestBasketName.length > 100
  ) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.HARVEST_BASKET_NAME },
    });
    return false;
  }

  if (isEmptyString(state.deliveryOrder) || state.deliveryOrder.length > 20) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.DELIVERY_ORDER },
    });
    return false;
  }

  if (
    isEmptyString(state.truckLicensePlate) ||
    state.truckLicensePlate.length < 4 ||
    state.truckLicensePlate.length > 12
  ) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.TRUCK_LICENSE_PLATE },
    });
    return false;
  }

  if (isEmptyString(state.driver) || state.driver.length > 100) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.DRIVER_NAME },
    });
    return false;
  }

  if (isEmptyString(state.weighingNumber) || state.weighingNumber.length > 20) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.WEIGHING_NUMBER },
    });
    return false;
  }

  if (
    state.total.quantity <= 0 ||
    state.total.tonnage <= 0 ||
    state.records.length <= 0
  ) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.GENERAL },
    });
    dispatch({
      type: ACTIONS.SET_ERROR_TEXT,
      payload: {
        data: "All data timbang fields are required",
      },
    });
    return false;
  }

  if (state.records.length > 0) {
    const result = state.records.map((record) => {
      if (
        !record.tonnage ||
        !record.quantity ||
        record.quantity +
          (state.detailHarvestData.harvest.total.quantity || 0) >
          (state.detailHarvestData.initialPopulation || 0)
      ) {
        dispatch({
          type: ACTIONS.SET_ERROR_TYPE,
          payload: { data: ERROR_TYPE.GENERAL },
        });
        return false;
      }
    });
    if (result.includes(false)) {
      const index = result.indexOf(false);
      (state.detailHarvestData.harvest.total.quantity || 0) >
      (state.detailHarvestData.initialPopulation || 0)
        ? dispatch({
            type: ACTIONS.SET_ERROR_TEXT,
            payload: {
              data: `The total quantity entered in Data Timbang Details ${
                index + 1
              } exceeds the available stock by ${
                state.detailHarvestData.initialPopulation -
                (state.detailHarvestData.harvest.total.quantity || 0)
              }`,
            },
          })
        : dispatch({
            type: ACTIONS.SET_ERROR_TEXT,
            payload: {
              data: `Please input Data Timbang Details in set ${
                index + 1
              } to proceed.`,
            },
          });
      return false;
    }
  }

  return true;
};
