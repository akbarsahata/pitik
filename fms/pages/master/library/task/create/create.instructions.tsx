import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Editor from "@components/atoms/Editor/Editor";
import Input from "@components/atoms/Input/Input";
import { isEmptyString, randomHexString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TFeedBrandResponse, TVariableResponse } from "@type/response.type";
import { Modal, Tabs } from "antd";
import { Dispatch, useState } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  emptyInstruction,
  ERROR_REQUIRED_INPUT,
  TStore,
} from "./create.constants";

const InstructionsModal = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  const [activeTab, setActiveTab] = useState<"1" | "2">("1");
  const [errorOnInput, setErrorOnInput] = useState(ERROR_REQUIRED_INPUT.NONE);

  const checkRequired = () => {
    if (isEmptyString(state.inputInstruction.instructionTitle)) {
      setErrorOnInput(ERROR_REQUIRED_INPUT.INSTRUCTION_TITLE);
      return false;
    }
    if (
      state.inputInstruction.photoRequired === null ||
      state.inputInstruction.photoRequired.value === undefined
    ) {
      setErrorOnInput(ERROR_REQUIRED_INPUT.PHOTO_REQUIRED);
      setActiveTab("1");
      return false;
    }
    if (
      state.inputInstruction.videoRequired === null ||
      state.inputInstruction.videoRequired.value === undefined
    ) {
      setErrorOnInput(ERROR_REQUIRED_INPUT.VIDEO_REQUIRED);
      setActiveTab("1");
      return false;
    }
    if (
      state.inputInstruction.needAdditionalDetail === null ||
      state.inputInstruction.needAdditionalDetail.value === undefined
    ) {
      setErrorOnInput(ERROR_REQUIRED_INPUT.NEED_ADDITIONAL_DETAIL);
      setActiveTab("1");
      return false;
    }
    if (
      state.inputInstruction.dataRequired === null ||
      state.inputInstruction.dataRequired.value === undefined
    ) {
      setErrorOnInput(ERROR_REQUIRED_INPUT.DATA_REQUIRED);
      setActiveTab("2");
      return false;
    }

    return true;
  };

  let needAdditionalDetailRequirementOptions: IDropdownItem<boolean>[] = [];
  let checkDataCorrectnessOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) => {
    needAdditionalDetailRequirementOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    });
    checkDataCorrectnessOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    });
  });

  let photoRequirementOptions: IDropdownItem<number>[] = [];
  let videoRequirementOptions: IDropdownItem<number>[] = [];
  let dataRequirementOptions: IDropdownItem<number>[] = [];
  [0, 1, 2].map((item) => {
    photoRequirementOptions.push({
      value: item,
      label: item === 0 ? "Not Required" : item === 1 ? "Required" : "Optional",
    });
    videoRequirementOptions.push({
      value: item,
      label: item === 0 ? "Not Required" : item === 1 ? "Required" : "Optional",
    });
    dataRequirementOptions.push({
      value: item,
      label: item === 0 ? "Not Required" : item === 1 ? "Required" : "Optional",
    });
  });

  let dataTypeOptions: IDropdownItem<string>[] = [];
  ["text", "numeric", "option"].map((item) =>
    dataTypeOptions.push({
      value: item,
      label: item.toUpperCase(),
    })
  );

  let variableOptions: IDropdownItem<TVariableResponse>[] = [];
  state.variableData.map((item) =>
    variableOptions.push({
      value: item,
      label: `(${item.variableCode}) ${item.variableName}`,
    })
  );

  let feedbrandOptions: IDropdownItem<TFeedBrandResponse>[] = [];
  state.feedbrandData.map((item) =>
    feedbrandOptions.push({
      value: item,
      label: `(${item.feedbrandCode}) ${item.feedbrandName}`,
    })
  );

  return (
    <Modal
      width={"75%"}
      onCancel={() => {
        setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
        setActiveTab("1");
        dispatch({
          type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
          payload: emptyInstruction,
        });
        dispatch({
          type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
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
                type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
                payload: false,
              });
            }}
          />
          <Button
            title="Add"
            size="xs"
            onClick={() => {
              const passed = checkRequired();
              if (!passed) return;
              if (
                state.inputInstruction.id === "" ||
                state.inputInstruction.id === undefined
              ) {
                dispatch({
                  type: ACTION_TYPE.SET_INSTRUCTIONS,
                  payload: [
                    ...state.instructions,
                    {
                      ...state.inputInstruction,
                      id: randomHexString(),
                    },
                  ],
                });
              } else {
                const filteredData = state.instructions.filter(
                  (e) => e.id !== state.inputInstruction.id
                );
                dispatch({
                  type: ACTION_TYPE.SET_INSTRUCTIONS,
                  payload: [...filteredData, state.inputInstruction],
                });
              }
              dispatch({
                type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL,
                payload: false,
              });
            }}
          />
        </div>
      }
      title="Instruction"
      visible={state.addInstructionModal}
    >
      <div>
        <Input
          label="Instruction Title *"
          className="w-full"
          state={
            errorOnInput === ERROR_REQUIRED_INPUT.INSTRUCTION_TITLE
              ? "error"
              : "active"
          }
          errorMessage="Please input an instruction title"
          value={state.inputInstruction.instructionTitle}
          onChange={(e) => {
            setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
            dispatch({
              type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
              payload: {
                ...state.inputInstruction,
                instructionTitle: e.target.value,
              },
            });
          }}
        />
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "1" | "2")}
          className="mt-8"
        >
          <Tabs.TabPane tab="File &amp; Details" key="1">
            <div className="space-y-4">
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Dropdown
                    label="Photo *"
                    state={
                      errorOnInput === ERROR_REQUIRED_INPUT.PHOTO_REQUIRED
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please select the photo requirement!"
                    value={state.inputInstruction.photoRequired}
                    options={photoRequirementOptions}
                    onChange={(item: IDropdownItem<number>) => {
                      setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: {
                          ...state.inputInstruction,
                          photoRequired: item,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  className={`${
                    state.inputInstruction.photoRequired?.value === 0 ||
                    state.inputInstruction.photoRequired === null
                      ? "hidden"
                      : ""
                  } flex-1 w-full`}
                >
                  <Input
                    label="Photo Instruction"
                    className="w-full"
                    value={state.inputInstruction.photoInstruction}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: {
                          ...state.inputInstruction,
                          photoInstruction: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                <div className="flex-1 w-full">
                  <Dropdown
                    label="Video *"
                    state={
                      errorOnInput === ERROR_REQUIRED_INPUT.VIDEO_REQUIRED
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please select the video requirement!"
                    value={state.inputInstruction.videoRequired}
                    options={videoRequirementOptions}
                    onChange={(item: IDropdownItem<number>) => {
                      setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: {
                          ...state.inputInstruction,
                          videoRequired: item,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  className={`${
                    state.inputInstruction.videoRequired?.value === 0 ||
                    state.inputInstruction.videoRequired === null
                      ? "hidden"
                      : ""
                  } flex-1 w-full`}
                >
                  <Input
                    label="Video Instruction"
                    className="w-full"
                    value={state.inputInstruction.videoInstruction}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: {
                          ...state.inputInstruction,
                          videoInstruction: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <Dropdown
                  label="Additional Details *"
                  state={
                    errorOnInput === ERROR_REQUIRED_INPUT.NEED_ADDITIONAL_DETAIL
                      ? "error"
                      : "active"
                  }
                  isSearchable={true}
                  errorMessage="Please select the additional details requirement!"
                  value={state.inputInstruction.needAdditionalDetail}
                  options={needAdditionalDetailRequirementOptions}
                  onChange={(item: IDropdownItem<boolean>) => {
                    setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                    dispatch({
                      type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                      payload: {
                        ...state.inputInstruction,
                        needAdditionalDetail: item,
                      },
                    });
                  }}
                />
              </div>
              <div
                className={`${
                  state.inputInstruction.needAdditionalDetail?.value === true
                    ? ""
                    : "hidden"
                } flex-1 w-full`}
              >
                <Editor
                  label="Details"
                  uploadFolder="task-library"
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                      payload: {
                        ...state.inputInstruction,
                        additionalDetail: e.target.getContent(),
                      },
                    });
                  }}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Additional Data" key="2">
            <div className="space-y-4">
              <div className="flex-1 w-full">
                <Dropdown
                  label="Additional Data *"
                  state={
                    errorOnInput === ERROR_REQUIRED_INPUT.DATA_REQUIRED
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the additional data requirement!"
                  value={state.inputInstruction.dataRequired}
                  options={dataRequirementOptions}
                  onChange={(item: IDropdownItem<number>) => {
                    setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                    dispatch({
                      type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                      payload: {
                        ...state.inputInstruction,
                        dataRequired: item,
                      },
                    });
                  }}
                />
              </div>
              <div
                className={`${
                  state.inputInstruction.dataRequired?.value === 1 ||
                  state.inputInstruction.dataRequired?.value === 2
                    ? "flex"
                    : "hidden"
                } flex-col space-y-4`}
              >
                <div className="flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                  <Input
                    label="Data Instruction"
                    className="w-full"
                    value={state.inputInstruction.dataInstruction}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                        payload: {
                          ...state.inputInstruction,
                          dataInstruction: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                  <div className="flex-1 w-full">
                    <Dropdown
                      label="Data Type"
                      value={state.inputInstruction.dataType}
                      options={dataTypeOptions}
                      onChange={(item: IDropdownItem<string>) => {
                        setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                        dispatch({
                          type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                          payload: {
                            ...state.inputInstruction,
                            dataType: item,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Dropdown
                      label="Data Correctness"
                      value={state.inputInstruction.checkDataCorrectness}
                      options={checkDataCorrectnessOptions}
                      onChange={(item: IDropdownItem<boolean>) => {
                        setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                        dispatch({
                          type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                          payload: {
                            ...state.inputInstruction,
                            checkDataCorrectness: item,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                  <div className="flex-1 w-full">
                    <Dropdown
                      label="Variable"
                      value={state.inputInstruction.variable}
                      options={variableOptions}
                      isSearchable={true}
                      onChange={(item: IDropdownItem<TVariableResponse>) => {
                        setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                        dispatch({
                          type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                          payload: {
                            ...state.inputInstruction,
                            variable: item,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Dropdown
                      label="Feed Brand"
                      value={state.inputInstruction.feedbrand}
                      options={feedbrandOptions}
                      isSearchable={true}
                      onChange={(item: IDropdownItem<TFeedBrandResponse>) => {
                        setErrorOnInput(ERROR_REQUIRED_INPUT.NONE);
                        dispatch({
                          type: ACTION_TYPE.SET_INPUT_INSTRUCTION,
                          payload: {
                            ...state.inputInstruction,
                            feedbrand: item,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default InstructionsModal;
