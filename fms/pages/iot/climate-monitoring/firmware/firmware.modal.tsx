import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import WarningIcon from "@icons/WarningIcon.svg";
import { IDropdownItem } from "@type/dropdown.interface";
import { TDeviceTypeResponse } from "@type/response.type";
import { AxiosResponse } from "axios";
import { Dispatch } from "react";
import { UseMutationResult } from "react-query";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./firmware.constants";
import { checkRequired } from "./firmware.functions";

const AddFirmware = ({
  state,
  dispatch,
  createFirmware,
  uploadFirmware,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
  uploadFirmware: UseMutationResult<void, unknown, void, unknown>;
  createFirmware: UseMutationResult<AxiosResponse, unknown, void, unknown>;
}) => {
  let deviceTypeOptions: IDropdownItem<TDeviceTypeResponse>[] = [];
  state.deviceTypeData.map((item: TDeviceTypeResponse) =>
    deviceTypeOptions.push({
      value: item,
      label: item.text,
    })
  );

  return (
    <Modal
      width={"75%"}
      content={
        <div className="w-full h-full space-y-4">
          <div className="w-full h-full">
            <Input
              label="Version *"
              type="text"
              state={
                state.errorType === ERROR_TYPE.VERSION ? "error" : "active"
              }
              errorMessage="Version is required"
              className="w-full"
              value={state.version}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_VERSION,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full h-full">
            <Input
              label="Description *"
              type="textarea"
              state={
                state.errorType === ERROR_TYPE.DESCRIPTION ? "error" : "active"
              }
              errorMessage="Description is required"
              className="w-full h-full"
              value={state.description}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_DESCRIPTION,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full h-full">
            <Input
              label="Upload File *"
              className="w-full"
              state={state.errorType === ERROR_TYPE.FILE ? "error" : "active"}
              errorMessage="File is required"
              multiple={false}
              type="file"
              accept=".bin"
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_FILE,
                  payload: (e.target as HTMLInputElement).files,
                });
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
              }}
            />
          </div>
          <div className="w-full h-full">
            <Dropdown
              label="Device Type *"
              value={state.deviceType}
              state={
                state.errorType === ERROR_TYPE.DEVICE_TYPE ? "error" : "active"
              }
              errorMessage="Please select device type!"
              options={deviceTypeOptions}
              isSearchable={true}
              isOptionDisabled={(
                option: IDropdownItem<TDeviceTypeResponse>
              ) => {
                return (
                  option.value.value === "SMART_CONVENTRON" ||
                  option.value.value === "SMART_ELMON" ||
                  option.value.value === "SMART_SCALE"
                );
              }}
              onChange={(item: IDropdownItem<TDeviceTypeResponse>) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_DEVICE_TYPE,
                  payload: item,
                });
              }}
            />
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
        </div>
      }
      footer={
        <div className="flex flex-1 space-x-2 items-center justify-end">
          <Button
            type="outline"
            title="Cancel"
            state={
              (createFirmware.isLoading || uploadFirmware.isLoading) &&
              (!createFirmware.isError || !uploadFirmware.isError)
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE,
                payload: false,
              });
              dispatch({
                type: ACTION_TYPE.SET_ERROR_TYPE,
                payload: ERROR_TYPE.NONE,
              });
              dispatch({
                type: ACTION_TYPE.SET_VERSION,
                payload: "",
              });
              dispatch({
                type: ACTION_TYPE.SET_DESCRIPTION,
                payload: "",
              });
              dispatch({
                type: ACTION_TYPE.SET_FILE,
                payload: null,
              });
              dispatch({
                type: ACTION_TYPE.SET_DEVICE_TYPE,
                payload: null,
              });
            }}
          />
          <Button
            title="Save"
            size="xs"
            state={
              (createFirmware.isLoading || uploadFirmware.isLoading) &&
              (!createFirmware.isError || !uploadFirmware.isError)
                ? "loading"
                : "active"
            }
            onClick={() => {
              const required = checkRequired({ dispatch, state });
              if (!required) return;
              uploadFirmware.mutate();
            }}
          />
        </div>
      }
      title="Add Firmware"
      isVisible={state.isAddFirmwareModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.NONE,
        });
        dispatch({
          type: ACTION_TYPE.SET_VERSION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_DESCRIPTION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_FILE,
          payload: null,
        });
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE,
          payload: null,
        });
      }}
    />
  );
};

export default AddFirmware;
