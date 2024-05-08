import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import {
  CONTROLLER,
  HEATER,
  IMAGE_ERROR_DATA,
  INLET,
  USER_TYPE,
} from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getChickenStrains,
  getContractTypes,
  getCoop,
  getCoopTypes,
  getFarms,
  getParents,
  getRoles,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TContractTypeResponse,
  TCoopResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TGetByIdResponse,
  TGetManyResponse,
  TParentResponse,
  TRoleResponse,
  TUserResponse,
} from "@type/response.type";
import { Image } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  doEditCoop,
  setCoopInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const coopId = decodeString(router.query.id as string);

  const OTHER_INPUT = {
    CONTROLLER: "controller",
    INLET: "inlet",
    HEATER: "heater",
  };

  const [isOtherInputVisible, setIsOtherInputVisible] = useState<string[]>([]);

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item: TUserResponse) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item: TFarmResponse) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  let coopTypeOptions: IDropdownItem<TCoopTypeResponse>[] = [];
  state.coopTypeData.map((item: TCoopTypeResponse) =>
    coopTypeOptions.push({
      value: item,
      label: `(${item.coopTypeCode}) ${item.coopTypeName}`,
    })
  );

  const contractTypeOptions: IDropdownItem<TContractTypeResponse>[] = [];
  state.contractTypeData.map((item: TContractTypeResponse) =>
    contractTypeOptions.push({
      value: item,
      label: item.contractName,
    })
  );

  let leaderOptions: IDropdownItem<TUserResponse>[] = [];
  state.leaderData.map((item: TUserResponse) =>
    leaderOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let workerOptions: IDropdownItem<TUserResponse>[] = [];
  state.workerData.map((item: TUserResponse) =>
    workerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let chickTypeOptions: IDropdownItem<TChickenStrainResponse>[] = [];
  state.chickTypeData.map((item: TChickenStrainResponse) =>
    chickTypeOptions.push({
      value: item,
      label: `(${item.chickTypeCode}) ${item.chickTypeName}`,
    })
  );

  let roleOptions: IDropdownItem<TRoleResponse>[] = [];
  state.roleData.map((role: TRoleResponse) => {
    roleOptions.push({
      label: role.name.toUpperCase(),
      value: role,
    });
  });

  let parentOptions: IDropdownItem<TParentResponse>[] = [];
  state.parentData?.map((parent: TParentResponse) => {
    parentOptions.push({
      label: parent.name || "-",
      value: parent,
    });
  });

  let controllerOptions: IDropdownItem<string>[] = [];
  CONTROLLER.map((item: string) =>
    controllerOptions.push({
      value: item,
      label: item,
    })
  );

  let inletOptions: IDropdownItem<string>[] = [];
  INLET.map((item: string) =>
    inletOptions.push({
      value: item,
      label: item,
    })
  );

  let heaterOptions: IDropdownItem<string>[] = [];
  HEATER.map((item: string) =>
    heaterOptions.push({
      value: item,
      label: item,
    })
  );

  const contractTypeData: UseQueryResult<
    { data: TGetManyResponse<TContractTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["contractTypeData"],
    async () =>
      await getContractTypes({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const contractTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CONTRACT_TYPE_DATA,
          payload: contractTypeList,
        });
      },
    }
  );

  const chickTypeData: UseQueryResult<
    { data: TGetManyResponse<TChickenStrainResponse[]> },
    AxiosError
  > = useQuery(
    ["chickTypeData"],
    async () =>
      await getChickenStrains({
        page: 1,
        limit: 0,
        status: true,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const chickTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CHICK_TYPE_DATA,
          payload: chickTypeList,
        });
      },
    }
  );

  const coopTypeData: UseQueryResult<
    { data: TGetManyResponse<TCoopTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["coopTypeData"],
    async () =>
      await getCoopTypes({
        page: 1,
        limit: 0,
        status: true,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const coopTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_TYPE_DATA,
          payload: coopTypeList,
        });
      },
    }
  );

  const ownerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["ownerData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userType: USER_TYPE.OWN.full,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const ownerList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_OWNER_DATA,
          payload: ownerList,
        });
      },
    }
  );

  const farmData: UseQueryResult<
    { data: TGetManyResponse<TFarmResponse[]> },
    AxiosError
  > = useQuery(
    ["farmData", state.owner],
    async () =>
      await getFarms({
        page: 1,
        limit: 0,
        status: true,
        userOwnerId: state.owner?.value.id,
      }),
    {
      enabled: !!state.ownerData.length && !!state.temp.farmId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const farmList = data.data || [];
        const farm =
          farmList[farmList.findIndex((item) => item.id === state.temp.farmId)];
        dispatch({
          type: ACTION_TYPE.SET_FARM,
          payload: farm
            ? {
                value: farm,
                label: `(${farm?.farmCode}) ${farm?.farmName}`,
              }
            : null,
        });
        dispatch({
          type: ACTION_TYPE.SET_FARM_DATA,
          payload: farmList,
        });
      },
    }
  );

  const leaderData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["leaderData", state.owner],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userType: USER_TYPE.KK.full,
        ownerId: state.owner?.value.id,
      }),
    {
      enabled: !!state.ownerData.length || !!state.temp.leaderId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const leaderList = data.data || [];
        const leader =
          leaderList[
            leaderList.findIndex((item) => item.id === state.temp.leaderId)
          ];
        dispatch({
          type: ACTION_TYPE.SET_LEADER,
          payload: leader
            ? {
                value: leader,
                label: `(${leader?.userCode}) ${leader?.fullName}`,
              }
            : null,
        });
        dispatch({
          type: ACTION_TYPE.SET_LEADER_DATA,
          payload: leaderList,
        });
      },
    }
  );

  const workerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["workerData", state.owner],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userType: USER_TYPE.AK.full,
        ownerId: state.owner?.value.id,
      }),
    {
      enabled: !!state.ownerData.length && !!state.temp.ownerId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const workerList = data.data || [];
        let worker: IDropdownItem<TUserResponse>[] = [];
        state.temp.workerIds.map((id: string) => {
          const item = workerList[workerList.findIndex((res) => res.id === id)];
          worker.push({
            value: item,
            label: `(${item?.userCode}) ${item?.fullName}`,
          });
        });
        dispatch({
          type: ACTION_TYPE.SET_WORKERS,
          payload: worker,
        });
        dispatch({
          type: ACTION_TYPE.SET_WORKER_DATA,
          payload: workerList,
        });
      },
    }
  );

  const roleData: UseQueryResult<
    { data: TGetManyResponse<TRoleResponse[]> },
    AxiosError
  > = useQuery(
    ["roleData"],
    async () => await getRoles({ limit: 50, context: "internal" }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const roleDataList = data.data || [];
        const removeCL = roleDataList.filter(
          (data) =>
            data.name !== USER_TYPE.CL.full &&
            data.name !== USER_TYPE.VP.full &&
            data.name !== USER_TYPE.GM.full &&
            data.name !== USER_TYPE.ADM.full &&
            data.name !== USER_TYPE.IO.full &&
            data.name !== USER_TYPE.IS.full &&
            data.name !== USER_TYPE.AI.full &&
            data.name !== USER_TYPE.SA.full
        );
        dispatch({
          type: ACTION_TYPE.SET_ROLE_DATA,
          payload: removeCL,
        });
      },
    }
  );

  const parentData: UseQueryResult<
    { data: TGetManyResponse<TParentResponse[]> },
    AxiosError
  > = useQuery(
    ["parentData", state.role],
    async () =>
      await getParents({
        limit: 999,
        rank: state.role?.value.roleRanks.rank || 99,
      }),
    {
      enabled: !!state.roleData.length && (!!state.temp.rank || !!state.role),
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const parentDataList: TParentResponse[] = data.data || [];
        const parent =
          parentDataList[
            parentDataList.findIndex(
              (item) => item.idCms === state.temp.parentId
            )
          ];

        dispatch({
          type: ACTION_TYPE.SET_PARENT,
          payload: parent
            ? {
                label: parent.name || "-",
                value: parent,
              }
            : null,
        });
        dispatch({
          type: ACTION_TYPE.SET_PARENT_DATA,
          payload: parentDataList,
        });
      },
    }
  );

  const coopData: UseQueryResult<
    { data: TGetByIdResponse<TCoopResponse> },
    AxiosError
  > = useQuery(["coopData"], async () => await getCoop(coopId), {
    refetchOnWindowFocus: false,
    enabled:
      !!state.roleData.length &&
      !!state.chickTypeData.length &&
      !!state.coopTypeData.length &&
      !!state.ownerData.length &&
      !!state.contractTypeData.length,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const result = data.data;
      if (
        !result.otherControllerType ||
        isEmptyString(result.otherControllerType)
      ) {
        dispatch({
          type: ACTION_TYPE.SET_CONTROLLER_TYPE,
          payload: null,
        });
      } else {
        if (CONTROLLER.includes(result.otherControllerType)) {
          dispatch({
            type: ACTION_TYPE.SET_CONTROLLER_TYPE,
            payload: {
              label: result.otherControllerType,
              value: result.otherControllerType,
            },
          });
        } else {
          setIsOtherInputVisible((prevState) => [
            ...prevState,
            OTHER_INPUT.CONTROLLER,
          ]);
          dispatch({
            type: ACTION_TYPE.SET_CONTROLLER_TYPE,
            payload: {
              label: "Other",
              value: "Other",
            },
          });
          dispatch({
            type: ACTION_TYPE.SET_OTHER_CONTROLLER_TYPE,
            payload: result.otherControllerType,
          });
        }
      }

      if (!result.otherInletType || isEmptyString(result.otherInletType)) {
        dispatch({
          type: ACTION_TYPE.SET_INLET_TYPE,
          payload: null,
        });
      } else {
        if (INLET.includes(result.otherInletType)) {
          dispatch({
            type: ACTION_TYPE.SET_INLET_TYPE,
            payload: {
              label: result.otherInletType,
              value: result.otherInletType,
            },
          });
        } else {
          setIsOtherInputVisible((prevState) => [
            ...prevState,
            OTHER_INPUT.INLET,
          ]);
          dispatch({
            type: ACTION_TYPE.SET_INLET_TYPE,
            payload: {
              label: "Other",
              value: "Other",
            },
          });
          dispatch({
            type: ACTION_TYPE.SET_OTHER_INLET_TYPE,
            payload: result.otherInletType,
          });
        }
      }

      if (!result.otherHeaterType || isEmptyString(result.otherHeaterType)) {
        dispatch({
          type: ACTION_TYPE.SET_HEATER_TYPE,
          payload: null,
        });
      } else {
        if (HEATER.includes(result.otherHeaterType)) {
          dispatch({
            type: ACTION_TYPE.SET_HEATER_TYPE,
            payload: {
              label: result.otherHeaterType,
              value: result.otherHeaterType,
            },
          });
        } else {
          setIsOtherInputVisible((prevState) => [
            ...prevState,
            OTHER_INPUT.HEATER,
          ]);
          dispatch({
            type: ACTION_TYPE.SET_HEATER_TYPE,
            payload: {
              label: "Other",
              value: "Other",
            },
          });
          dispatch({
            type: ACTION_TYPE.SET_OTHER_HEATER_TYPE,
            payload: result.otherHeaterType,
          });
        }
      }

      setCoopInitialData({
        dispatch,
        data: result,
        state,
      });
    },
  });

  if (
    chickTypeData.isLoading ||
    coopTypeData.isLoading ||
    ownerData.isLoading ||
    ownerData.isFetching ||
    farmData.isLoading ||
    leaderData.isLoading ||
    workerData.isLoading ||
    roleData.isLoading ||
    roleData.isFetching ||
    coopData.isLoading ||
    coopData.isFetching ||
    contractTypeData.isLoading ||
    contractTypeData.isFetching ||
    state.isLoading
  )
    return <Loading />;

  if (
    coopData.isError ||
    ownerData.isError ||
    farmData.isError ||
    coopTypeData.isError ||
    leaderData.isError ||
    workerData.isError ||
    chickTypeData.isError ||
    contractTypeData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Coop"
      pageTitle={`Edit Coop - ${state.oldName}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Coop Details</p>
            {/* Owner & Farm */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Owner */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Owner *"
                  value={state.owner}
                  state={
                    state.errorType === ERROR_TYPE.OWNER ? "error" : "active"
                  }
                  errorMessage="Please select the owner!"
                  options={ownerOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TUserResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_OWNER,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_TEMP,
                      payload: {
                        parentId: "",
                        rank: undefined,
                        farmId: "",
                        leaderId: "",
                        workerIds: [],
                        ownerId: "",
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_FARM,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_LEADER,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_WORKERS,
                      payload: null,
                    });
                  }}
                />
              </div>
              {/* Farm */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Farm *"
                  value={state.farm}
                  state={
                    state.errorType === ERROR_TYPE.FARM ? "error" : "active"
                  }
                  errorMessage="Please select the farm!"
                  options={farmOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TFarmResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_FARM,
                      payload: item,
                    });
                  }}
                />
              </div>
            </div>
            {/* Coop Code & Coop Name */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Coop Code */}
              <div className="flex-1 w-full">
                <Input
                  label="Coop Code *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.COOP_CODE
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please set a valid coop code!"
                  value={state.coopCode}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP_CODE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
              {/* Coop Name */}
              <div className="flex-1 w-full">
                <Input
                  label="Coop Name *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.COOP_NAME
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please input a valid coop name!"
                  value={state.coopName}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP_NAME,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            {/* Status & Coop Type */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Status */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Status *"
                  state={
                    state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                  }
                  errorMessage="Please select a status!"
                  value={state.status}
                  options={statusOptions}
                  onChange={(item: IDropdownItem<boolean>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_STATUS,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Coop Type */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Coop Type *"
                  state={
                    state.errorType === ERROR_TYPE.COOP_TYPE
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select a coop type!"
                  value={state.coopType}
                  options={coopTypeOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TCoopTypeResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP_TYPE,
                      payload: item,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Production Team</p>
            {/* Poultry Leader & Poultry Workers */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Poultry Leader */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Poultry Leader"
                  value={state.leader}
                  isSearchable={true}
                  options={leaderOptions}
                  onChange={(item: IDropdownItem<TUserResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_LEADER,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Poultry Workers */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Poultry Workers"
                  value={state.workers}
                  isSearchable={true}
                  isMulti={true}
                  options={workerOptions}
                  onChange={(item: IDropdownItem<TUserResponse>[]) => {
                    console.log(item);
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_WORKERS,
                      payload: item,
                    });
                  }}
                />
              </div>
            </div>
            {/* Role & Supervisor */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Role */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Role *"
                  state={
                    state.errorType === ERROR_TYPE.ROLE ? "error" : "active"
                  }
                  isLoading={roleData.isLoading ? true : false}
                  errorMessage="Please select a role!"
                  value={state.role}
                  options={roleOptions}
                  onChange={(item: IDropdownItem<TRoleResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_PARENT,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ROLE,
                      payload: item,
                    });
                  }}
                />
                {state.errorType !== ERROR_TYPE.ROLE && (
                  <p className="text-md mb-1 ml-1 text-gray-500">
                    {"Please select the lowest officer rank first"}
                  </p>
                )}
              </div>
              {state.role?.value.name !== USER_TYPE.CL.full &&
                state.role?.value.name !== USER_TYPE.VP.full &&
                state.role?.value.name !== USER_TYPE.GM.full &&
                state.role?.value.name !== USER_TYPE.ADM.full && (
                  <div className="flex-1 w-full">
                    <Dropdown
                      label="Supervisor *"
                      state={
                        state.errorType === ERROR_TYPE.PARENT
                          ? "error"
                          : "active"
                      }
                      isLoading={parentData.isLoading ? true : false}
                      isSearchable={true}
                      errorMessage="Please select a supervisor!"
                      value={state.parent}
                      options={parentOptions}
                      onChange={(item: IDropdownItem<TParentResponse>) => {
                        dispatch({
                          type: ACTION_TYPE.SET_ERROR_TYPE,
                          payload: ERROR_TYPE.NONE,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_PARENT,
                          payload: item,
                        });
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Farm Cycle Details</p>
            {/* First Chickin Date & Max Capacity */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* First Chickin Date */}
              <div className="flex-1 w-full">
                <Input
                  className="w-full"
                  label="First Chick-in Date"
                  type="date"
                  value={state.chickInDate}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CHICK_IN_DATE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
              {/* Max Capacity */}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  label="Maximum Capacity"
                  className="w-full"
                  value={state.maxCapacity}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_MAX_CAPACITY,
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            {/* Chick Type */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Chick Type"
                value={state.chickType}
                isSearchable={true}
                options={chickTypeOptions}
                onChange={(item: IDropdownItem<TChickenStrainResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CHICK_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Environment Details</p>
            {/* Height, Length & Width */}
            <div className="flex flex-1 w-full flex-col xl:flex-row items-start justify-start space-y-4 xl:space-y-0 space-x-0 xl:space-x-4">
              {/* Height */}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  min="0"
                  label="Height (m)"
                  className="w-full"
                  value={state.height}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_HEIGHT,
                      payload: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
              {/* Length*/}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  min="0"
                  label="Length (m)"
                  className="w-full"
                  value={state.lengthData}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_LENGTH_DATA,
                      payload: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
              {/* Width */}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  min="0"
                  label="Width (m)"
                  className="w-full"
                  value={state.width}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_WIDTH,
                      payload: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            {/* Controller Type */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              <div className="flex-1 w-full">
                <Dropdown
                  label="Controller Type"
                  value={state.controllerType}
                  options={controllerOptions}
                  onChange={(item: IDropdownItem<string>) => {
                    item.value === "Other"
                      ? setIsOtherInputVisible((prevState) => [
                          ...prevState,
                          OTHER_INPUT.CONTROLLER,
                        ])
                      : setIsOtherInputVisible(
                          isOtherInputVisible.filter(
                            (e) => e !== OTHER_INPUT.CONTROLLER
                          )
                        );
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_CONTROLLER_TYPE,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CONTROLLER_TYPE,
                      payload: item,
                    });
                  }}
                />
              </div>
              <div
                className={`flex-1 w-full ${
                  isOtherInputVisible.includes(OTHER_INPUT.CONTROLLER)
                    ? ""
                    : "hidden"
                }`}
              >
                <Input
                  label="Other Type Controller"
                  className="w-full"
                  value={state.otherControllerType}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_CONTROLLER_TYPE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            {/* Inlet Type & Heater Type */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Inlet Type */}
              <div className="w-full">
                <Dropdown
                  label="Inlet Type"
                  value={state.inletType}
                  options={inletOptions}
                  onChange={(item: IDropdownItem<string>) => {
                    item.value === "Other"
                      ? setIsOtherInputVisible((prevState) => [
                          ...prevState,
                          OTHER_INPUT.INLET,
                        ])
                      : setIsOtherInputVisible(
                          isOtherInputVisible.filter(
                            (e) => e !== OTHER_INPUT.INLET
                          )
                        );
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_INLET_TYPE,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_INLET_TYPE,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Heater Type */}
              <div className="w-full">
                <Dropdown
                  label="Heater Type"
                  value={state.heaterType}
                  options={heaterOptions}
                  onChange={(item: IDropdownItem<string>) => {
                    item.value === "Other"
                      ? setIsOtherInputVisible((prevState) => [
                          ...prevState,
                          OTHER_INPUT.HEATER,
                        ])
                      : setIsOtherInputVisible(
                          isOtherInputVisible.filter(
                            (e) => e !== OTHER_INPUT.HEATER
                          )
                        );
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_HEATER_TYPE,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_HEATER_TYPE,
                      payload: item,
                    });
                  }}
                />
              </div>
            </div>
            <div
              className={`flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 ${
                isOtherInputVisible.includes(OTHER_INPUT.INLET) ||
                isOtherInputVisible.includes(OTHER_INPUT.HEATER)
                  ? ""
                  : "hidden"
              }`}
            >
              <div
                className={`flex-1 w-full ${
                  isOtherInputVisible.includes(OTHER_INPUT.INLET)
                    ? ""
                    : "invisible"
                }`}
              >
                <Input
                  label="Other Type Inlet"
                  className="w-full"
                  value={state.otherInletType}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_INLET_TYPE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
              <div
                className={`flex-1 w-full ${
                  isOtherInputVisible.includes(OTHER_INPUT.HEATER)
                    ? ""
                    : "invisible"
                }`}
              >
                <Input
                  label="Other Type Heater"
                  className="w-full"
                  value={state.otherHeaterType}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_HEATER_TYPE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            {/* Num Fan & Capacity Fan */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Num Fan */}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  label="Num Fan"
                  className="w-full"
                  value={state.numFan}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_NUM_FAN,
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              {/* Capacity Fan */}
              <div className="flex-1 w-full">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  label="Capacity Fan"
                  className="w-full"
                  value={state.capacityFan}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CAPACITY_FAN,
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Contract Assignment</p>
            {/* Contract Type */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Contract Type *"
                value={state.contractType}
                state={
                  state.errorType === ERROR_TYPE.CONTRACT_TYPE
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the contract type!"
                options={contractTypeOptions}
                isSearchable={true}
                onChange={(item: IDropdownItem<TContractTypeResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CONTRACT_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Additionals</p>
            {/* Photo */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              <div className="flex-1 w-full">
                <Input
                  label="Select Photo"
                  className="w-full"
                  multiple={true}
                  type="file"
                  accept="image/png, image/jpeg"
                  // TODO: add types for files [TK-876]
                  onChange={(e: any) => {
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_IMAGES,
                      payload: [...e.target.files],
                    });
                  }}
                />
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {state.images.length > 0 &&
                      state.images.map((image) => (
                        <div
                          key={image.id}
                          className={`${
                            state.images.includes(image) ? "hidden" : "flex"
                          } flex-col items-center justify-start`}
                        >
                          <Image
                            placeholder="blur"
                            key={image.id}
                            height={150}
                            fallback={IMAGE_ERROR_DATA}
                            src={image.filename}
                            alt="Image data"
                          />
                          <Button
                            className="w-full mt-1"
                            size="xs"
                            title="Delete"
                            onClick={() => {
                              const filteredData = state.images.filter(
                                (item) => item.filename !== image.filename
                              );
                              dispatch({
                                type: ACTION_TYPE.SET_IMAGES,
                                payload: filteredData,
                              });
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Remarks */}
            <div className="w-full h-full">
              <Input
                label="Remarks"
                type="textarea"
                className="w-full h-full"
                value={state.remarks}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_REMARKS,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          state.errorType === ERROR_TYPE.GENERAL ? "flex" : "hidden"
        } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4`}
      >
        <div className="mr-2 text-red-500 text-xl">
          <WarningIcon />
        </div>
        <p className="text-red-500">Failed: {state.errorText}</p>
      </div>

      <div
        className={`flex flex-row items-start justify-end mb-6 ${
          state.errorType === ERROR_TYPE.GENERAL ? "mt-4" : "mt-12"
        } space-x-3`}
      >
        <Button
          size="xs"
          state={state.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={state.isLoading ? "loading" : "active"}
          onClick={async () => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            await doEditCoop({ dispatch, state, router, coopId });
          }}
          title="Edit Coop"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
