import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import {
  CHICK_SUPPLIER,
  CONTRACT,
  FARMING_STATUS,
  REASON_REPOPULATE,
  USER_TYPE,
} from "@constants/index";
import InformationIcon from "@icons/InformationIcon.svg";
import MoreIcon from "@icons/MoreIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getAvailableCoops,
  getChickenStrains,
  getFarmingCycle,
  getFarmingCycleRepopulate,
  getUsers,
  postFarmingCycleRepopulate,
  putEditFarmingCycle,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { getDatesBetween } from "@services/utils/date";
import { decodeString } from "@services/utils/encode";
import { isEmptyString, isFutureDate } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopResponse,
  TFarmingCycleByIdResponse,
  TFarmingCycleRepopulateResponse,
  TGetByIdResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { Menu } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRepopulateRequirement,
  checkRequired,
  setErrorText,
  setFarmingCycleInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const [isOtherInputVisible, setIsOtherInputVisible] = useState(false);
  const [isOtherReasonInputVisible, setIsOtherReasonInputVisible] =
    useState(false);
  const farmingCycleId = decodeString(router.query.id as string);

  const today = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  let repoulateDateOptions: IDropdownItem<string>[] = [];
  const dateOptions = getDatesBetween(
    new Date(state.farmStartDate || new Date()),
    new Date()
  ).reverse();
  dateOptions.map((date) => {
    repoulateDateOptions.push({
      value: date,
      label: `${date} (Hari ke-${
        dateOptions.length - dateOptions.indexOf(date) - 1
      })`,
    });
  });

  let reasonRepopualteOptions: IDropdownItem<string>[] = [];
  REASON_REPOPULATE.map((reason) => {
    reasonRepopualteOptions.push({
      value: reason,
      label: reason,
    });
  });

  let chickTypeOptions: IDropdownItem<TChickenStrainResponse>[] = [];
  const filterChickType = state.chickTypeData.filter(
    (item: TChickenStrainResponse) => item.chickTypeCode === "CS-101"
  );
  filterChickType.map((item: TChickenStrainResponse) =>
    chickTypeOptions.push({
      value: item,
      label: `(${item.chickTypeCode}) ${item.chickTypeName}`,
    })
  );

  let contractOptions: IDropdownItem<string>[] = [];
  CONTRACT.map((item) =>
    contractOptions.push({
      value: item,
      label: item,
    })
  );

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item: TCoopResponse) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
    })
  );

  let chickSupplierOptions: IDropdownItem<string>[] = [];
  CHICK_SUPPLIER.map((item) =>
    chickSupplierOptions.push({
      value: item,
      label: item,
    })
  );

  let pplOptions: IDropdownItem<TUserResponse>[] = [];
  state.pplData.map((item: TUserResponse) =>
    pplOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
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

  const repopulateData: UseQueryResult<
    { data: TGetManyResponse<TFarmingCycleRepopulateResponse[]> },
    AxiosError
  > = useQuery(
    ["repopulateData"],
    async () => await getFarmingCycleRepopulate(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const repopulateData = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_REPOPULATE_DATA,
          payload: repopulateData,
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

  const availableCoopsData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(["availableCoopsData"], async () => await getAvailableCoops(), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const availableCoopsList = data.data || [];
      dispatch({
        type: ACTION_TYPE.SET_COOP_DATA,
        payload: availableCoopsList,
      });
    },
  });

  const workersData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["workersData", state.ownerId],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userTypes: [USER_TYPE.KK.full, USER_TYPE.AK.full].join(","),
        ownerId: state.ownerId,
      }),
    {
      enabled: !!state.ownerId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const ownerList = data.data || [];
        const worker = ownerList.filter(
          (e) => e.userType === USER_TYPE.AK.full
        );
        const leader = ownerList.filter(
          (e) => e.userType === USER_TYPE.KK.full
        );
        dispatch({
          type: ACTION_TYPE.SET_WORKER_DATA,
          payload: worker,
        });
        dispatch({
          type: ACTION_TYPE.SET_LEADER_DATA,
          payload: leader,
        });

        let dropdownWorkers: IDropdownItem<TUserResponse>[] = [];
        state.initialWorkerIds.map((data: string) => {
          const currentWorkers =
            worker[worker.findIndex((item) => item.id === data)];
          dropdownWorkers.push({
            value: currentWorkers,
            label: `(${currentWorkers?.userCode}) ${currentWorkers?.fullName}`,
          });
        });

        dispatch({
          type: ACTION_TYPE.SET_WORKERS,
          payload: dropdownWorkers,
        });

        const currentLeader =
          leader[leader.findIndex((item) => item.id === state.temp?.leaderId)];
        dispatch({
          type: ACTION_TYPE.SET_LEADER,
          payload: currentLeader
            ? {
                value: currentLeader,
                label: `(${currentLeader?.userCode}) ${currentLeader?.fullName}`,
              }
            : null,
        });
      },
    }
  );

  const pplTypeData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["pplTypeData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userType: USER_TYPE.PPL.full,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const pplTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_PPL_DATA,
          payload: pplTypeList,
        });
      },
    }
  );

  const farmingCycleData: UseQueryResult<
    { data: TGetByIdResponse<TFarmingCycleByIdResponse> },
    AxiosError
  > = useQuery(
    ["farmingCycleData"],
    async () => await getFarmingCycle(farmingCycleId),
    {
      enabled:
        !!state.coopData.length &&
        !!state.chickTypeData.length &&
        !!state.pplData.length,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: ({ data }) => {
        setFarmingCycleInitialData({
          dispatch,
          data: data.data,
          state,
        });
      },
    }
  );

  const farmingCycleRepopulate = useMutation(
    ["farmingCycleRepopulate"],
    async () =>
      await postFarmingCycleRepopulate(
        {
          approvedAmount: state.approvedAmount || 0,
          repopulateDate: state.repopulateDate
            ? state.repopulateDate.value
            : "",
          repopulateReason:
            state.repopulateReason && state.repopulateReason.value === "Other"
              ? state.otherRepopulateReason || ""
              : state.repopulateReason?.value || "",
        },
        farmingCycleId
      ),
    {
      onError: (error) => {
        console.log((error as AxiosError).response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  const editFarmingCycle = useMutation(
    ["editFarmingCycle"],
    async () => {
      let pplIds: string[] = [];
      state.ppls &&
        state.ppls.map((item: IDropdownItem<TUserResponse>) =>
          pplIds.push(item.value.id)
        );
      let workerIds: string[] = [];
      state.workers &&
        state.workers.length &&
        state.workers.map((item: IDropdownItem<TUserResponse>) =>
          workerIds.push(item.value.id)
        );
      await putEditFarmingCycle(
        {
          coopId: state.coop ? state.coop.value.id : "",
          farmingCycleStartDate: state.farmStartDate || "",
          chickTypeId: state.chickType ? state.chickType.value.id : "",
          chickSupplier:
            state.chickSupplierType && state.chickSupplierType.value === "Other"
              ? state.otherChickSupplierType || ""
              : state.chickSupplierType?.value || "",
          hatchery: state.hatchery || "",
          remarks: state.remarks,
          contract: state.contract ? state.contract.value.id : "",
          leaderId: state.leader ? state.leader.value.id : "",
          workerIds: workerIds,
          pplIds: pplIds,
          initialPopulation: state.initialPopulation || 0,
          docInBW: state.docInBW || 0,
          docInUniformity: state.docInUniformity || 0,
          farmingStatus: isEmptyString(state.closedDate || "")
            ? state.farmingStatus!
            : FARMING_STATUS.CLOSED,
          closedDate: isEmptyString(state.closedDate || "")
            ? undefined
            : state.closedDate,
        },
        farmingCycleId
      );
    },
    {
      onError: (error) => {
        console.log(error);
        dispatch({
          type: ACTION_TYPE.SET_CLOSED_DATE,
          payload: "",
        });
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        if (!state.repopulateDate && state.approvedAmount === undefined) {
          router.back();
        } else {
          farmingCycleRepopulate.mutate();
        }
      },
    }
  );

  const fcOptionsDropdown = (
    <Menu
      onClick={(e) => {
        if (e.key === "1") {
          dispatch({
            type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE,
            payload: true,
          });
        } else if (e.key === "2") {
          dispatch({
            type: ACTION_TYPE.SET_IS_REPOPULATION_MODAL_VISIBLE,
            payload: true,
          });
        }
      }}
      items={
        state.repopulateData.length > 0 ||
        state.farmingStatus !== FARMING_STATUS.IN_PROGRESS
          ? [
              {
                label: "Close Farming Cycle",
                key: "1",
              },
            ]
          : [
              {
                label: "Close Farming Cycle",
                key: "1",
              },
              {
                label: "Repopulate",
                key: "2",
              },
            ]
      }
    />
  );

  if (
    chickTypeData.isLoading ||
    availableCoopsData.isLoading ||
    pplTypeData.isLoading ||
    chickTypeData.isFetching ||
    availableCoopsData.isFetching ||
    pplTypeData.isFetching ||
    farmingCycleData.isLoading ||
    farmingCycleData.isFetching ||
    editFarmingCycle.isLoading ||
    (!state.isWantToRepopulate && editFarmingCycle.isSuccess) ||
    repopulateData.isLoading ||
    repopulateData.isFetching ||
    farmingCycleRepopulate.isLoading ||
    farmingCycleRepopulate.isSuccess
  )
    return <Loading />;

  if (
    workersData.isError ||
    pplTypeData.isError ||
    farmingCycleData.isError ||
    repopulateData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Farming Cycle"
      pageTitle={`Edit Farming Cycle - ${state.oldName}`}
      button={state.farmingStatus === FARMING_STATUS.CLOSED ? false : true}
      buttonTitle={""}
      icon={<MoreIcon />}
      buttonType="icon-outline"
      isButtonDropdown={true}
      dropdownContent={fcOptionsDropdown}
      onButtonClick={() => {}}
    >
      <Modal
        content={
          <div className="w-full h-full">
            <div className="flex flex-col items-left">
              <p className="mb-4">
                Are you sure want to close this farming cycle? Please make sure
                everything in this farming cycle is clear so you can close it.
              </p>
            </div>
            <Input
              className="w-full"
              label="Farming Cycle Close Date *"
              type="date"
              state={
                state.errorType === ERROR_TYPE.CLOSED_DATE ? "error" : "active"
              }
              errorMessage={`Please select a valid closed date (max: ${today})!`}
              value={state.closedDate}
              min={
                state.farmStartDate
                  ? new Date(
                      new Date(state.farmStartDate).getTime() +
                        1000 * 60 * 60 * 24
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              max={today}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_CLOSED_DATE,
                  payload: e.target.value,
                });
              }}
            />
          </div>
        }
        footer={
          <div className="flex flex-1 space-x-2 items-center justify-end">
            <Button
              type="outline"
              title="Cancel"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE,
                  payload: false,
                });
                dispatch({
                  type: ACTION_TYPE.SET_CLOSED_DATE,
                  payload: "",
                });
              }}
            />
            <Button
              title="Close Farming Cycle"
              size="xs"
              onClick={() => {
                const required = checkRequired({
                  dispatch,
                  state,
                  isOtherChickSupplierVisible: isOtherInputVisible,
                });
                if (!required) {
                  dispatch({
                    type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE,
                    payload: false,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CLOSED_DATE,
                    payload: "",
                  });
                  return;
                }

                if (isEmptyString(state.closedDate || "")) {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.CLOSED_DATE,
                  });
                  return;
                }

                if (
                  !isFutureDate(
                    state.closedDate || "",
                    new Date(
                      new Date(state.farmStartDate || "").getTime() +
                        1000 * 60 * 60 * 24
                    )
                      .toISOString()
                      .split("T")[0],
                    false
                  )
                ) {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.CLOSED_DATE,
                  });
                  return;
                }

                if (!isFutureDate(state.closedDate || "")) {
                  dispatch({
                    type: ACTION_TYPE.SET_FARMING_STATUS,
                    payload: FARMING_STATUS.CLOSED,
                  });
                }
                editFarmingCycle.mutate();
                dispatch({
                  type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
          </div>
        }
        title="Close Farming Cycle"
        isVisible={state.isCloseFarmingCycleModalVisible}
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_CLOSED_DATE,
            payload: "",
          });
        }}
      />
      <Modal
        content={
          <div className="w-full h-full">
            <p className="mb-4">
              Repopulation is an adjustment for the farming cycle to reduce the
              initial population because of a high mortality rate
            </p>
            <div className="flex-1 w-full mb-4">
              <Dropdown
                label="Adjustment Date &#38; Day *"
                state={
                  state.errorType === ERROR_TYPE.REPOPULATE_DATE
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the date!"
                value={state.repopulateDate}
                isSearchable={true}
                options={repoulateDateOptions}
                onChange={(item: IDropdownItem<string>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_REPOPULATE_DATE,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="flex flex-1 w-full flex-col mb-4 lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              <div className="w-full">
                <Input
                  label="Initial Population"
                  type="number"
                  step="1"
                  min="0"
                  className="w-full"
                  state="disabled"
                  value={state.initialPopulation}
                  onChange={() => {}}
                />
              </div>
              <div className="w-full">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  label="Approved Amount Population *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.APPROVED_AMOUNT
                      ? "error"
                      : "active"
                  }
                  errorMessage={`Please input a valid amount (max: ${state.initialPopulation})!`}
                  value={state.approvedAmount}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_APPROVED_AMOUNT,
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              <div className="flex-1 w-full">
                <Dropdown
                  label="Reason Repopulate *"
                  state={
                    state.errorType === ERROR_TYPE.REPOPULATE_REASON
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the reasons!"
                  value={state.repopulateReason}
                  options={reasonRepopualteOptions}
                  onChange={(item: IDropdownItem<string>) => {
                    item.value === "Other"
                      ? setIsOtherReasonInputVisible(true)
                      : setIsOtherReasonInputVisible(false);
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_REPOPULATE_REASON,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_REPOPULATE_REASON,
                      payload: item,
                    });
                  }}
                />
              </div>
              <div
                className={`flex-1 w-full ${
                  isOtherReasonInputVisible ? "" : "hidden"
                }`}
              >
                <Input
                  label="Other Reason *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.OTHER_REPOPULATE_REASON
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please input other reasons!"
                  value={state.otherRepopulateReason}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_OTHER_REPOPULATE_REASON,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-1 space-x-2 items-center justify-end">
            <Button
              type="outline"
              title="Cancel"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_IS_REPOPULATION_MODAL_VISIBLE,
                  payload: false,
                });
                setIsOtherReasonInputVisible(false);
                dispatch({
                  type: ACTION_TYPE.SET_OTHER_REPOPULATE_REASON,
                  payload: "",
                });
                dispatch({
                  type: ACTION_TYPE.SET_REPOPULATE_REASON,
                  payload: null,
                });
                dispatch({
                  type: ACTION_TYPE.SET_APPROVED_AMOUNT,
                  payload: undefined,
                });
                dispatch({
                  type: ACTION_TYPE.SET_REPOPULATE_DATE,
                  payload: null,
                });
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
              }}
            />
            <Button
              title="Save"
              size="xs"
              onClick={() => {
                const required = checkRepopulateRequirement({
                  dispatch,
                  state,
                });
                if (!required) return;
                dispatch({
                  type: ACTION_TYPE.SET_IS_REPOPULATION_MODAL_VISIBLE,
                  payload: false,
                });
                dispatch({
                  type: ACTION_TYPE.SET_IS_WANT_TO_REPOPULATE,
                  payload: true,
                });
              }}
            />
          </div>
        }
        title="Repopulation"
        isVisible={state.isRepopulationModalVisible}
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_REPOPULATION_MODAL_VISIBLE,
            payload: false,
          });
          setIsOtherReasonInputVisible(false);
          dispatch({
            type: ACTION_TYPE.SET_OTHER_REPOPULATE_REASON,
            payload: "",
          });
          dispatch({
            type: ACTION_TYPE.SET_REPOPULATE_REASON,
            payload: null,
          });
          dispatch({
            type: ACTION_TYPE.SET_APPROVED_AMOUNT,
            payload: undefined,
          });
          dispatch({
            type: ACTION_TYPE.SET_REPOPULATE_DATE,
            payload: null,
          });
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.NONE,
          });
        }}
      />
      <Modal
        content={
          <div className="w-full h-full">
            <div className="flex flex-col items-left">
              <p className="mb-4">
                After you confirm and click the “YES” button everything you fill
                in will be saved, so make sure there are no uncorrect input or
                data please recheck again!
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-1 space-x-2 items-center justify-end">
            <Button
              type="outline"
              title="No"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_IS_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
            <Button
              title="Yes"
              size="xs"
              onClick={() => {
                editFarmingCycle.mutate();
                dispatch({
                  type: ACTION_TYPE.SET_IS_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
          </div>
        }
        title="Are you sure?"
        isVisible={state.isConfirmationModalVisible}
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_CONFIRMATION_MODAL_VISIBLE,
            payload: false,
          });
        }}
      />
      <div
        className={`${
          state.farmingStatus === FARMING_STATUS.CLOSED ? "flex" : "hidden"
        } bg-orange-50 px-4 py-4 flex-row items-center justify-start rounded-md mt-4`}
      >
        <div className="mr-4 text-primary-100 text-xl">
          <WarningIcon />
        </div>
        <div className="flex-col">
          <p className="text-primary-100 font-medium">
            This farming cycle is already closed!
          </p>
          <p className="text-primary-100 font-light">
            Closed date: {state.closedDate || "-"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6 h-min">
          <div className="flex flex-col w-full space-y-6">
            <span className="font-semibold text-lg">Coop Details</span>
            {/* Coop */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Coop *"
                state={state.errorType === ERROR_TYPE.COOP ? "error" : "active"}
                errorMessage="Please select a coop!"
                value={state.coop}
                isSearchable={true}
                options={coopOptions}
                isDisabled={
                  state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
                }
                onChange={(item: IDropdownItem<TCoopResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_BRANCH,
                    payload: item.value.branch
                      ? {
                          label: `(${item.value.branch.code}) ${item.value.branch.name}`,
                          value: item.value.branch,
                        }
                      : null,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CONTRACT,
                    payload: item.value.contract
                      ? {
                          label: `(${item.value.contractType.contractName}) ${item.value.contract.code}`,
                          value: item.value.contract,
                        }
                      : null,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_COOP,
                    payload: item,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_OWNER_ID,
                    payload: item.value.ownerId || "",
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
            {/* Poultry Leader & Poultry Worker */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Poultry Leader */}
              <div className="w-full">
                <Dropdown
                  label="Poultry Leader"
                  value={state.leader}
                  isSearchable={true}
                  options={leaderOptions}
                  isDisabled={
                    state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
                  }
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
              {/* Poultry Worker */}
              <div className="w-full">
                <Dropdown
                  label="Poultry Workers"
                  value={state.workers}
                  isSearchable={true}
                  isMulti={true}
                  options={workerOptions}
                  isDisabled={
                    state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
                  }
                  onChange={(item: IDropdownItem<TUserResponse>[]) => {
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
            {/* PPL */}
            <div className="flex-1 w-full">
              <Dropdown
                label="PPL *"
                state={state.errorType === ERROR_TYPE.PPLS ? "error" : "active"}
                errorMessage="Please select the PPLs!"
                value={state.ppls}
                isSearchable={true}
                isMulti={true}
                options={pplOptions}
                isDisabled={
                  state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
                }
                onChange={(item: IDropdownItem<TUserResponse>[]) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_PPLS,
                    payload: item,
                  });
                }}
              />
            </div>
            {/* DOC BW & DOC Uniformity */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* DOC BW */}
              <div className="w-full">
                <Input
                  label="DOC BW (gr)"
                  type="number"
                  min="0"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.DOC_IN_BW
                      ? "error"
                      : state.farmingStatus === FARMING_STATUS.CLOSED
                      ? "disabled"
                      : "active"
                  }
                  errorMessage="Please input a valid BW (0-100)!"
                  value={state.docInBW}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DOC_IN_BW,
                      payload: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
              {/* DOC Uniformity */}
              <div className="w-full">
                <Input
                  label="DOC Uniformity (%)"
                  type="number"
                  min="0"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.DOC_IN_BW
                      ? "error"
                      : state.farmingStatus === FARMING_STATUS.CLOSED
                      ? "disabled"
                      : "active"
                  }
                  errorMessage="Please input a valid uniformity (0-100)!"
                  value={state.docInUniformity}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DOC_IN_UNIFORMITY,
                      payload: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <span className="font-semibold text-lg">Branch &#38; Contract</span>
            {/* Branch & Contract */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Branch */}
              <div className="w-full">
                <Dropdown
                  label="Branch"
                  isDisabled={true}
                  value={state.branch}
                  options={contractOptions}
                  onChange={() => {}}
                />
              </div>
              {/* Contract */}
              <div className="w-full">
                <Dropdown
                  label="Contract"
                  value={state.contract}
                  isDisabled={true}
                  options={contractOptions}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
          {state.repopulateData && state.repopulateData.length !== 0 ? (
            <div className="bg-blue-200 w-full rounded p-4">
              <div>
                <div className="flex flex-row items-center justify-start mb-4">
                  <InformationIcon className="text-blue-500 text-lg mr-2" />
                  <p className="font-semibold">Information</p>
                </div>
                {state.repopulateData.length &&
                  state.repopulateData.map(
                    (item: TFarmingCycleRepopulateResponse, index: number) => (
                      <div
                        key={item.id}
                        className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 mt-4"
                      >
                        <div className="w-full">
                          <div className="flex flex-row items-start">
                            <p className="font-bold ">Repopulate {index + 1}</p>
                            <p className="flex-1">
                              &nbsp;- {item.repopulateDate}
                            </p>
                          </div>
                          <div className="flex flex-row items-start">
                            <p className="w-36">Initial Population</p>
                            <p className="font-bold flex-1">
                              : {item.initialPopulation}
                            </p>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row items-start">
                            <p className="w-36">New Date</p>
                            <p className="font-bold flex-1">
                              : {item.newFarmingCycleStartDate}
                            </p>
                          </div>
                          <div className="flex flex-row items-start">
                            <p className="w-36">New Population</p>
                            <p className="font-bold flex-1">
                              : {item.newInitialPopulation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <span className="font-semibold text-lg">Chick-in Details</span>
          {/* Farming Start Date */}
          <div className="flex-1 w-full">
            <Input
              className="w-full"
              label="Farming Start Date *"
              type="date"
              max={today}
              state={
                state.farmingStatus === FARMING_STATUS.CLOSED
                  ? "disabled"
                  : state.errorType === ERROR_TYPE.FARM_START_DATE
                  ? "error"
                  : "active"
              }
              errorMessage={`Please select a valid start date (max: ${today})!`}
              value={state.farmStartDate}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_FARM_START_DATE,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          {/* Chick Type & Initial Population */}
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            {/* Chick Type */}
            <div className="w-full">
              <Dropdown
                label="Chick Type *"
                state={
                  state.errorType === ERROR_TYPE.CHICK_TYPE ? "error" : "active"
                }
                errorMessage="Please select a chick type!"
                isDisabled={
                  state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
                }
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
            {/* Initial Population */}
            <div className="w-full">
              <Input
                label="Initial Population"
                type="number"
                step="1"
                min="0"
                className="w-full"
                state="disabled"
                hintMessage={
                  state.repopulateData && state.repopulateData.length !== 0
                    ? "Has been edited for repopulate!"
                    : undefined
                }
                value={state.initialPopulation}
                onChange={() => {}}
              />
            </div>
          </div>
          {/* Chick Type Supplier */}
          <div className="flex-1 w-full">
            <Dropdown
              label="Chick Supplier *"
              state={
                state.errorType === ERROR_TYPE.CHICK_SUPPLIER_TYPE
                  ? "error"
                  : "active"
              }
              isDisabled={
                state.farmingStatus === FARMING_STATUS.CLOSED ? true : false
              }
              errorMessage="Please select a chick supplier!"
              value={state.chickSupplierType}
              options={chickSupplierOptions}
              isSearchable={true}
              onChange={(item: IDropdownItem<string>) => {
                if (item.value === "Other") {
                  setIsOtherInputVisible(true);
                } else {
                  setIsOtherInputVisible(false);
                }
                dispatch({
                  type: ACTION_TYPE.SET_OTHER_CHICK_SUPPLIER_TYPE,
                  payload: "",
                });
                dispatch({
                  type: ACTION_TYPE.SET_CHICK_SUPPLIER_TYPE,
                  payload: item,
                });
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
              }}
            />
          </div>
          <div
            className={`flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 ${
              isOtherInputVisible ? "" : "hidden"
            }`}
          >
            <div
              className={`flex-1 w-full ${
                isOtherInputVisible ? "" : "invisible"
              }`}
            >
              <Input
                label="Other Chick Supplier *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.OTHER_CHICK_SUPPLIER_TYPE
                    ? "error"
                    : "active"
                }
                errorMessage="Please input other chick supplier!"
                value={state.otherChickSupplierType}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_OTHER_CHICK_SUPPLIER_TYPE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          {/* Hatchery */}
          <div className="flex-1 w-full">
            <Input
              label="Hatchery *"
              className="w-full"
              state={
                state.farmingStatus === FARMING_STATUS.CLOSED
                  ? "disabled"
                  : state.errorType === ERROR_TYPE.HATCHERY
                  ? "error"
                  : "active"
              }
              errorMessage="Please input a hatchery!"
              value={state.hatchery}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_HATCHERY,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          {/* Remarks */}
          <div className="w-full h-full">
            <Input
              label="Remarks"
              type="textarea"
              state={
                state.farmingStatus === FARMING_STATUS.CLOSED
                  ? "disabled"
                  : "active"
              }
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
          state={editFarmingCycle.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title={
            state.farmingStatus === FARMING_STATUS.CLOSED ? "Back" : "Cancel"
          }
        />
        {state.farmingStatus === FARMING_STATUS.CLOSED ? null : (
          <Button
            size="xs"
            state={editFarmingCycle.isLoading ? "loading" : "active"}
            onClick={() => {
              const required = checkRequired({
                dispatch,
                state,
                isOtherChickSupplierVisible: isOtherInputVisible,
              });
              if (!required) return;
              dispatch({
                type: ACTION_TYPE.SET_IS_CONFIRMATION_MODAL_VISIBLE,
                payload: true,
              });
            }}
            title="Save Farming Cycle"
          />
        )}
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
