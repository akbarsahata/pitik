import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getBranches,
  getContractMitraGaransi,
  getCoopContractMitraGaransiDetail,
  putEditContractMitraGaransi,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { formatDateWithoutClock } from "@services/utils/date";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import { TInsentiveDealsPayload, TSapronakPayload } from "@type/payload.type";
import {
  TBranchResponse,
  TContractBranchDetail,
  TContractResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import {
  ACTION_TYPE,
  ERROR_TYPE,
  store,
  TChickenPricePayload,
} from "./detail.constants";
import {
  checkRequired,
  setErrorText,
  setMitraGaransiInitialData,
} from "./detail.functions";
import { reducer } from "./detail.reducer";

const Detail: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const contractId = decodeString(router.query.id as string);

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item: TBranchResponse) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  const branchData: UseQueryResult<
    { data: { data: TGetManyResponse<TBranchResponse[]> } },
    AxiosError
  > = useQuery(["branchData"], async () => await getBranches(), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const branchList = data.data.data || [];
      dispatch({
        type: ACTION_TYPE.SET_BRANCH_DATA,
        payload: branchList,
      });
    },
  });

  const confirmationDataModal = useMutation(
    ["confirmationDataModal"],
    async () =>
      await getCoopContractMitraGaransiDetail(state.branch?.value.id || ""),
    {
      onError: (error: AxiosError) => {
        if (error.response?.status === 404) {
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.NONE,
          });
          dispatch({
            type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
            payload: true,
          });
        } else {
          console.log(error);
          setErrorText({ dispatch, error });
        }
      },
      onSuccess: () => {
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.NONE,
        });
        dispatch({
          type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
          payload: true,
        });
      },
    }
  );

  const contractData: UseQueryResult<
    { data: TGetManyResponse<TContractResponse> },
    AxiosError
  > = useQuery(
    ["contractData"],
    async () => await getContractMitraGaransi(contractId),
    {
      enabled: !!state.branchData.length,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        setMitraGaransiInitialData({
          dispatch,
          data: data.data,
          state,
        });
      },
    }
  );

  const editMitraGaransi = useMutation(
    ["editMitraGaransi"],
    async () =>
      await putEditContractMitraGaransi(
        {
          customize: false,
          branchId: state.branch ? state.branch.value.id : "",
          effectiveStartDate: state.effectiveStartDate,
          sapronak: state.sapronak,
          chickenPrice: state.chickenPrice,
          insentiveDeals: state.insentiveDeals,
          saving: state.saving,
          deductionDueToFarmingCycleLoss: state.deductionDueToFarmingCycleLoss,
          contractMarketInsentive: state.contractMarketInsentive,
        },
        contractId
      ),
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
    editMitraGaransi.isSuccess ||
    editMitraGaransi.isLoading ||
    branchData.isLoading ||
    contractData.isLoading
  )
    return <Loading />;

  if (branchData.isError || contractData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Contract Mitra Garansi"
      pageTitle="Edit Contract Mitra Garansi"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          {/* Branch & Effective Start Date */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">
              Branch Details &#38; Effective Start Date
            </p>
            {/* Branch Name */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Branch Name *"
                isDisabled={true}
                errorMessage="Please select the branch!"
                value={state.branch}
                options={branchOptions}
                isSearchable={true}
                onChange={(item: IDropdownItem<TBranchResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_BRANCH,
                    payload: item,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                }}
              />
            </div>
            {/* Effective Start Date */}
            <div className="flex-1 w-full">
              <Input
                className="w-full text-gray-500"
                type="date"
                label="Effective Start Date *"
                state="disabled"
                errorMessage="Please select effective start date!"
                value={state.effectiveStartDate}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_EFFECTIVE_START_DATE,
                    payload: e.target.value,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                }}
              />
            </div>
          </div>
          {/* Sapronak Price (DOC, Feed, OVK) */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Sapronak Price</p>
            {/* DOC */}
            <div className="flex flex-col w-full space-y-6">
              <p className="font-semibold text-xs">DOC</p>
              {/* DOC */}
              <div className="flex-1 w-full">
                <Input
                  label="DOC *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/ekor'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input a DOC!"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "DOC" &&
                          item.subcategoryCode === "DOC"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "DOC" &&
                          item.subcategoryCode === "DOC"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* DOC + Vaccine*/}
              <div className="flex-1 w-full">
                <Input
                  label="DOC + Vaccine *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/ekor'] text-gray-500"
                  type="number"
                  errorMessage="Please input a DOC + Vaccine!"
                  state="disabled"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "DOC" &&
                          item.subcategoryCode === "DOC+VACCINE"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "DOC" &&
                          item.subcategoryCode === "DOC+VACCINE"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* Feed */}
            <div className="flex flex-col w-full space-y-6">
              <p className="font-semibold text-xs">Feed</p>
              {/* Pre-Starter */}
              <div className="flex-1 w-full">
                <Input
                  label="Pre-Starter *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a pre-starter!"
                  state="disabled"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "PRESTARTER"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "PRESTARTER"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Starter */}
              <div className="flex-1 w-full">
                <Input
                  label="Starter *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a starter!"
                  state="disabled"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "STARTER"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "STARTER"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Finisher */}
              <div className="flex-1 w-full">
                <Input
                  label="Finisher *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a finisher!"
                  state="disabled"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "FINISHER"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "FINISHER"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* OVK */}
            <div className="flex flex-col w-full space-y-6">
              <p className="font-semibold text-xs">OVK</p>
              {/* OVK Markup Percentage */}
              <div className="flex-1 w-full">
                <Input
                  label="OVK Markup Percentage *"
                  className="w-full pr-2 after:content-['%'] text-gray-500"
                  type="number"
                  errorMessage={
                    state.errorType === ERROR_TYPE.OVK_OVK
                      ? "Please input an ovk markup percentage!"
                      : state.errorType === ERROR_TYPE.OVK_OVK_INVALID
                      ? "Please input a number between 0-100!"
                      : ""
                  }
                  state="disabled"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "OVK" &&
                          item.subcategoryCode === "OVK"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.sapronak];
                    arr[
                      arr.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "OVK" &&
                          item.subcategoryCode === "OVK"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_SAPRONAK,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          {/* Chicken Price */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Chicken Price</p>
            {/* BW < 0.8 */}
            <div className="flex-1 w-full">
              <Input
                label="BW < 0.8 *"
                className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                type="number"
                errorMessage="Please input chicken price!"
                state="disabled"
                value={
                  state.chickenPrice[
                    state.chickenPrice.findIndex(
                      (item: TChickenPricePayload) =>
                        item.lowerRange === "0" && item.upperRange === "0.8"
                    )
                  ]?.price || 0
                }
                onChange={(e) => {
                  let arr = [...state.chickenPrice];
                  arr[
                    arr.findIndex(
                      (item: TChickenPricePayload) =>
                        item.lowerRange === "0" && item.upperRange === "0.8"
                    )
                  ].price = parseFloat(e.target.value);
                  dispatch({
                    type: ACTION_TYPE.SET_CHICKEN_PRICE,
                    payload: arr,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                }}
              />
            </div>
            {/* BW 0.8 - 1.09 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 0.8 - 0.99 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 0.8 - 0.99 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "0.8" &&
                          item.upperRange === "0.99"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "0.8" &&
                          item.upperRange === "0.99"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 1.00 - 1.09 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.00 - 1.09 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.00" &&
                          item.upperRange === "1.09"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.00" &&
                          item.upperRange === "1.09"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 1.10 - 1.29 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 1.10 - 1.19 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.10 - 1.19 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.10" &&
                          item.upperRange === "1.19"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.10" &&
                          item.upperRange === "1.19"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 1.20 - 1.29 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.20 - 1.29 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.20" &&
                          item.upperRange === "1.29"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.20" &&
                          item.upperRange === "1.29"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 1.30 - 1.49 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 1.30 - 1.39 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.30 - 1.39 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.30" &&
                          item.upperRange === "1.39"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.30" &&
                          item.upperRange === "1.39"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 1.40 - 1.49 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.40 - 1.49 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.40" &&
                          item.upperRange === "1.49"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.40" &&
                          item.upperRange === "1.49"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 1.50 - 1.69 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 1.50 - 1.59 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.50 - 1.59 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.50" &&
                          item.upperRange === "1.59"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.50" &&
                          item.upperRange === "1.59"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 1.60 - 1.69 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.60 - 1.69 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.60" &&
                          item.upperRange === "1.69"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.60" &&
                          item.upperRange === "1.69"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 1.70 - 1.89 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 1.70 - 1.79 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.70 - 1.79 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.70" &&
                          item.upperRange === "1.79"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.70" &&
                          item.upperRange === "1.79"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 1.80 - 1.89 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.80 - 1.89 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.80" &&
                          item.upperRange === "1.89"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.80" &&
                          item.upperRange === "1.89"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 1.90 - 2.09 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 1.90 - 1.99 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 1.90 - 1.99 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.90" &&
                          item.upperRange === "1.99"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "1.90" &&
                          item.upperRange === "1.99"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 2.00 - 2.09 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 2.00 - 2.09 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.00" &&
                          item.upperRange === "2.09"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.00" &&
                          item.upperRange === "2.09"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* BW 2.10 - >2.20 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 2.10 - 2.19 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 2.10 - 2.19 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.10" &&
                          item.upperRange === "2.19"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.10" &&
                          item.upperRange === "2.19"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 2.20 - 2.29 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 2.20 - 2.29 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.20" &&
                          item.upperRange === "2.29"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.20" &&
                          item.upperRange === "2.29"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>

            {/* BW 2.30 - >2.40 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* BW 2.30 - 2.39 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 2.30 - 2.39 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.30" &&
                          item.upperRange === "2.39"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.30" &&
                          item.upperRange === "2.39"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* BW 2.40 - 2.50 */}
              <div className="flex-1 w-full">
                <Input
                  label="BW 2.40 - 2.50 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a chicken price!"
                  state="disabled"
                  value={
                    state.chickenPrice[
                      state.chickenPrice.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.40" &&
                          item.upperRange === "2.50"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.chickenPrice];
                    arr[
                      arr.findIndex(
                        (item: TChickenPricePayload) =>
                          item.lowerRange === "2.40" &&
                          item.upperRange === "2.50"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CHICKEN_PRICE,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* Incentive Deals */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Incentive Deal</p>
            {/* IP 300 - 319 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* IP 300 - 309 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 300 - 309 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input an incentive deal!"
                  state="disabled"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "300" && item.upperIp === "309"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "300" && item.upperIp === "309"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_INSENTIVE_DEALS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* IP 310 - 319 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 310 - 319 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input an incentive deal!"
                  state="disabled"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "310" && item.upperIp === "319"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "310" && item.upperIp === "319"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_INSENTIVE_DEALS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
            {/* IP 320 - >330 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* IP 320 - 329 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 320 - 329 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input an incentive deal!"
                  state="disabled"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "320" && item.upperIp === "329"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "320" && item.upperIp === "329"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_INSENTIVE_DEALS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* IP > 330 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP > 330 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input an incentive deal!"
                  state="disabled"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "330" && item.upperIp === "up"
                      )
                    ]?.price || 0
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "330" && item.upperIp === "up"
                      )
                    ].price = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_INSENTIVE_DEALS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* Saving */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Saving</p>
            {/* Saving Percentage & Minimum Profit */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Saving Percentage */}
              <div className="flex-1 w-full">
                <Input
                  label="Saving Percentage *"
                  className="w-full pr-2 after:content-['%'] text-gray-500"
                  type="number"
                  errorMessage={
                    state.errorType === ERROR_TYPE.SAVING_PERCENTAGE
                      ? "Please input a saving percentage!"
                      : state.errorType === ERROR_TYPE.SAVING_PERCENTAGE_INVALID
                      ? "Please input a number between 0-100!"
                      : ""
                  }
                  state="disabled"
                  value={state.saving.precentage}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_SAVING,
                      payload: {
                        ...state.saving,
                        precentage: parseFloat(e.target.value),
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Minimum Profit */}
              <div className="flex-1 w-full">
                <Input
                  label="Minimum Profit *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a minimum profit!"
                  state="disabled"
                  value={state.saving.minimumProfit}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_SAVING,
                      payload: {
                        ...state.saving,
                        minimumProfit: parseFloat(e.target.value),
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* Deduction Due To Farming Cycle Loss */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">
              Deduction Due To Farming Cycle Loss
            </p>
            {/* Deduction Percentage & Minimum Profit */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Deduction Percentage */}
              <div className="flex-1 w-full">
                <Input
                  label="Deduction Percentage *"
                  className="w-full pr-2 after:content-['%'] text-gray-500"
                  type="number"
                  errorMessage={
                    state.errorType ===
                    ERROR_TYPE.DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE
                      ? "Please input a deduction percentage!"
                      : state.errorType ===
                        ERROR_TYPE.DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE_INVALID
                      ? "Please input a number between 0-100!"
                      : ""
                  }
                  state="disabled"
                  value={state.deductionDueToFarmingCycleLoss.precentage}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS,
                      payload: {
                        ...state.deductionDueToFarmingCycleLoss,
                        precentage: parseFloat(e.target.value),
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Minimum Profit */}
              <div className="flex-1 w-full">
                <Input
                  label="Minimum Profit *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  errorMessage="Please input a minimum profit!"
                  state="disabled"
                  value={state.deductionDueToFarmingCycleLoss.minimumProfit}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS,
                      payload: {
                        ...state.deductionDueToFarmingCycleLoss,
                        minimumProfit: parseFloat(e.target.value),
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* Market Incentive */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Market Incentive</p>
            {/* Range IP & Incentive Percentage */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Range IP */}
              <div className="flex-1 w-full">
                <Input
                  label="Range IP"
                  className="w-full text-gray-500"
                  type="number"
                  state="disabled"
                  value={state.contractMarketInsentive.rangeIp}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE,
                      payload: {
                        ...state.contractMarketInsentive,
                        rangeIp: e.target.value,
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Incentive Percentage */}
              <div className="flex-1 w-full">
                <Input
                  label="Incentive Percentage"
                  className="w-full pr-2 after:content-['%'] text-gray-500"
                  type="number"
                  max="100"
                  state="disabled"
                  errorMessage="Please input a number between 0-100!"
                  value={
                    state.contractMarketInsentive.insentivePrecentage ||
                    undefined
                  }
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE,
                      payload: {
                        ...state.contractMarketInsentive,
                        insentivePrecentage: parseFloat(e.target.value),
                      },
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
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
          state={confirmationDataModal.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Back"
        />
        <Button
          size="xs"
          className="hidden"
          state={confirmationDataModal.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            confirmationDataModal.mutate();
          }}
          title="Edit Contract"
        />
      </div>

      <Modal
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
            payload: false,
          });
        }}
        footer={
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              type="outline"
              title="Cancel"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
            <Button
              title="Yes"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });

                editMitraGaransi.mutate();
              }}
            />
          </div>
        }
        title="Confirmation Edit Contract"
        isVisible={state.confirmationModalVisible}
        content={
          <div>
            {confirmationDataModal.data?.data.data.length > 0 ? (
              <div>
                <p className="mb-2">
                  This contract will replace the customized contract that was
                  created in the following coop:
                </p>
                <ul className="list-disc list-inside ml-5">
                  {confirmationDataModal.data?.data.data.map(
                    (item: TContractBranchDetail) => (
                      <li key={item.id}>{`${
                        item.coopName
                      } (Start date: ${formatDateWithoutClock(
                        item.startDate
                      )}, ${item.contractType})`}</li>
                    )
                  )}
                </ul>
                <p className="mt-2">
                  You need to create another custom contract for the coop above
                  (if necessary)
                </p>
              </div>
            ) : (
              <div>
                <p>
                  Are you sure want to create this contract? please make sure
                  your data is correct!
                </p>
              </div>
            )}
          </div>
        }
      />
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Detail;
