import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import DeleteIcon from "@icons/DeleteIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getChickenStrains,
  getCoopTypes,
  getTarget,
  getVariables,
  putEditTarget,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TGetByIdResponse,
  TGetManyResponse,
  TTargetDayResponse,
  TTargetLibraryResponse,
  TVariableResponse,
} from "@type/response.type";
import { Modal, Tabs } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  addOneNewTarget,
  checkRequired,
  generateNewTargets,
  setErrorText,
  setTargetLibraryInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const targetId = decodeString(router.query.id as string);
  const targetLibraryData: UseQueryResult<
    { data: TGetByIdResponse<TTargetLibraryResponse> },
    AxiosError
  > = useQuery(["targetLibraryData"], async () => await getTarget(targetId), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setTargetLibraryInitialData({
        dispatch,
        data: data.data,
      });
    },
  });

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

  const variableData: UseQueryResult<
    { data: TGetManyResponse<TVariableResponse[]> },
    AxiosError
  > = useQuery(
    ["variableData"],
    async () =>
      await getVariables({
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
        const variableList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_VARIABLE_DATA,
          payload: variableList,
        });
      },
    }
  );

  const editTargetLibrary = useMutation(
    ["editTargetLibrary"],
    async () =>
      await putEditTarget(
        {
          targetCode: state.targetCode,
          targetName: state.targetName,
          targetDaysCount: state.targets.length,
          status: state.status ? state.status.value : true,
          remarks: state.remarks,
          coopTypeId: state.coopType ? state.coopType.value.id : "",
          chickTypeId: state.chickType ? state.chickType.value.id : "",
          variableId: state.variable ? state.variable.value.id : "",
          targets: state.targets,
        },
        targetId
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

  let chickTypeOptions: IDropdownItem<TChickenStrainResponse>[] = [];
  state.chickTypeData.map((item: TChickenStrainResponse) =>
    chickTypeOptions.push({
      value: item,
      label: `(${item.chickTypeCode}) ${item.chickTypeName}`,
    })
  );

  let variableOptions: IDropdownItem<TVariableResponse>[] = [];
  state.variableData.map((item: TVariableResponse) =>
    variableOptions.push({
      value: item,
      label: `(${item.variableCode}) ${item.variableName}`,
    })
  );

  if (
    targetLibraryData.isLoading ||
    targetLibraryData.isFetching ||
    editTargetLibrary.isLoading ||
    editTargetLibrary.isSuccess ||
    coopTypeData.isLoading ||
    chickTypeData.isLoading ||
    variableData.isLoading
  )
    return <Loading />;
  if (
    targetLibraryData.isError ||
    coopTypeData.isError ||
    chickTypeData.isError ||
    variableData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Target Library"
      pageTitle={"Edit Target Library - " + state.oldName}
    >
      <Modal
        footer={
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              type="outline"
              title="Cancel"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
            <Button
              title="Delete"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_TARGETS,
                  payload: [],
                });
                dispatch({
                  type: ACTION_TYPE.SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
          </div>
        }
        title="Remove All"
        visible={state.removeAllTargetsModalVisible}
      >
        <p>Are you sure you want to remove all target days?</p>
      </Modal>
      <Tabs defaultActiveKey="1" className="mt-4">
        <Tabs.TabPane tab="Target Detail" key="1">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-start justify-start space-y-6">
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Input
                    label="Target Code *"
                    className="w-full"
                    state={
                      state.errorType === ERROR_TYPE.TARGET_CODE
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please set a valid target code!"
                    value={state.targetCode}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_TARGET_CODE,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              {/* Name */}
              <div className="w-full">
                <Input
                  label="Target Name *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.TARGET_NAME
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please input a target name!"
                  value={state.targetName}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_TARGET_NAME,
                      payload: e.target.value,
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
                  isSearchable={true}
                  options={coopTypeOptions}
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
              <div className="w-full">
                <Dropdown
                  label="Status *"
                  state={
                    state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                  }
                  errorMessage="Please select user's status!"
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
            {/* Right Part */}
            <div className="h-full flex flex-col items-start justify-start space-y-6">
              {/* Target Type */}
              <div className="w-full">
                <Input
                  label="Target Type *"
                  className="w-full"
                  state="disabled"
                  value="Target"
                  onChange={() => {}}
                />
              </div>
              {/* Chicken Strain & Variable */}
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="w-full">
                  <Dropdown
                    label="Chick Type *"
                    state={
                      state.errorType === ERROR_TYPE.CHICK_TYPE
                        ? "error"
                        : "active"
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
                <div className="w-full">
                  <Dropdown
                    label="Variable *"
                    state={
                      state.errorType === ERROR_TYPE.VARIABLE
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please select a variable!"
                    isSearchable={true}
                    value={state.variable}
                    options={variableOptions}
                    onChange={(item: IDropdownItem<TVariableResponse>) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_VARIABLE,
                        payload: item,
                      });
                    }}
                  />
                </div>
              </div>
              {/* Remarks */}
              <div className="w-full h-full">
                <Input
                  label="Remarks"
                  type="textarea"
                  className="w-full h-full"
                  state={
                    state.errorType === ERROR_TYPE.REMARKS ? "error" : "active"
                  }
                  errorMessage="Please input a remarks!"
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
        <Tabs.TabPane tab="Target Days" key="2">
          <div className={`mt-4 ${state.targets.length !== 0 ? "hidden" : ""}`}>
            <div className="flex flex-row space-x-2">
              <div className="flex-1">
                <Input
                  size="sm"
                  className="w-full"
                  type="number"
                  label="Total Days"
                  min="0"
                  value={state.generateTargets.day}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_GENERATE_TARGETS,
                      payload: {
                        ...state.generateTargets,
                        day: parseInt(e.target.value),
                      },
                    });
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  size="sm"
                  className="w-full"
                  type="number"
                  label="Min Value"
                  min="0"
                  value={state.generateTargets.minValue}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_GENERATE_TARGETS,
                      payload: {
                        ...state.generateTargets,
                        minValue: parseFloat(e.target.value),
                      },
                    });
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  size="sm"
                  className="w-full"
                  type="number"
                  label="Max Value"
                  min="0"
                  value={state.generateTargets.maxValue}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_GENERATE_TARGETS,
                      payload: {
                        ...state.generateTargets,
                        maxValue: parseInt(e.target.value),
                      },
                    });
                  }}
                />
              </div>
            </div>
            <Button
              size="xs"
              state="active"
              onClick={() => generateNewTargets({ dispatch, state })}
              className="mt-2"
              title="Generate"
            />
          </div>
          {/* DATA TABLE */}
          <div
            className={`${
              state.targets.length === 0 ? "hidden" : ""
            } mt-6 overflow-x-auto`}
          >
            <div>
              <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                <div className="w-16">
                  <p>Actions</p>
                </div>
                <div className="flex-1">
                  <p>Day</p>
                </div>
                <div className="flex-1">
                  <p>Min Value</p>
                </div>
                <div className="flex-1">
                  <p>Max Value</p>
                </div>
              </div>
              <div className="space-y-4">
                {state.targets.map((target: TTargetDayResponse) => (
                  <div key={target.id} className="flex flex-row space-x-2">
                    <div className="w-16 pl-1">
                      <Button
                        type="icon-outline"
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          const filteredData = state.targets.filter(
                            (e) => e.id !== target.id
                          );
                          dispatch({
                            type: ACTION_TYPE.SET_TARGETS,
                            payload: filteredData,
                          });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        size="sm"
                        className="w-full"
                        type="number"
                        min="0"
                        value={
                          state.targets[
                            state.targets.findIndex(
                              (data: TTargetDayResponse) =>
                                data.id === target.id
                            )
                          ].day
                        }
                        onChange={(e) => {
                          state.targets.map((item: TTargetDayResponse) => {
                            if (target.id === item.id) {
                              let newArr = [...state.targets];
                              newArr[
                                newArr.findIndex((data) => data.id === item.id)
                              ].day = parseInt(e.target.value);
                              dispatch({
                                type: ACTION_TYPE.SET_TARGETS,
                                payload: newArr,
                              });
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        size="sm"
                        className="w-full"
                        type="number"
                        min="0"
                        value={
                          state.targets[
                            state.targets.findIndex(
                              (data: TTargetDayResponse) =>
                                data.id === target.id
                            )
                          ].minValue
                        }
                        onChange={(e) => {
                          state.targets.map((item: TTargetDayResponse) => {
                            if (item.id === target.id) {
                              let newArr = [...state.targets];
                              newArr[
                                newArr.findIndex(
                                  (data) => data.id === target.id
                                )
                              ].minValue = parseFloat(e.target.value);
                              dispatch({
                                type: ACTION_TYPE.SET_TARGETS,
                                payload: newArr,
                              });
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        size="sm"
                        className="w-full"
                        type="number"
                        min="0"
                        value={
                          state.targets[
                            state.targets.findIndex(
                              (data: TTargetDayResponse) =>
                                data.id === target.id
                            )
                          ].maxValue
                        }
                        onChange={(e) => {
                          state.targets.map((item: TTargetDayResponse) => {
                            if (item.id === target.id) {
                              let newArr = [...state.targets];
                              newArr[
                                newArr.findIndex(
                                  (data) => data.id === target.id
                                )
                              ].maxValue = parseFloat(e.target.value);
                              dispatch({
                                type: ACTION_TYPE.SET_TARGETS,
                                payload: newArr,
                              });
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end items-center mt-2 space-x-1">
              <Button
                title="Add"
                size="xs"
                onClick={() => addOneNewTarget({ dispatch, state })}
              />
              <Button
                title="Remove All"
                size="xs"
                onClick={() => {
                  dispatch({
                    type: ACTION_TYPE.SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE,
                    payload: true,
                  });
                }}
              />
            </div>
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
          state={editTargetLibrary.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={editTargetLibrary.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            editTargetLibrary.mutate();
          }}
          title="Edit Target Library"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
