import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { CHICK_SUPPLIER, CONTRACT, USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getAvailableCoops,
  getChickenStrains,
  getUsers,
  postCreateFarmingCycle,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./create.constants";
import { checkRequired, setErrorText } from "./create.functions";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const [isOtherInputVisible, setIsOtherInputVisible] = useState(false);

  const today = new Date();

  // NOTE: Min start date for new farming cycle is 7 days from today
  const minStartDate = new Date(
    new Date().setDate(today.getDate() - 7)
  ).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
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

  const createFarmingCycle = useMutation(
    ["createFarmingCycle"],
    async () => {
      let pplIds: string[] = [];
      state.ppls &&
        state.ppls.length &&
        state.ppls.map((item: IDropdownItem<TUserResponse>) =>
          pplIds.push(item.value.id)
        );

      let workerIds: string[] = [];
      state.workers &&
        state.workers.map((item: IDropdownItem<TUserResponse>) =>
          workerIds.push(item.value.id)
        );

      await postCreateFarmingCycle({
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
      });
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  if (
    createFarmingCycle.isLoading ||
    createFarmingCycle.isSuccess ||
    chickTypeData.isLoading ||
    availableCoopsData.isLoading
  )
    return <Loading />;
  if (workersData.isError || pplTypeData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Create New Farming Cycle"
      pageTitle="New Farming Cycle"
    >
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
                    state.errorType === ERROR_TYPE.DOC_IN_UNIFORMITY
                      ? "error"
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
                  isDisabled={true}
                  value={state.contract}
                  options={contractOptions}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <span className="font-semibold text-lg">Chick-in Details</span>
          {/* Farming Start Date */}
          <div className="flex-1 w-full">
            <Input
              className="w-full"
              label="Farming Start Date *"
              type="date"
              state={
                state.errorType === ERROR_TYPE.FARM_START_DATE
                  ? "error"
                  : "active"
              }
              errorMessage="Please select the farming cycle start date!"
              value={state.farmStartDate}
              min={minStartDate}
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
                label="Initial Population *"
                type="number"
                step="1"
                min="0"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.INITIAL_POPULATION
                    ? "error"
                    : "active"
                }
                errorMessage="Please input an initial population (>= 1000)!"
                value={state.initialPopulation}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_INITIAL_POPULATION,
                    payload: parseInt(e.target.value),
                  });
                }}
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
                errorMessage="Please input an other chick supplier!"
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
                state.errorType === ERROR_TYPE.HATCHERY ? "error" : "active"
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
          state={createFarmingCycle.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={createFarmingCycle.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({
              dispatch,
              state,
              isOtherChickSupplierVisible: isOtherInputVisible,
            });
            if (!required) return;

            createFarmingCycle.mutate();
          }}
          title="Create Farming Cycle"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
