import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Editor from "@components/atoms/Editor/Editor";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import DeleteIcon from "@icons/DeleteIcon.svg";
import EditIcon from "@icons/EditIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getFeedbrands,
  getVariables,
  postCreateTaskLibrary,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TFeedBrandResponse,
  TGetManyResponse,
  TInstructionResponse,
  TTriggerResponse,
  TVariableResponse,
} from "@type/response.type";
import { Modal } from "antd";
import { AxiosError } from "axios";
import { randomUUID } from "crypto";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import {
  ACTION_TYPE,
  emptyInstruction,
  ERROR_TYPE,
  store,
  TInstructionData,
} from "./create.constants";
import {
  addOneNewTrigger,
  checkRequired,
  generateTriggers,
  removeAllTriggers,
  setErrorText,
} from "./create.functions";
import InstructionsModal from "./create.instructions";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  let harvestOnlyOptions: IDropdownItem<boolean>[] = [];
  let manualTriggerOptions: IDropdownItem<boolean>[] = [];
  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) => {
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    });
    manualTriggerOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    });
    harvestOnlyOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    });
  });

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

  const feedbrandsData: UseQueryResult<
    { data: TGetManyResponse<TFeedBrandResponse[]> },
    AxiosError
  > = useQuery(
    ["feedbrandsData"],
    async () =>
      await getFeedbrands({
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
        const feedbrandList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FEEDBRAND_DATA,
          payload: feedbrandList,
        });
      },
    }
  );

  const createTaskLibrary = useMutation(
    ["createTaskLibrary"],
    async () => {
      let tempInstructions: TInstructionResponse[] = [];
      state.instructions.map((instruction: TInstructionData) => {
        tempInstructions.push({
          ...instruction,
          dataType:
            !instruction.dataType ||
            isEmptyString(instruction.dataType?.value as string)
              ? undefined
              : instruction.dataType.value,
          videoRequired: instruction.videoRequired?.value as
            | 0
            | 1
            | 2
            | undefined,
          dataRequired: instruction.dataRequired?.value as
            | 0
            | 1
            | 2
            | undefined,
          // @ts-ignore
          photoRequired: instruction.photoRequired?.value,
          checkDataCorrectness: instruction.checkDataCorrectness?.value,
          feedbrandId: instruction.feedbrand?.value.id,
          variableId: instruction.variable?.value.id,
          needAdditionalDetail: instruction.needAdditionalDetail?.value,
        });
      });
      tempInstructions.map((item) => {
        delete item["feedbrand"];
        delete item["variable"];
      });
      await postCreateTaskLibrary({
        taskCode: state.taskCode,
        taskName: state.taskName,
        harvestOnly: state.harvestOnly ? state.harvestOnly.value : false,
        manualTrigger: state.manualTrigger ? state.manualTrigger.value : false,
        manualDeadline: state.manualDeadline || 0,
        instruction: state.instruction,
        status: state.status ? state.status.value : true,
        remarks: state.remarks,
        triggers: state.triggers,
        instructions: tempInstructions,
      });
    },
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
    variableData.isLoading ||
    feedbrandsData.isLoading ||
    createTaskLibrary.isLoading ||
    createTaskLibrary.isSuccess
  )
    return <Loading />;
  if (variableData.isError || feedbrandsData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Create New Task Library"
      pageTitle="New Task Library"
    >
      <Modal
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL,
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
                  type: ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL,
                  payload: false,
                });
              }}
            />
            <Button
              title="Remove"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_GENERATE_TRIGGER,
                  payload: {
                    id: randomUUID(),
                    day: 0,
                    triggerTime: "00:00:00",
                    deadline: 0,
                  },
                });
                dispatch({
                  type: ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL,
                  payload: false,
                });
                removeAllTriggers({ dispatch });
              }}
            />
          </div>
        }
        title="Remove Triggers"
        visible={state.removeAllTriggersModal}
      >
        <p>Are you sure you want to remove all triggers?</p>
      </Modal>

      <InstructionsModal dispatch={dispatch} state={state} />

      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="Task Code *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.TASK_CODE ? "error" : "active"
                }
                errorMessage="Please set a valid task library code!"
                value={state.taskCode}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_TASK_CODE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Task Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.TASK_NAME ? "error" : "active"
                }
                errorMessage="Please set a valid task library name!"
                value={state.taskName}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_TASK_NAME,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Dropdown
                label="Only for Harvest *"
                state={
                  state.errorType === ERROR_TYPE.HARVEST_ONLY
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the harvest only status!"
                value={state.harvestOnly}
                options={harvestOnlyOptions}
                onChange={(item: IDropdownItem<boolean>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_HARVEST_ONLY,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Dropdown
                label="Manual Trigger *"
                state={
                  state.errorType === ERROR_TYPE.MANUAL_TRIGGER
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the manual trigger status!"
                value={state.manualTrigger}
                options={manualTriggerOptions}
                onChange={(item: IDropdownItem<boolean>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_MANUAL_TRIGGER,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="Manual Deadline *"
                className="w-full"
                type="number"
                min="0"
                state={
                  state.errorType === ERROR_TYPE.MANUAL_DEADLINE
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a manual deadline!"
                value={state.manualDeadline}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_MANUAL_DEADLINE,
                    payload: parseInt(e.target.value),
                  });
                }}
              />
            </div>
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
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <p className="text-lg font-semibold">List of Instructions</p>
              <div
                className={`mt-4 ${
                  state.instructions.length !== 0 ? "hidden" : ""
                }`}
              >
                <Button
                  size="xs"
                  state={"active"}
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
                      payload: true,
                    });
                  }}
                  className="mt-2"
                  title="Add New Instruction"
                />
              </div>
              <div
                className={`mt-4 ${
                  state.instructions.length !== 0 ? "" : "hidden"
                }`}
              >
                <div>
                  <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                    {/* <p>Actions</p> */}
                    <div className="w-24">
                      <p className="text-center">Actions</p>
                    </div>
                    <div className="">
                      <p>Name</p>
                    </div>
                  </div>
                  {state.instructions.map((instruction) => (
                    <div
                      key={instruction.id}
                      className="flex flex-row items-center justify-start mb-2"
                    >
                      <div className="w-12 pl-1 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            const filteredData = state.instructions.filter(
                              (e) => e.id !== instruction.id
                            );
                            dispatch({
                              type: ACTION_TYPE.SET_INSTRUCTIONS,
                              payload: filteredData,
                            });
                          }}
                        />
                      </div>
                      <div className="w-12 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<EditIcon />}
                          onClick={() => {
                            dispatch({
                              type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                              payload:
                                state.instructions[
                                  state.instructions.findIndex(
                                    (data) => data.id === instruction.id
                                  )
                                ],
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
                              payload: true,
                            });
                          }}
                        />
                      </div>
                      <div className="w-1/3 ml-4">
                        <p>{instruction.instructionTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center mt-2 space-x-1">
                  <Button
                    title="Add"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: emptyInstruction,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
                        payload: true,
                      });
                    }}
                  />
                  <Button
                    title="Remove All"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_INSTRUCTIONS,
                        payload: [],
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <p className="text-lg font-semibold">Triggers</p>
              <div
                className={`${
                  state.errorType === ERROR_TYPE.TRIGGERS ? "flex" : "hidden"
                } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4`}
              >
                <div className="mr-2 text-red-500 text-xl">
                  <WarningIcon />
                </div>
                <p className="text-red-500">
                  Invalid: {state.triggerErrorText}
                </p>
              </div>
              <div
                className={`mt-4 ${
                  state.triggers.length !== 0 ? "hidden" : ""
                }`}
              >
                <div className="flex flex-row space-x-2">
                  <div className="flex-1">
                    <Input
                      size="sm"
                      className="w-full"
                      type="number"
                      label="Total Days"
                      min="0"
                      value={state.generateTrigger.day}
                      onChange={(e) => {
                        dispatch({
                          type: ACTION_TYPE.SET_ERROR_TYPE,
                          payload: ERROR_TYPE.NONE,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_GENERATE_TRIGGER,
                          payload: {
                            ...state.generateTrigger,
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
                      type="time"
                      label="Trigger Time"
                      step="1"
                      value={state.generateTrigger.triggerTime}
                      onChange={(e) => {
                        dispatch({
                          type: ACTION_TYPE.SET_ERROR_TYPE,
                          payload: ERROR_TYPE.NONE,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_GENERATE_TRIGGER,
                          payload: {
                            ...state.generateTrigger,
                            triggerTime: e.target.value,
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
                      label="Deadline (hours)"
                      min="0"
                      value={state.generateTrigger.deadline}
                      onChange={(e) => {
                        dispatch({
                          type: ACTION_TYPE.SET_ERROR_TYPE,
                          payload: ERROR_TYPE.NONE,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_GENERATE_TRIGGER,
                          payload: {
                            ...state.generateTrigger,
                            deadline: parseFloat(e.target.value),
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <Button
                  size="xs"
                  state={"active"}
                  onClick={() => {
                    generateTriggers({
                      dispatch,
                      state,
                    });
                  }}
                  className="mt-2"
                  title="Generate"
                />
              </div>
              <div
                className={`mt-4 ${
                  state.triggers.length !== 0 ? "" : "hidden"
                }`}
              >
                <div>
                  <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                    {/* <p>Actions</p> */}
                    <div className="w-16">
                      <p>Actions</p>
                    </div>
                    <div className="w-1/3">
                      <p>Day *</p>
                    </div>
                    <div className="w-1/3 pl-3">
                      <p>Trigger Time *</p>
                    </div>
                    <div className="w-1/3">
                      <p className="-ml-3">Deadline (Hours) *</p>
                    </div>
                  </div>
                  {state.triggers.map((trigger: TTriggerResponse) => (
                    <div
                      key={trigger.id}
                      className="flex flex-row items-center justify-start space-x-2 mb-2"
                    >
                      <div className="w-16 pl-1 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            const filteredData = state.triggers.filter(
                              (e) => e.id !== trigger.id
                            );
                            dispatch({
                              type: ACTION_TYPE.SET_TRIGGERS,
                              payload: filteredData,
                            });
                          }}
                        />
                      </div>
                      <div className="w-1/3">
                        <Input
                          size="sm"
                          className="w-full"
                          type="number"
                          min="0"
                          value={
                            state.triggers[
                              state.triggers.findIndex(
                                (data: TTriggerResponse) =>
                                  data.id === trigger.id
                              )
                            ].day
                          }
                          onChange={(e) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            state.triggers.map((item: TTriggerResponse) => {
                              if (item.id === trigger.id) {
                                let newArr = [...state.triggers];
                                newArr[
                                  newArr.findIndex(
                                    (data) => data.id === trigger.id
                                  )
                                ].day = parseInt(e.target.value);
                                dispatch({
                                  type: ACTION_TYPE.SET_TRIGGERS,
                                  payload: newArr,
                                });
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="w-1/3">
                        <Input
                          size="sm"
                          className="w-full flex-1"
                          type="time"
                          step="1"
                          min="0"
                          value={
                            state.triggers[
                              state.triggers.findIndex(
                                (data: TTriggerResponse) =>
                                  data.id === trigger.id
                              )
                            ].triggerTime
                          }
                          onChange={(e) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            state.triggers.map((item: TTriggerResponse) => {
                              if (item.id === trigger.id) {
                                let newArr = [...state.triggers];
                                newArr[
                                  newArr.findIndex(
                                    (data) => data.id === trigger.id
                                  )
                                ].triggerTime = e.target.value;
                                dispatch({
                                  type: ACTION_TYPE.SET_TRIGGERS,
                                  payload: newArr,
                                });
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="w-1/3">
                        <Input
                          size="sm"
                          className="w-full"
                          type="number"
                          min="0"
                          value={
                            state.triggers[
                              state.triggers.findIndex(
                                (data: TTriggerResponse) =>
                                  data.id === trigger.id
                              )
                            ].deadline
                          }
                          onChange={(e) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            state.triggers.map((item: TTriggerResponse) => {
                              if (item.id === trigger.id) {
                                let newArr = [...state.triggers];
                                newArr[
                                  newArr.findIndex(
                                    (data) => data.id === trigger.id
                                  )
                                ].deadline = parseFloat(e.target.value);
                                dispatch({
                                  type: ACTION_TYPE.SET_TRIGGERS,
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
                <div className="flex justify-end items-center mt-2 space-x-1">
                  <Button
                    title="Add"
                    size="xs"
                    onClick={() => addOneNewTrigger({ dispatch, state })}
                  />
                  <Button
                    title="Remove All"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL,
                        payload: true,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="w-full">
            <Editor
              label="Instruction"
              uploadFolder="task-library"
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_INSTRUCTION,
                  payload: e.target.getContent(),
                });
              }}
            />
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
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            createTaskLibrary.mutate();
          }}
          title="Create Task Library"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
