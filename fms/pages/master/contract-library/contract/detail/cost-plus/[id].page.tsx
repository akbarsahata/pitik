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
  getContractCostPlus,
  getCoopContractCostPlusDetail,
  putEditContractCostPlus,
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
  TMarginCostPlusBop,
} from "./detail.constants";
import {
  checkRequired,
  setCostPlusInitialData,
  setErrorText,
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

  let bopOptions: IDropdownItem<number>[] = [];
  state.bopTermOptions.map((item: number) =>
    bopOptions.push({
      value: item,
      label: `D-(${item})`,
    })
  );

  const contractData: UseQueryResult<
    { data: TGetManyResponse<TContractResponse> },
    AxiosError
  > = useQuery(
    ["contractData"],
    async () => await getContractCostPlus(contractId),
    {
      enabled: !!state.branchData.length,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        setCostPlusInitialData({
          dispatch,
          data: data.data,
          state,
        });
      },
    }
  );

  const confirmationDataModal = useMutation(
    ["confirmationDataModal"],
    async () =>
      await getCoopContractCostPlusDetail(state.branch?.value.id || ""),
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

  const editCostPlus = useMutation(
    ["editCostPlus"],
    async () => {
      let bopPayload: {
        id: string;
        preConditions: string;
        bop: string;
        amount: number;
        paymentTerm: string;
      }[] = [];
      state.marginCostPlusBop.map((item: TMarginCostPlusBop) => {
        bopPayload.push({
          id: item.id,
          preConditions: item.preConditions.toString(),
          bop: item.bop,
          amount: item.amount,
          paymentTerm: item.paymentTerm ? `D${item.paymentTerm.value}` : "",
        });
      });
      await putEditContractCostPlus(
        {
          customize: false,
          branchId: state.branch ? state.branch.value.id : "",
          effectiveStartDate: state.effectiveStartDate,
          sapronak: state.sapronak,
          bop: bopPayload,
          insentiveDeals: state.insentiveDeals,
          contractDeductionFcBop: state.contractDeductionFcBop,
          contractMarketInsentive: {
            rangeIp: state.contractMarketInsentive.rangeIp,
            insentivePrecentage:
              state.contractMarketInsentive.insentivePrecentage,
          },
        },
        contractId
      );
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

  if (branchData.isError || contractData.isError)
    return <Error router={router} />;

  if (
    branchData.isLoading ||
    branchData.isFetching ||
    contractData.isLoading ||
    contractData.isFetching ||
    editCostPlus.isLoading ||
    editCostPlus.isSuccess
  )
    return <Loading />;

  if (branchData.isError || contractData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Contract Cost Plus" pageTitle="Contract Cost Plus">
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
                    ]?.price
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
                  state="disabled"
                  errorMessage="Please input a DOC + Vaccine!"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "DOC" &&
                          item.subcategoryCode === "DOC+VACCINE"
                      )
                    ]?.price
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
                  state="disabled"
                  errorMessage="Please input a pre-starter!"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "PRESTARTER"
                      )
                    ]?.price
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
                  state="disabled"
                  errorMessage="Please input a starter!"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "STARTER"
                      )
                    ]?.price
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
                  state="disabled"
                  errorMessage="Please input a finisher!"
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "FEED" &&
                          item.subcategoryCode === "FINISHER"
                      )
                    ]?.price
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
                  state="disabled"
                  errorMessage={
                    state.errorType === ERROR_TYPE.OVK_OVK
                      ? "Please input an ovk markup percentage!"
                      : state.errorType === ERROR_TYPE.OVK_OVK_INVALID
                      ? "Please input a number between 0-100!"
                      : ""
                  }
                  value={
                    state.sapronak[
                      state.sapronak.findIndex(
                        (item: TSapronakPayload) =>
                          item.categoryCode === "OVK" &&
                          item.subcategoryCode === "OVK"
                      )
                    ]?.price
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
          {/* Margin Cost Plus */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Margin Cost Plus</p>
            {/* BOP 1 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Amount BOP 1 */}
              <div className="flex-1 w-full">
                <Input
                  label="Amount of BOP 1 *"
                  className="w-full pl-2 before:content-['Rp'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an amount of BOP 1!"
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "1"
                      )
                    ]?.amount
                  }
                  onChange={(e) => {
                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "1")].amount =
                      parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Payment BOP 1 */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Payment term of BOP 1 *"
                  isDisabled={true}
                  errorMessage="Please select the BOP 1 payment term!"
                  options={bopOptions}
                  isSearchable={true}
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "1"
                      )
                    ]?.paymentTerm || null
                  }
                  onChange={(item: IDropdownItem<number>) => {
                    const opts = [...state.bopTermOptions];
                    const index = opts.indexOf(item.value);
                    if (index > -1) {
                      opts.splice(index, 1);
                    }
                    const data =
                      state.marginCostPlusBop[
                        state.marginCostPlusBop.findIndex(
                          (item: TMarginCostPlusBop) => item.bop === "1"
                        )
                      ];
                    data.paymentTerm && opts.push(data.paymentTerm.value);

                    dispatch({
                      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS,
                      payload: opts.sort((a, b) => a - b),
                    });

                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "1")].paymentTerm =
                      item;
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
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
            {/* BOP 2 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Amount BOP 2 */}
              <div className="flex-1 w-full">
                <Input
                  label="Amount of BOP 2 *"
                  className="w-full pl-2 before:content-['Rp'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an amount of BOP 2!"
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "2"
                      )
                    ]?.amount
                  }
                  onChange={(e) => {
                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "2")].amount =
                      parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Payment BOP 2 */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Payment term of BOP 2 *"
                  isDisabled={true}
                  errorMessage="Please select the BOP 2's payment term!"
                  options={bopOptions}
                  isSearchable={true}
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "2"
                      )
                    ]?.paymentTerm || null
                  }
                  onChange={(item: IDropdownItem<number>) => {
                    const opts = [...state.bopTermOptions];
                    const index = opts.indexOf(item.value);
                    if (index > -1) {
                      opts.splice(index, 1);
                    }
                    const data =
                      state.marginCostPlusBop[
                        state.marginCostPlusBop.findIndex(
                          (item: TMarginCostPlusBop) => item.bop === "2"
                        )
                      ];
                    data.paymentTerm && opts.push(data.paymentTerm.value);
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS,
                      payload: opts.sort((a, b) => a - b),
                    });

                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "2")].paymentTerm =
                      item;
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
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
            {/* BOP 3 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Amount BOP 3 */}
              <div className="flex-1 w-full">
                <Input
                  label="Amount of BOP 3 *"
                  className="w-full pl-2 before:content-['Rp'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an amount of BOP 3!"
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "3"
                      )
                    ]?.amount
                  }
                  onChange={(e) => {
                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "3")].amount =
                      parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Payment BOP 3 */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Payment term of BOP 3 *"
                  isDisabled={true}
                  errorMessage="Please select the BOP 3's payment term!"
                  options={bopOptions}
                  isSearchable={true}
                  value={
                    state.marginCostPlusBop[
                      state.marginCostPlusBop.findIndex(
                        (item: TMarginCostPlusBop) => item.bop === "3"
                      )
                    ]?.paymentTerm || null
                  }
                  onChange={(item: IDropdownItem<number>) => {
                    const opts = [...state.bopTermOptions];
                    const index = opts.indexOf(item.value);
                    if (index > -1) {
                      opts.splice(index, 1);
                    }
                    const data =
                      state.marginCostPlusBop[
                        state.marginCostPlusBop.findIndex(
                          (item: TMarginCostPlusBop) => item.bop === "3"
                        )
                      ];
                    data.paymentTerm && opts.push(data.paymentTerm.value);
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS,
                      payload: opts.sort((a, b) => a - b),
                    });

                    let arr = [...state.marginCostPlusBop];
                    arr[arr.findIndex((item) => item.bop === "3")].paymentTerm =
                      item;
                    dispatch({
                      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
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
            {/* Precondition of BOP 3 - Minimum IP */}
            <div className="flex-1 w-full">
              <Input
                label="Precondition of BOP 3 - Minimum IP *"
                className="w-full text-gray-500"
                type="number"
                state="disabled"
                errorMessage="Please input a precondition!"
                value={
                  state.marginCostPlusBop[
                    state.marginCostPlusBop.findIndex(
                      (item: TMarginCostPlusBop) => item.bop === "3"
                    )
                  ]?.preConditions
                }
                onChange={(e) => {
                  let arr = [...state.marginCostPlusBop];
                  arr[arr.findIndex((item) => item.bop === "3")].preConditions =
                    parseInt(e.target.value);
                  dispatch({
                    type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP,
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
          {/* Incentive Deals */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Incentive Deal</p>
            {/* IP 331 - 360 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* IP 331 - 340 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 331 - 340 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an IP!"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "331" && item.upperIp === "340"
                      )
                    ]?.price
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "331" && item.upperIp === "340"
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
              {/* IP 341 - 360 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 341 - 360 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an IP!"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "341" && item.upperIp === "360"
                      )
                    ]?.price
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "341" && item.upperIp === "360"
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
            {/* IP 361 - 400 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* IP 361 - 380 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 361 - 380 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an IP!"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "361" && item.upperIp === "380"
                      )
                    ]?.price
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "361" && item.upperIp === "380"
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
              {/* IP 381 - 400 */}
              <div className="flex-1 w-full">
                <Input
                  label="IP 381 - 400 *"
                  className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                  type="number"
                  state="disabled"
                  errorMessage="Please input an IP!"
                  value={
                    state.insentiveDeals[
                      state.insentiveDeals.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "381" && item.upperIp === "400"
                      )
                    ]?.price
                  }
                  onChange={(e) => {
                    let arr = [...state.insentiveDeals];
                    arr[
                      arr.findIndex(
                        (item: TInsentiveDealsPayload) =>
                          item.lowerIp === "381" && item.upperIp === "400"
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
            {/* IP > 401 */}
            <div className="flex-1 w-full">
              <Input
                label="IP > 401 *"
                className="w-full px-2 before:content-['Rp'] after:content-['/kg'] text-gray-500"
                type="number"
                state="disabled"
                errorMessage="Please input an IP!"
                value={
                  state.insentiveDeals[
                    state.insentiveDeals.findIndex(
                      (item: TInsentiveDealsPayload) =>
                        item.lowerIp === "401" && item.upperIp === "up"
                    )
                  ]?.price
                }
                onChange={(e) => {
                  let arr = [...state.insentiveDeals];
                  arr[
                    arr.findIndex(
                      (item: TInsentiveDealsPayload) =>
                        item.lowerIp === "401" && item.upperIp === "up"
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
          {/* Deduction Due To Farming Cycle Loss */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">
              Deduction Due To Farming Cycle Loss
            </p>
            {/* Loss Deduction BOP 2 & 3 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Loss Deduction BOP 2 */}
              <div className="flex-1 w-full">
                <Input
                  label="Loss Deduction BOP 2"
                  className="w-full px-2 before:content-['Rp'] after:content-['/Ekor'] text-gray-500"
                  type="number"
                  state="disabled"
                  value={
                    state.contractDeductionFcBop[
                      state.contractDeductionFcBop.findIndex(
                        (item) => item.bop === "1"
                      )
                    ]?.lossDeductionBop
                  }
                  onChange={(e) => {
                    let arr = [...state.contractDeductionFcBop];
                    arr[
                      arr.findIndex((item) => item.bop === "1")
                    ].lossDeductionBop = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CONTRACT_DEDUCTION_FC_BOP,
                      payload: arr,
                    });
                  }}
                />
              </div>
              {/* Loss Deduction BOP 3 */}
              <div className="flex-1 w-full">
                <Input
                  label="Loss Deduction BOP 3"
                  className="w-full px-2 before:content-['Rp'] after:content-['/Ekor'] text-gray-500"
                  type="number"
                  state="disabled"
                  value={
                    state.contractDeductionFcBop[
                      state.contractDeductionFcBop.findIndex(
                        (item) => item.bop === "2"
                      )
                    ]?.lossDeductionBop
                  }
                  onChange={(e) => {
                    let arr = [...state.contractDeductionFcBop];
                    arr[
                      arr.findIndex((item) => item.bop === "2")
                    ].lossDeductionBop = parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_CONTRACT_DEDUCTION_FC_BOP,
                      payload: arr,
                    });
                  }}
                />
              </div>
            </div>
            {/* Loss Deduction from Profit */}
            <div className="flex-1 w-full">
              <Input
                label="Loss Deduction from Profit"
                className="w-full px-2 after:content-['%'] text-gray-500"
                type="number"
                state="disabled"
                errorMessage={
                  state.errorType ===
                  ERROR_TYPE.LOSS_DEDUCTION_FROM_PROFIT_INVALID
                    ? "Maximum value of Loss Deduction from Profit is 100!"
                    : ""
                }
                value={
                  state.contractDeductionFcBop[
                    state.contractDeductionFcBop.findIndex(
                      (item) => item.bop === "3"
                    )
                  ]?.lossDeductionProfit
                }
                onChange={(e) => {
                  let arr = [...state.contractDeductionFcBop];
                  arr[
                    arr.findIndex((item) => item.bop === "3")
                  ].lossDeductionProfit = parseFloat(e.target.value);
                  dispatch({
                    type: ACTION_TYPE.SET_CONTRACT_DEDUCTION_FC_BOP,
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
                  min="0"
                  max="100"
                  state="disabled"
                  errorMessage="Please input a valid percentage!"
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

                editCostPlus.mutate();
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
