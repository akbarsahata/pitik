import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import DeleteIcon from "@icons/DeleteIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getAlertPreset,
  getAlerts,
  getCoopTypes,
  putEditAlertPreset,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TAlertPresetResponse,
  TAlertResponse,
  TCoopTypeResponse,
  TGetByIdResponse,
} from "@type/response.type";
import { Table, Tabs } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { columns } from "./edit.columns";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  setAlertPresetInitialData,
  setErrorText,
} from "./edit.functions";
import AlertModal from "./edit.modal";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const alertPresetId = decodeString(router.query.id as string);

  let coopTypeOptions: IDropdownItem<TCoopTypeResponse>[] = [];
  state.coopTypeData.map((item: TCoopTypeResponse) =>
    coopTypeOptions.push({
      value: item,
      label: `(${item.coopTypeCode}) ${item.coopTypeName}`,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  const coopTypeData: UseQueryResult<
    { data: TGetByIdResponse<TCoopTypeResponse[]> },
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

  const alertData: UseQueryResult<
    { data: TGetByIdResponse<TAlertResponse[]> },
    AxiosError
  > = useQuery(
    ["alertData"],
    async () =>
      await getAlerts({
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
        const alertList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_ALERT_LIST_DATA,
          payload: alertList,
        });
      },
    }
  );

  const alertPresetData: UseQueryResult<
    { data: TGetByIdResponse<TAlertPresetResponse> },
    AxiosError
  > = useQuery(
    ["alertPresetData"],
    async () => await getAlertPreset(alertPresetId),
    {
      enabled: !!coopTypeData,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: ({ data }) => {
        setAlertPresetInitialData({
          dispatch,
          data: data.data,
        });
      },
    }
  );

  const editAlertPreset = useMutation(
    ["editAlertPreset"],
    async () =>
      await putEditAlertPreset(
        {
          alertPresetCode: state.alertPresetCode,
          alertPresetName: state.alertPresetName,
          coopTypeId: state.coopType ? state.coopType.value.id : "",
          remarks: state.remarks,
          status: state.status ? state.status.value : true,
          alertIds: state.alertIds,
        },
        alertPresetId
      ),
    {
      onError: (error: AxiosError) => {
        console.log(error.response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  if (
    alertPresetData.isFetching ||
    editAlertPreset.isSuccess ||
    coopTypeData.isLoading ||
    alertPresetData.isLoading
  )
    return <Loading />;
  if (coopTypeData.isError || alertData.isError || alertPresetData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Alert Preset"
      pageTitle={"Edit Alert Preset - " + state.oldName}
    >
      <AlertModal dispatch={dispatch} state={state} />
      <Tabs defaultActiveKey="1" className="mt-4">
        <Tabs.TabPane tab="Preset Detail" key="1">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-start justify-start space-y-6">
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Input
                    label="Preset Code *"
                    className="w-full"
                    state={
                      state.errorType === ERROR_TYPE.ALERT_PRESET_CODE
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please set a valid alert preset code!"
                    value={state.alertPresetCode}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_ALERT_PRESET_CODE,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Input
                    label="Preset Name *"
                    className="w-full"
                    state={
                      state.errorType === ERROR_TYPE.ALERT_PRESET_NAME
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please set a valid alert preset name!"
                    value={state.alertPresetName}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_ALERT_PRESET_NAME,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Dropdown
                    label="Coop Type *"
                    state={
                      state.errorType === ERROR_TYPE.COOP_TYPE
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please select a coop type!"
                    isLoading={coopTypeData.isLoading}
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
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
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
              </div>
            </div>
            <div className="flex flex-col items-start justify-start space-y-6">
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Input
                    label="Preset Type *"
                    className="w-full"
                    value={"Alert"}
                    state="disabled"
                  />
                </div>
              </div>
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Preset List" key="2">
          <div className="test2">
            <div className="mt-6 overflow-x-auto">
              <Table
                scroll={{
                  x: 700,
                }}
                pagination={false}
                rowKey={"id"}
                dataSource={state.tableData}
                columns={[
                  {
                    title: "Action",
                    fixed: "left",
                    width: 68,
                    key: "action",
                    render: (record) => (
                      <Button
                        type="icon-outline"
                        title="Edit"
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          const filteredData = state.alertIds.filter(
                            (e) => e !== record.id
                          );
                          dispatch({
                            type: ACTION_TYPE.SET_ALERT_IDS,
                            payload: filteredData,
                          });
                          dispatch({
                            type: ACTION_TYPE.SET_SELECTED_ALERTS,
                            payload: filteredData,
                          });
                          const filteredDetailsData =
                            state.selectedAlertDetails.filter(
                              (e) => e.id !== record.id
                            );
                          dispatch({
                            type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
                            payload: filteredDetailsData,
                          });
                          dispatch({
                            type: ACTION_TYPE.SET_TABLE_DATA,
                            payload: filteredDetailsData,
                          });
                        }}
                      />
                    ),
                  },
                  ...columns,
                ]}
              />
            </div>
          </div>
          <div className="test mt-2">
            <Button
              title="Add"
              size="xs"
              className="w-full"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_IS_ALERT_LIST_MODAL_VISIBLE,
                  payload: true,
                });
              }}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>

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
          state={alertPresetData.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={alertPresetData.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            editAlertPreset.mutate();
          }}
          title="Edit Alert Preset"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
