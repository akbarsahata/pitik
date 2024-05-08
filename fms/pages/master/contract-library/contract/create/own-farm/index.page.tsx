import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import DeleteIcon from "@icons/DeleteIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getCoopContractOwnFarmDetail,
  getCoops,
  postCreateContractOwnFarm,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { formatDateWithoutClock } from "@services/utils/date";
import { randomHexString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TBopTermPayload } from "@type/payload.type";
import {
  TContractBranchDetail,
  TCoopResponse,
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
  TBopDetails,
} from "./create.constants";
import { checkRequired, setErrorText } from "./create.functions";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  let bopOptions: IDropdownItem<number>[] = [];
  state.bopTermOptions.map((item: number) =>
    bopOptions.push({
      value: item,
      label: `D-(${item})`,
    })
  );

  let farmerTermOptions: IDropdownItem<number>[] = [];
  state.farmerTermOptions.map((item: number) =>
    farmerTermOptions.push({
      value: item,
      label: `D-(${item})`,
    })
  );

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item: TCoopResponse) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
    })
  );

  const confirmationDataModal = useMutation(
    ["confirmationDataModal"],
    async () => await getCoopContractOwnFarmDetail(state.coop?.value.id || ""),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
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

  const createOwnFarm = useMutation(
    ["createOwnFarm"],
    async () => {
      let bopPayload: {
        id: string;
        preConditions: string;
        bop: string;
        amount: number;
        paymentTerm: string;
      }[] = [];
      state.bopDetails.map((item: TBopDetails) => {
        bopPayload.push({
          id: item.id,
          preConditions: item.preConditions,
          bop: item.bop,
          amount: item.amount,
          paymentTerm: item.paymentTerm ? `D${item.paymentTerm.value}` : "",
        });
      });
      let paymentTermsPayload: {
        paymentTerm: string;
        amount: number;
      }[] = [];
      state.paymentTerms.map((item: TBopTermPayload) => {
        paymentTermsPayload.push({
          paymentTerm: `D${item.paymentTerm?.value}`,
          amount: item.amount,
        });
      });

      await postCreateContractOwnFarm({
        customize: false,
        coopId: state.coop ? state.coop.value.id : "",
        effectiveStartDate: state.effectiveStartDate,
        bop: bopPayload,
        paymentTerms: paymentTermsPayload,
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

  const coopData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["coopData"],
    async () =>
      await getCoops({
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
        const coopList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_DATA,
          payload: coopList,
        });
      },
    }
  );

  if (createOwnFarm.isSuccess || createOwnFarm.isLoading || coopData.isLoading)
    return <Loading />;
  if (coopData.isError) return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="New Own Farm Contract"
      pageTitle="Create New Own Farm Contract"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          {/* Coop & Effective Start Date */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">
              Coop Details &#38; Effective Start Date
            </p>
            {/* Coop */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Coop *"
                state={state.errorType === ERROR_TYPE.COOP ? "error" : "active"}
                errorMessage="Please select the coop!"
                value={state.coop}
                options={coopOptions}
                isSearchable={true}
                onChange={(item: IDropdownItem<TCoopResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_COOP,
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
                className="w-full"
                type="date"
                label="Effective Start Date *"
                state={
                  state.errorType === ERROR_TYPE.EFFECTIVE_START_DATE
                    ? "error"
                    : "active"
                }
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
          {/* BOP Details */}
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">BOP Details</p>
            {/* BOP 1 */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Amount */}
              <div className="flex-1 w-full">
                <Input
                  label="Amount of BOP 1 *"
                  className="w-full px-2 before:content-['Rp'] text-gray-700"
                  type="number"
                  state={
                    state.errorType === ERROR_TYPE.BOP_1_AMOUNT
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the BOP 1's amount!"
                  value={
                    state.bopDetails[
                      state.bopDetails.findIndex(
                        (item: TBopDetails) => item.bop === "1"
                      )
                    ].amount
                  }
                  onChange={(e) => {
                    let arr = [...state.bopDetails];
                    arr[arr.findIndex((item) => item.bop === "1")].amount =
                      parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_DETAILS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Payment Term */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Payment term of BOP 1 *"
                  state={
                    state.errorType === ERROR_TYPE.BOP_1_TERM
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the BOP 1's payment term!"
                  options={bopOptions}
                  isSearchable={true}
                  value={
                    state.bopDetails[
                      state.bopDetails.findIndex(
                        (item: TBopDetails) => item.bop === "1"
                      )
                    ].paymentTerm
                  }
                  onChange={(item: IDropdownItem<number>) => {
                    const opts = [...state.bopTermOptions];
                    const index = opts.indexOf(item.value);
                    if (index > -1) {
                      opts.splice(index, 1);
                    }
                    const data =
                      state.bopDetails[
                        state.bopDetails.findIndex(
                          (item: TBopDetails) => item.bop === "1"
                        )
                      ];
                    data.paymentTerm && opts.push(data.paymentTerm.value);

                    dispatch({
                      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS,
                      payload: opts.sort((a, b) => a - b),
                    });

                    let arr = [...state.bopDetails];
                    arr[arr.findIndex((item) => item.bop === "1")].paymentTerm =
                      item;
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_DETAILS,
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
              {/* Amount */}
              <div className="flex-1 w-full">
                <Input
                  label="Amount of BOP 2 *"
                  className="w-full px-2 before:content-['Rp'] text-gray-700"
                  state={
                    state.errorType === ERROR_TYPE.BOP_2_AMOUNT
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the BOP 2's amount!"
                  type="number"
                  value={
                    state.bopDetails[
                      state.bopDetails.findIndex(
                        (item: TBopDetails) => item.bop === "2"
                      )
                    ].amount
                  }
                  onChange={(e) => {
                    let arr = [...state.bopDetails];
                    arr[arr.findIndex((item) => item.bop === "2")].amount =
                      parseFloat(e.target.value);
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_DETAILS,
                      payload: arr,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                  }}
                />
              </div>
              {/* Payment Term */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Payment term of BOP 2 *"
                  state={
                    state.errorType === ERROR_TYPE.BOP_2_TERM
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the BOP 2's payment term!"
                  options={bopOptions}
                  isSearchable={true}
                  value={
                    state.bopDetails[
                      state.bopDetails.findIndex(
                        (item: TBopDetails) => item.bop === "2"
                      )
                    ].paymentTerm
                  }
                  onChange={(item: IDropdownItem<number>) => {
                    const opts = [...state.bopTermOptions];
                    const index = opts.indexOf(item.value);
                    if (index > -1) {
                      opts.splice(index, 1);
                    }
                    const data =
                      state.bopDetails[
                        state.bopDetails.findIndex(
                          (item: TBopDetails) => item.bop === "2"
                        )
                      ];
                    data.paymentTerm && opts.push(data.paymentTerm.value);

                    dispatch({
                      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS,
                      payload: opts.sort((a, b) => a - b),
                    });

                    let arr = [...state.bopDetails];
                    arr[arr.findIndex((item) => item.bop === "2")].paymentTerm =
                      item;
                    dispatch({
                      type: ACTION_TYPE.SET_BOP_DETAILS,
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
          {/* Terms Details */}
          <div className="flex flex-col w-full space-y-6 h-full">
            <p className="font-semibold text-md">
              Payment Terms To The Farmers
            </p>

            <div className="mt-6 overflow-x-auto h-full">
              <div>
                <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                  <div className="w-16">
                    <p>Actions</p>
                  </div>
                  <div className="flex-1">
                    <p>Amounts *</p>
                  </div>
                  <div className="flex-1">
                    <p>Terms *</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {state.paymentTerms.map((term: TBopTermPayload) => (
                    <div key={term.id} className="flex flex-row space-x-2">
                      <div className="w-16 flex items-center justify-center">
                        <Button
                          type="icon-outline"
                          state={
                            state.paymentTerms.length <= 1
                              ? "disabled"
                              : "active"
                          }
                          size="md"
                          icon={
                            <DeleteIcon className="text-red-500 group-hover:text-white" />
                          }
                          className={`!border-red-500 ${
                            state.paymentTerms.length > 1 &&
                            "hover:!bg-red-500 group"
                          }`}
                          onClick={() => {
                            const filteredData = state.paymentTerms.filter(
                              (e) => e.id !== term.id
                            );
                            dispatch({
                              type: ACTION_TYPE.SET_PAYMENT_TERMS,
                              payload: filteredData,
                            });
                          }}
                        />
                      </div>

                      {/* Amount */}
                      <div className="flex-1 w-full">
                        <Input
                          className="w-full px-2 before:content-['Rp'] after:content-['/ekor'] text-gray-700"
                          type="number"
                          value={
                            state.paymentTerms[
                              state.paymentTerms.findIndex(
                                (data: TBopTermPayload) => data.id === term.id
                              )
                            ].amount
                          }
                          onChange={(e) => {
                            state.paymentTerms.map((item: TBopTermPayload) => {
                              if (term.id === item.id) {
                                let newArr = [...state.paymentTerms];
                                newArr[
                                  newArr.findIndex(
                                    (data) => data.id === item.id
                                  )
                                ].amount = parseFloat(e.target.value);
                                dispatch({
                                  type: ACTION_TYPE.SET_PAYMENT_TERMS,
                                  payload: newArr,
                                });
                              }
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                          }}
                        />
                      </div>
                      {/* Payment Term */}
                      <div className="flex-1 w-full">
                        <Dropdown
                          value={
                            state.paymentTerms[
                              state.paymentTerms.findIndex(
                                (data: TBopTermPayload) => data.id === term.id
                              )
                            ].paymentTerm
                          }
                          options={farmerTermOptions}
                          isSearchable={true}
                          onChange={(dropdownItem: IDropdownItem<number>) => {
                            const currentData =
                              state.paymentTerms[
                                state.paymentTerms.findIndex(
                                  (data: TBopTermPayload) => data.id === term.id
                                )
                              ];
                            const opts = [...state.farmerTermOptions];
                            const index = opts.indexOf(dropdownItem.value);
                            if (index > -1) {
                              opts.splice(index, 1);
                            }
                            currentData.paymentTerm &&
                              opts.push(currentData.paymentTerm.value);

                            dispatch({
                              type: ACTION_TYPE.SET_FARMER_TERM_OPTIONS,
                              payload: opts.sort((a, b) => a - b),
                            });

                            state.paymentTerms.map((item: TBopTermPayload) => {
                              if (term.id === item.id) {
                                let newArr = [...state.paymentTerms];
                                newArr[
                                  newArr.findIndex(
                                    (data) => data.id === item.id
                                  )
                                ].paymentTerm = dropdownItem;
                                dispatch({
                                  type: ACTION_TYPE.SET_PAYMENT_TERMS,
                                  payload: newArr,
                                });
                              }
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {state.paymentTerms.length >= 5 ? null : (
                <div className="flex justify-end items-center mt-8 space-x-1">
                  <Button
                    title="Add New Term"
                    size="xs"
                    onClick={() => {
                      let newArr = [...state.paymentTerms];
                      newArr.push({
                        id: randomHexString(),
                        paymentTerm: null,
                        amount: 0,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_PAYMENT_TERMS,
                        payload: newArr,
                      });
                    }}
                  />
                </div>
              )}
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
          title="Cancel"
        />
        <Button
          size="xs"
          state={confirmationDataModal.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            confirmationDataModal.mutate();
          }}
          title="Create Contract"
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

                createOwnFarm.mutate();
              }}
            />
          </div>
        }
        title="Confirmation Create Contract"
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

// If you want to activate your own farm page, you can check isAuthenticate to take out redirect to dashboard.
export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
