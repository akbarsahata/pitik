import Error from "@components/wrappers/Error/Error";
import Button from "@components/atoms/Button/Button";
import Input from "@components/atoms/Input/Input";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import DeleteIcon from "@icons/DeleteIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getDetailHarvestRealization,
  getFarmingCycleHarvestDetail,
  putDraftHarvestRealization,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { isEmptyString, randomHexString } from "@services/utils/string";
import {
  TGetByIdResponse,
  TGetManyResponse,
  THarvestDetailResponse,
  THarvestRealizationDetailResponse,
  TRealizationRecord,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import {
  ACTIONS,
  ERROR_TYPE,
  initialState,
  TWeighingDataPayload,
} from "./edit.constants";
import {
  checkRequired,
  handleOnChangeTotalHarvest,
  setErrorText,
  setHarvestRealizationInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";
import { REALIZATION_STATUS } from "@constants/index";
import Modal from "@components/atoms/Modal/Modal";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const farmingCycleId = decodeString(router.query.farmingCycleId as string);
  const realizationId = decodeString(router.query.realizationId as string);

  const today = new Date();
  // NOTE: Min start date for new farming cycle is 7 days from today
  const minStartDate = new Date(
    new Date().setDate(today.getDate() - 7)
  ).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const detailHarvestRealizationData: UseQueryResult<
    { data: TGetByIdResponse<THarvestRealizationDetailResponse> },
    AxiosError
  > = useQuery(
    ["detailData"],
    async () =>
      await getDetailHarvestRealization(farmingCycleId, realizationId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const detailData: THarvestRealizationDetailResponse = data.data;

        setHarvestRealizationInitialData({
          dispatch,
          data: detailData,
          state,
        });
        dispatch({
          type: ACTIONS.SET_DETAIL_REALIZATION_DATA,
          payload: { data: detailData },
        });
      },
    }
  );

  const detailsData: UseQueryResult<
    { data: TGetManyResponse<THarvestDetailResponse> },
    AxiosError
  > = useQuery(
    ["detailsData"],
    async () => await getFarmingCycleHarvestDetail(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const details: THarvestDetailResponse = data.data;
        dispatch({
          type: ACTIONS.SET_DETAIL_HARVEST_DATA,
          payload: { data: details },
        });
      },
    }
  );

  const editHarvestRealization: any = useMutation(
    ["editHarvestRealization"],
    async (status: "DRAFT" | "FINAL" | "DELETED") => {
      let recordsData: {
        id?: string | undefined;
        quantity: number | null;
        tonnage: number | null;
      }[] = [];
      state.records.map((record: TRealizationRecord) =>
        recordsData.push({
          id: record.id,
          quantity: record.quantity,
          tonnage: record.tonnage,
        })
      );
      await putDraftHarvestRealization(
        {
          status: status,
          date: state.date,
          bakulName: state.harvestBasketName,
          deliveryOrder: state.deliveryOrder,
          truckLicensePlate: state.truckLicensePlate,
          driver: state.driver,
          weighingNumber: state.weighingNumber,
          records: recordsData,
        },
        farmingCycleId,
        realizationId
      );
    },
    {
      onError: (error: any) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        dispatch({
          type: ACTIONS.SET_WEIGHING_DATA,
          payload: { data: [] },
        });
        router.back();
      },
    }
  );
  if (
    detailHarvestRealizationData.isLoading ||
    detailHarvestRealizationData.isFetching
  )
    return <Loading />;
  if (detailHarvestRealizationData.isError || editHarvestRealization.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle={`Harvest - ${state.detailData.date}`}
      pageTitle={`Harvest - ${state.detailData.date}`}
    >
      <Modal
        content={
          <div className="w-full h-full">
            <div className="flex flex-col items-left">
              <label className="mb-4">
                Do you want to save the realization data as draft?
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="save-final"
                  name="save-final"
                  checked={state.saveAsFinal}
                  disabled={
                    state.total.quantity +
                      (state.detailHarvestData.harvest.total.quantity || 0) >
                    (state.detailHarvestData.initialPopulation || 0)
                  }
                  onChange={() => {
                    dispatch({
                      type: ACTIONS.SET_SAVE_AS_FINAL,
                      payload: { data: !state.saveAsFinal },
                    });
                  }}
                />
                <label htmlFor="save-final" className="ml-2">
                  No, Save as Final
                </label>
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
                  type: ACTIONS.SET_IS_CONFIRMATION_MODAL_VISIBLE,
                  payload: { data: false },
                });
              }}
            />
            <Button
              title="Save"
              size="xs"
              state={editHarvestRealization.isLoading ? "loading" : "active"}
              onClick={() => {
                dispatch({
                  type: ACTIONS.SET_IS_CONFIRMATION_MODAL_VISIBLE,
                  payload: { data: false },
                });
                editHarvestRealization.mutate(
                  state.saveAsFinal
                    ? REALIZATION_STATUS.FINAL
                    : REALIZATION_STATUS.DRAFT
                );
              }}
            />
          </div>
        }
        title="Confirmation"
        isVisible={state.isConfirmationModalVisible}
        onCancel={() => {
          dispatch({
            type: ACTIONS.SET_IS_CONFIRMATION_MODAL_VISIBLE,
            payload: { data: false },
          });
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="w-full">
            {/* Harvest Date */}
            <Input
              className="w-full"
              label="Harvest Date *"
              type="date"
              state={
                state.errorType === ERROR_TYPE.DATE
                  ? "error"
                  : state.detailData.status !== REALIZATION_STATUS.DRAFT
                  ? "disabled"
                  : "active"
              }
              errorMessage="Harvest date is required!"
              value={state.date}
              min={minStartDate}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_ERROR_TYPE,
                  payload: { data: ERROR_TYPE.NONE },
                });
                dispatch({
                  type: ACTIONS.SET_DATE,
                  payload: { data: e.target.value },
                });
              }}
            />
          </div>
          <div className="w-full">
            {/* Bakul/Customer Name */}
            <Input
              label="Bakul/Customer Name *"
              className="w-full"
              state={
                state.errorType === ERROR_TYPE.HARVEST_BASKET_NAME
                  ? "error"
                  : state.detailData.status !== REALIZATION_STATUS.DRAFT
                  ? "disabled"
                  : "active"
              }
              errorMessage={
                state.harvestBasketName.length > 100
                  ? "Bakul/Customer Name reach maximum 100 characters"
                  : "Bakul/Customer Name is required!"
              }
              value={state.harvestBasketName}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_ERROR_TYPE,
                  payload: { data: ERROR_TYPE.NONE },
                });
                dispatch({
                  type: ACTIONS.SET_HARVEST_BASKET_NAME,
                  payload: { data: e.target.value },
                });
              }}
            />
          </div>
          <div className="w-full">
            {/* Number of Delivery Order */}
            <Input
              label="No. Do *"
              className="w-full"
              state={
                state.errorType === ERROR_TYPE.DELIVERY_ORDER
                  ? "error"
                  : state.detailData.status !== REALIZATION_STATUS.DRAFT
                  ? "disabled"
                  : "active"
              }
              errorMessage={
                state.deliveryOrder.length > 20
                  ? "No. Do reaches maximum 20 characters!"
                  : "No. Do is required!"
              }
              value={state.deliveryOrder}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_ERROR_TYPE,
                  payload: { data: ERROR_TYPE.NONE },
                });
                dispatch({
                  type: ACTIONS.SET_DELIVERY_ORDER,
                  payload: { data: e.target.value },
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              {/* Nomor Polisi Kendaraan */}
              <Input
                label="Nomor Polisi Truck *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.TRUCK_LICENSE_PLATE
                    ? "error"
                    : state.detailData.status !== REALIZATION_STATUS.DRAFT
                    ? "disabled"
                    : "active"
                }
                errorMessage={
                  isEmptyString(state.truckLicensePlate)
                    ? "Nomor Polisi Truck is required!"
                    : state.truckLicensePlate.length < 4
                    ? "Nomor Polisi Truck reaches minimum 4 characters!"
                    : "Nomor Polisi Truck reaches maximum 12 characters!"
                }
                value={state.truckLicensePlate}
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.SET_ERROR_TYPE,
                    payload: { data: ERROR_TYPE.NONE },
                  });
                  dispatch({
                    type: ACTIONS.SET_TRUCK_LICENSE_PLATE,
                    payload: { data: e.target.value },
                  });
                }}
              />
            </div>
            <div className="w-full">
              {/* Driver Name */}
              <Input
                label="Driver Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.DRIVER_NAME
                    ? "error"
                    : state.detailData.status !== REALIZATION_STATUS.DRAFT
                    ? "disabled"
                    : "active"
                }
                errorMessage={
                  state.driver.length > 100
                    ? "Driver Name reaches maximum 100 characters!"
                    : "Driver Name is required!"
                }
                value={state.driver}
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.SET_ERROR_TYPE,
                    payload: { data: ERROR_TYPE.NONE },
                  });
                  dispatch({
                    type: ACTIONS.SET_DRIVER,
                    payload: { data: e.target.value },
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full">
            {/* Nomor Data Timbang */}
            <Input
              label="No. Data Timbang *"
              className="w-full"
              state={
                state.errorType === ERROR_TYPE.WEIGHING_NUMBER
                  ? "error"
                  : state.detailData.status !== REALIZATION_STATUS.DRAFT
                  ? "disabled"
                  : "active"
              }
              errorMessage={
                state.weighingNumber.length > 20
                  ? "No. Data Timbang reaches maximum 20 characters!"
                  : "No. Data Timbang is required!"
              }
              value={state.weighingNumber}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_ERROR_TYPE,
                  payload: { data: ERROR_TYPE.NONE },
                });
                dispatch({
                  type: ACTIONS.SET_WEIGHING_NUMBER,
                  payload: { data: e.target.value },
                });
              }}
            />
          </div>
          <p className="font-semibold text-lg">Data Timbang Summary</p>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              {/* Total Harvest in Ekor */}
              <Input
                label="Total Harvest (ekor) *"
                className="w-full pr-2 after:content-['ekor']"
                type="number"
                placeholder={
                  state.total.quantity > 0
                    ? "Enter total harvest"
                    : "Auto generated"
                }
                state="disabled"
                value={state.total.quantity > 0 ? state.total.quantity : ""}
              />
            </div>
            <div className="w-full">
              {/* Total Harvest in Kilograms */}
              <Input
                label="Total Harvest (kg) *"
                className="w-full pr-2 after:content-['kg']"
                placeholder={
                  state.total.tonnage > 0
                    ? "Enter total harvest"
                    : "Auto generated"
                }
                state="disabled"
                value={
                  state.total.tonnage > 0 ? state.total.tonnage.toFixed(2) : ""
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full space-y-6 h-full">
        <div className="space-y-2">
          <p className="font-semibold text-lg">Data Timbang Details</p>
          <div className="space-y-0">
            <p className="text-gray-400">
              Please enter the weight data for each row based on the information
              provided in the Kartu Timbang
            </p>
            <p className="italic text-gray-500">
              Note that if the weight data is in decimal form, use a dot (.) as
              the decimal separator
            </p>
          </div>
        </div>
        {
          <div>
            <div className="flex flex-row w-full space-x-2  font-medium text-gray-500">
              {state.detailData.status !== REALIZATION_STATUS.FINAL && (
                <div className="w-16">
                  <p>Actions</p>
                </div>
              )}
              <div className="flex-1">
                <p>Total Harvest (ekor) *</p>
              </div>
              <div className="flex-1">
                <p>Total Harvest (kg) *</p>
              </div>
            </div>
            <div className="mt-6 md:space-y-4">
              {state.records?.map(
                (dataTimbang: TWeighingDataPayload, index: number) => (
                  <div
                    key={dataTimbang.id}
                    className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0"
                  >
                    {state.detailData.status !== REALIZATION_STATUS.FINAL && (
                      <div className="w-12 flex items-start justify-center">
                        <Button
                          type="icon-outline"
                          size="lg"
                          icon={
                            <DeleteIcon
                              className={"text-red-500 group-hover:text-white"}
                            />
                          }
                          state={
                            state.detailData.status !== REALIZATION_STATUS.DRAFT
                              ? "disabled"
                              : state.records
                              ? "active"
                              : "disabled"
                          }
                          className={"hover:!bg-red-500 group !border-red-500"}
                          onClick={() => {
                            const filteredData = state.records.filter(
                              (e: TWeighingDataPayload) =>
                                e.id !== dataTimbang.id
                            );
                            handleOnChangeTotalHarvest(
                              "quantity",
                              0,
                              dataTimbang,
                              state,
                              dispatch
                            );
                            handleOnChangeTotalHarvest(
                              "tonnage",
                              0,
                              dataTimbang,
                              state,
                              dispatch
                            );
                            dispatch({
                              type: ACTIONS.SET_WEIGHING_DATA,
                              payload: {
                                data: filteredData,
                              },
                            });
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      {/* Total Harvest in Ekor */}
                      <Input
                        id={`quantity-${index}`}
                        className="w-full pr-2 after:content-['ekor']"
                        type="number"
                        state={
                          state.detailData.status === REALIZATION_STATUS.FINAL
                            ? "disabled"
                            : "active"
                        }
                        placeholder="Type here"
                        value={
                          state.records[
                            state.records.findIndex(
                              (data: TWeighingDataPayload) =>
                                data.id === dataTimbang.id
                            )
                          ].quantity
                        }
                        onChange={(e) => {
                          dispatch({
                            type: ACTIONS.SET_ERROR_TYPE,
                            payload: { data: ERROR_TYPE.NONE },
                          });
                          handleOnChangeTotalHarvest(
                            "quantity",
                            parseInt(e.target.value),
                            dataTimbang,
                            state,
                            dispatch
                          );
                        }}
                        onKeyDown={(event) => {
                          if (event.key === ",") {
                            event.preventDefault();
                            event.target.value += ".";
                          }
                        }}
                      />
                    </div>

                    <div className="flex-1 w-full">
                      {/* Total Harvest in Kg */}
                      <Input
                        id={`tonnage-${index}`}
                        state={
                          state.detailData.status !== REALIZATION_STATUS.DRAFT
                            ? "disabled"
                            : "active"
                        }
                        className="w-full pr-2 after:content-['kg']"
                        placeholder="Type here"
                        value={
                          parseFloat(
                            state.records[
                              state.records.findIndex(
                                (data: TWeighingDataPayload) =>
                                  data.id === dataTimbang.id
                              )
                            ]?.tonnage
                              ?.toString()
                              ?.replace(",", ".")
                          ) || ""
                        }
                        onChange={(event) => {
                          handleOnChangeTotalHarvest(
                            "tonnage",
                            parseFloat(event.target.value),
                            dataTimbang,
                            state,
                            dispatch
                          );
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Period" || event.key === ".") {
                            event.preventDefault();
                            event.target.value += ".";
                          }
                          if (event.key === "Enter") {
                            event.preventDefault();
                            const currentTonnageIndex = state.records.findIndex(
                              (data: TWeighingDataPayload) =>
                                data.id === dataTimbang.id
                            );

                            let newArr = state.records;
                            newArr.splice(currentTonnageIndex + 1, 0, {
                              id: randomHexString(),
                              quantity:
                                state.records[
                                  state.records.findIndex(
                                    (data: TWeighingDataPayload) =>
                                      data.id === dataTimbang.id
                                  )
                                ].quantity,
                              tonnage: null,
                            });

                            dispatch({
                              type: ACTIONS.SET_WEIGHING_DATA,
                              payload: {
                                data: newArr,
                              },
                            });
                            setTimeout(() => {
                              const nextTonnageIndex = currentTonnageIndex + 1;
                              const nextTonnageElement =
                                document.getElementById(
                                  `tonnage-${nextTonnageIndex}`
                                );
                              if (nextTonnageElement) {
                                nextTonnageElement.focus();
                              }
                            }, 100);
                            handleOnChangeTotalHarvest(
                              "tonnage",
                              parseFloat(event.target.value),
                              dataTimbang,
                              state,
                              dispatch
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        }
        <div className="flex justify-end items-center mt-8 space-x-1">
          <Button
            title="Add"
            size="xs"
            className={`${
              state.detailData.status !== REALIZATION_STATUS.DRAFT && "hidden"
            }`}
            onClick={() => {
              let newArr = state.records;
              newArr.push({
                id: randomHexString(),
                quantity: null,
                tonnage: null,
              });
              dispatch({
                type: ACTIONS.SET_WEIGHING_DATA,
                payload: {
                  data: newArr,
                },
              });
              setTimeout(() => {
                const elementQuantity = document.getElementById(
                  `quantity-${newArr.length - 1}`
                );

                if (elementQuantity) {
                  elementQuantity.focus();
                }
              }, 100);
            }}
          />
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
          state={detailHarvestRealizationData.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => {
            dispatch({
              type: ACTIONS.SET_WEIGHING_DATA,
              payload: { data: [] },
            });
            router.back();
          }}
          title={
            state.detailData.status === REALIZATION_STATUS.FINAL
              ? "Back"
              : "Cancel"
          }
        />
        <Button
          size="xs"
          className={`${
            state.detailData.status !== REALIZATION_STATUS.DRAFT && "hidden"
          }`}
          state={editHarvestRealization.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            dispatch({
              type: ACTIONS.SET_IS_CONFIRMATION_MODAL_VISIBLE,
              payload: { data: true },
            });
          }}
          title="Save Realization"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
