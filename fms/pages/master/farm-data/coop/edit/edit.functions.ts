import { USER_TYPE } from "@constants/index";
import { postUploadFile, putEditCoop } from "@services/api";
import { isEmptyString } from "@services/utils/string";
import { TCoopResponse, TUserResponse } from "@type/response.type";
import { NextRouter } from "next/router";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setCoopInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TCoopResponse;
  state: TStore;
}) => {
  const role =
    state.roleData[
      state.roleData.findIndex((item) => item.id === data.userSupervisorRoleId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_ROLE,
    payload: role
      ? {
          label: role.name.toUpperCase(),
          value: role,
        }
      : null,
  });

  const chickType =
    state.chickTypeData[
      state.chickTypeData.findIndex(
        (item) => item.id === data.chickType?.id || ""
      )
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

  const owner =
    state.ownerData[
      state.ownerData.findIndex((item) => item.id === data.farm.userOwnerId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_OWNER,
    payload: owner
      ? {
          value: owner,
          label: `(${owner?.userCode}) ${owner?.fullName}`,
        }
      : null,
  });

  const coopType =
    state.coopTypeData[
      state.coopTypeData.findIndex((item) => item.id === data.coopTypeId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_COOP_TYPE,
    payload: coopType
      ? {
          value: coopType,
          label: `(${coopType?.coopTypeCode}) ${coopType?.coopTypeName}`,
        }
      : null,
  });

  const contractType =
    state.contractTypeData[
      state.contractTypeData.findIndex(
        (item) => item.id === data.contractTypeId
      )
    ];

  dispatch({
    type: ACTION_TYPE.SET_CONTRACT_TYPE,
    payload: contractType
      ? {
          value: contractType,
          label: contractType.contractName,
        }
      : null,
  });

  let workerIdOnly: string[] = [];
  data.workers &&
    data.workers.map((worker: TUserResponse) => workerIdOnly.push(worker.id));

  dispatch({
    type: ACTION_TYPE.SET_TEMP,
    payload: {
      ...state.temp,
      parentId: data.userSupervisorId,
      rank: role?.roleRanks.rank || undefined,
      farmId: data.farmId || "",
      leaderId: data.leader?.id || "",
      workerIds: workerIdOnly,
      ownerId: data.farm?.userOwnerId || "",
    },
  });

  // NOTE: Static________________________________________________________
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.coopName,
  });
  dispatch({
    type: ACTION_TYPE.SET_COOP_CODE,
    payload: data.coopCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_COOP_NAME,
    payload: data.coopName,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      value: data.status,
      label: data.status ? "Active" : "Inactive",
    },
  });
  dispatch({
    type: ACTION_TYPE.SET_CHICK_IN_DATE,
    payload: data.chickInDate,
  });
  dispatch({
    type: ACTION_TYPE.SET_MAX_CAPACITY,
    payload: data.maxCapacity,
  });
  dispatch({
    type: ACTION_TYPE.SET_HEIGHT,
    payload: data.height,
  });
  dispatch({
    type: ACTION_TYPE.SET_LENGTH_DATA,
    payload: data.length,
  });
  dispatch({
    type: ACTION_TYPE.SET_WIDTH,
    payload: data.width,
  });
  dispatch({
    type: ACTION_TYPE.SET_NUM_FAN,
    payload: data.numFan,
  });
  dispatch({
    type: ACTION_TYPE.SET_CAPACITY_FAN,
    payload: data.capacityFan,
  });
  let filenameOnly: { filename: string }[] = [];
  data.coopImages &&
    data.coopImages.map((image: { filename: string }) =>
      filenameOnly.push({ filename: image.filename })
    );
  dispatch({
    type: ACTION_TYPE.SET_IMAGES,
    payload: filenameOnly,
  });
  dispatch({
    type: ACTION_TYPE.SET_REMARKS,
    payload: data.remarks,
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

  if (state.contractType === null || state.contractType?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CONTRACT_TYPE,
    });
    return false;
  }

  return true;
};

export const doEditCoop = async ({
  dispatch,
  state,
  router,
  coopId,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  router: NextRouter;
  coopId: string;
}) => {
  let workerIds: string[] = [];
  state.workers?.length &&
    state.workers?.map((worker) => workerIds.push(worker.value?.id));
  dispatch({
    type: ACTION_TYPE.SET_IS_LOADING,
    payload: true,
  });

  const requestCreateCoop = async () => {
    await putEditCoop(
      {
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
      },
      coopId
    )
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

  let uploadedImagesData: { filename: string }[] = state.images;

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
