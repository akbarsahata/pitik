import { USER_TYPE } from "@constants/index";
import { postCreateCoop, postUploadFile } from "@services/api";
import { isEmptyString } from "@services/utils/string";
import { NextRouter } from "next/router";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./create.constants";

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
  if (state.owner === null || isEmptyString(state.owner?.value.id as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OWNER,
    });
    return false;
  }

  if (state.farm === null || isEmptyString(state.farm?.value.id as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM,
    });
    return false;
  }

  if (isEmptyString(state.coopCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_CODE,
    });
    return false;
  }

  if (isEmptyString(state.coopName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_NAME,
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

  if (
    state.coopType === null ||
    isEmptyString(state.coopType?.value.id as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_TYPE,
    });
    return false;
  }

  if (state.role === null || isEmptyString(state.role?.value.name)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ROLE,
    });
    return false;
  }

  if (state.parent === null || isEmptyString(state.parent?.value.id)) {
    if (
      state.role?.value.name !== USER_TYPE.CL.full &&
      state.role?.value.name !== USER_TYPE.VP.full &&
      state.role?.value.name !== USER_TYPE.GM.full &&
      state.role?.value.name !== USER_TYPE.ADM.full &&
      state.role?.value.name !== USER_TYPE.IO.full &&
      state.role?.value.name !== USER_TYPE.IS.full &&
      state.role?.value.name !== USER_TYPE.AI.full &&
      state.role?.value.name !== USER_TYPE.SA.full
    ) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.PARENT,
      });
      return false;
    }
  }

  if (
    state.contractType === null ||
    isEmptyString(state.contractType?.value.id as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CONTRACT_TYPE,
    });
    return false;
  }

  return true;
};

export const doCreateCoop = async ({
  dispatch,
  state,
  router,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  router: NextRouter;
}) => {
  let workerIds: string[] = [];
  state.workers?.map((worker) => workerIds.push(worker.value.id));
  dispatch({
    type: ACTION_TYPE.SET_IS_LOADING,
    payload: true,
  });

  const requestCreateCoop = async () => {
    await postCreateCoop({
      owner: state.owner?.value.id as string,
      farmId: state.farm?.value.id as string,
      coopCode: state.coopCode,
      coopName: state.coopName,
      coopTypeId: state.coopType?.value.id as string,
      chickTypeId: state.chickType?.value.id as string,
      contractTypeId: state.contractType?.value.id as string,
      leaderId: state.leader?.value.id as string,
      workerIds: workerIds,
      numFan: state.numFan as number,
      capacityFan: state.capacityFan as number,
      height: state.height as number,
      lengthData: state.lengthData as number,
      width: state.width as number,
      maxCapacity: state.maxCapacity as number,
      chickInDate: state.chickInDate as string,
      remarks: state.remarks as string,
      status: state.status?.value,
      otherControllerType:
        state.controllerType === null
          ? undefined
          : state.controllerType.value === "Other"
          ? state.otherControllerType
          : (state.controllerType?.value as string),
      otherInletType:
        state.inletType === null
          ? undefined
          : state.inletType?.value === "Other"
          ? state.otherInletType
          : (state.inletType?.value as string),
      otherHeaterType:
        state.heaterType === null
          ? undefined
          : state.heaterType?.value === "Other"
          ? state.otherHeaterType
          : (state.heaterType?.value as string),
      images: uploadedImagesData,
      userSupervisorId:
        state.parent && !isEmptyString(state.parent?.value.idCms || "")
          ? state.parent?.value.idCms
          : "",
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.NONE,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_LOADING,
            payload: false,
          });
          router.back();
        } else {
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.GENERAL,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_LOADING,
            payload: false,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrorText({ dispatch, error: err });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.GENERAL,
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_LOADING,
          payload: false,
        });
      });
  };

  let uploadedImagesData: { filename: string }[] = [];

  if (state.selectedImages.length === 0) {
    await requestCreateCoop();
  } else {
    state.selectedImages.forEach(async (imageData) => {
      var formData = new FormData();
      formData.append("file", imageData);
      await postUploadFile(formData, "coops")
        .then((res) => {
          uploadedImagesData.push({
            filename: res.data.location,
          });
        })
        .catch((err) => {
          console.log(err);
          setErrorText({ dispatch, error: err });
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.GENERAL,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_LOADING,
            payload: false,
          });
        });

      if (uploadedImagesData.length === state.selectedImages.length) {
        await requestCreateCoop();
      }
    });
  }
};
