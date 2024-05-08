import Button from "@components/atoms/Button/Button";
import Modal from "@components/atoms/Modal/Modal";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import { DEVICE_TYPE } from "@constants/index";
import DeleteIcon from "@icons/DeleteIcon.svg";
import EditIcon from "@icons/EditIcon.svg";
import PlusIcon from "@icons/PlusIcon.svg";
import R0Icon from "@icons/R0Icon.svg";
import UploadIcon from "@icons/UploadIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  deleteDevicesSensor,
  getCoops,
  getDevicesSensor,
  getDeviceTypes,
  getFarms,
  getFirmware,
  postAssignOtas,
  postSetAmmonia,
} from "@services/api";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TCoopResponse,
  TDevicesSensorResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  TFirmwareSensorResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { Key, useReducer } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { columns } from "./device.columns";
import { ACTION_TYPE, ERROR_TYPE, search, store } from "./device.constants";
import DeleteModal from "./device.delete";
import { setErrorText } from "./device.functions";
import AssignOtaModal from "./device.modal";
import { reducer } from "./device.reducer";
import AdvanceSearch from "./device.search";

export default function Device() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, store);
  const router = useRouter();

  const onSelectChange = (keys: Key[], data: TDevicesSensorResponse[]) => {
    dispatch({
      type: ACTION_TYPE.SET_SELECTED_DEVICES,
      payload: data,
    });
    dispatch({
      type: ACTION_TYPE.SET_SELECTED_ROW_KEYS,
      payload: keys,
    });
  };

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange,
  };

  const tableData: UseQueryResult<
    { data: TGetManyResponse<TDevicesSensorResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getDevicesSensor({
        page: state.tablePage,
        limit: 10,
        farmId:
          state.search.farm === null ||
          isEmptyString(state.search.farm.value.id)
            ? undefined
            : state.search.farm.value.id,
        coopId:
          state.search.coop === null ||
          isEmptyString(state.search.coop.value.id)
            ? undefined
            : state.search.coop.value.id,
        deviceType:
          state.search.deviceType === null ||
          isEmptyString(state.search.deviceType.value.value)
            ? undefined
            : state.search.deviceType.value.value,
        mac: isEmptyString(state.search.macAddress || "")
          ? undefined
          : state.search.macAddress?.toLowerCase() || "",
        deviceId: isEmptyString(state.search.deviceId || "")
          ? undefined
          : state.search.deviceId,
        phoneNumber: isEmptyString(state.search.phoneNumber || "")
          ? undefined
          : state.search.phoneNumber,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const onPage = Math.ceil(data.count / 10);
        if (onPage === state.tablePage) {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage,
          });
        }
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

  const farmData: UseQueryResult<
    { data: TGetManyResponse<TFarmResponse[]> },
    AxiosError
  > = useQuery(
    ["farmData"],
    async () =>
      await getFarms({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const farmList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FARM_DATA,
          payload: farmList,
        });
      },
    }
  );

  const deviceTypeData: UseQueryResult<
    { data: TGetManyResponse<TDeviceTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["deviceTypeData"],
    async () =>
      await getDeviceTypes({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE_DATA,
          payload: deviceTypeList,
        });
      },
    }
  );

  const firmwareData: UseQueryResult<
    { data: TGetManyResponse<TFirmwareSensorResponse[]> },
    AxiosError
  > = useQuery(["firmwareData"], async () => await getFirmware({}), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const firmwareList = data.data || [];
      dispatch({
        type: ACTION_TYPE.SET_FIRMWARE_DATA,
        payload: firmwareList,
      });
    },
  });

  const deleteDevice = useMutation(
    ["deleteDevice"],
    async () => await deleteDevicesSensor(state.deletedDeviceId),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        dispatch({
          type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
          payload: false,
        });
        queryClient.invalidateQueries("getTableData");
      },
    }
  );

  const assignOtas = useMutation(
    ["assignOtas"],
    async () => {
      let devices: string[] = [];
      state.selectedRowKeys &&
        state.selectedRowKeys.map((key: Key) => {
          const currentRecord =
            tableData.data?.data.data[
              tableData.data?.data.data.findIndex((item) => item.id === key)
            ];
          devices.push(currentRecord?.id as string);
        });
      await postAssignOtas({
        firmwareId: state.firmware?.value.id || "",
        deviceIds: devices,
      });
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.GENERAL,
        });
      },
      onSuccess: () => {
        dispatch({
          type: ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE,
          payload: false,
        });
        queryClient.invalidateQueries("getTableData");
      },
    }
  );

  const postSetR0 = useMutation(
    ["postSetR0"],
    async () => {
      await postSetAmmonia(state.triggerR0);
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
        dispatch({
          type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE,
          payload: true,
        });
      },
      onSuccess: () => {
        dispatch({
          type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE,
          payload: false,
        });
        queryClient.invalidateQueries("getTableData");
      },
    }
  );

  if (tableData.isLoading) return <Loading />;
  if (
    coopData.isError ||
    farmData.isError ||
    tableData.isError ||
    firmwareData.isError ||
    deviceTypeData.isError
  )
    return <Error router={router} />;
  return (
    <div>
      <AssignOtaModal
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.NONE,
          });
          assignOtas.mutate();
        }}
        assignOtas={assignOtas}
      />
      <DeleteModal
        deleteDevice={deleteDevice}
        state={state}
        dispatch={dispatch}
        onClickOk={() => {
          deleteDevice.mutate();
        }}
      />
      <TableBar
        isResetAllButtonVisible={state.search === search ? false : true}
        onClickResetSearch={() => {
          dispatch({ type: ACTION_TYPE.RESET_SEARCH, payload: null });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: true,
          })
        }
        addNewButtonLeadIcon={<PlusIcon />}
        addNewButtonTitle="Add Device"
        onClickAddNew={() =>
          router.push("/iot/climate-monitoring/device/create")
        }
        secondaryButtonLeadIcon={<UploadIcon />}
        secondaryButtonTitle="OTA Update"
        secondaryButtonState={
          state.selectedRowKeys.length <= 0 ? "disabled" : "active"
        }
        onClickSecondary={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE,
            payload: true,
          });
        }}
      />
      <Table
        rowSelection={rowSelection}
        scrollX={3600}
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 160,
            key: "action",
            render: (record: TDevicesSensorResponse) => (
              <div className="flex flex-row items-center justify-start mb-2">
                <div className="w-12 pl-1 flex items-center justify-start">
                  <Button
                    type="icon-outline"
                    title="Edit"
                    size="sm"
                    icon={<EditIcon />}
                    isAnchor={true}
                    href={
                      "/iot/climate-monitoring/device/edit/" +
                      encodeString(record.id)
                    }
                  />
                </div>
                <div className="w-12 pl-1 flex items-center justify-start">
                  <Button
                    type="icon-outline"
                    title="Delete"
                    size="sm"
                    icon={
                      <DeleteIcon className="text-red-500 group-hover:text-white" />
                    }
                    className="!border-red-500 hover:!bg-red-500 group"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_DELETED_DEVICE_ID,
                        payload: record.id,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
                        payload: true,
                      });
                    }}
                  />
                </div>
                {record.deviceType === DEVICE_TYPE.SMART_MONITORING ? (
                  <div className="w-12 pl-1 flex items-center justify-start">
                    <Button
                      type="icon-outline"
                      title="R0"
                      size="sm"
                      icon={<R0Icon />}
                      onClick={() => {
                        console.log(record.mac);

                        dispatch({
                          type: ACTION_TYPE.SET_TRIGGER_R0,
                          payload: record.mac,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE,
                          payload: true,
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 pl-1 flex items-center justify-start">
                    <button className="flex flex-row items-center justify-between border cursor-not-allowed bg-white border-gray-400 text-gray-400 p-2.5 rounded-lg">
                      <div className="flex-1 flex flex-row justify-start items-center">
                        <R0Icon />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ),
          },
          ...columns,
        ]}
        tablePage={state.tablePage}
        isLastPage={state.isLastPage}
        onClickNext={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage + 1,
          })
        }
        onClickPrevious={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage - 1,
          })
        }
      />

      <Modal
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE,
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
                  type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE,
                  payload: false,
                });

                postSetR0.reset();
              }}
            />
            <Button
              state={postSetR0.isLoading ? "loading" : "active"}
              title="Yes"
              size="xs"
              onClick={() => {
                postSetR0.mutate();
              }}
            />
          </div>
        }
        title="Confirmation Trigger R0"
        isVisible={state.isConfirmR0ModalVisible}
        content={
          <div className="flex flex-col space-y-2">
            <p>Are you sure you want to trigger R0 for this device?</p>
            <div
              className={`${
                postSetR0.isError ? "flex" : "hidden"
              } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4 w-full`}
            >
              <div className="mr-2 text-red-500 text-xl">
                <WarningIcon />
              </div>
              <p className="text-red-500">Failed: ${state.errorText}</p>
            </div>
          </div>
        }
      />

      <AdvanceSearch
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: 1,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH,
            payload: state.inputSearch,
          });
        }}
      />
    </div>
  );
}
