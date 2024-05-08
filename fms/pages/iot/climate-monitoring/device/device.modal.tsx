import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Modal from "@components/atoms/Modal/Modal";
import WarningIcon from "@icons/WarningIcon.svg";
import { IDropdownItem } from "@type/dropdown.interface";
import { TFirmwareSensorResponse } from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { UseMutationResult } from "react-query";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./device.constants";

const AssignOtaModal = ({
  dispatch,
  state,
  onClickOk,
  assignOtas,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
  assignOtas: UseMutationResult<void, unknown, void, unknown>;
}) => {
  const deviceTypes = state.selectedDevices
    .map((device) => device.deviceType)
    .filter((item, index, data) => data.indexOf(item) === index);

  let firmwareOptions: IDropdownItem<TFirmwareSensorResponse>[] = [];
  deviceTypes.length === 1 &&
    state.firmwareData
      .filter((firmware) => firmware.deviceType === deviceTypes[0])
      .map((item) =>
        firmwareOptions.push({
          value: item,
          label: item.version,
        })
      );

  return (
    <Modal
      content={
        <div className="space-y-4">
          <Dropdown
            label="Device Type"
            value={
              deviceTypes.length !== 1
                ? null
                : {
                    label:
                      state.deviceTypeData[
                        state.deviceTypeData.findIndex(
                          (deviceType) => deviceType.value === deviceTypes[0]
                        )
                      ].text,
                    value:
                      state.deviceTypeData[
                        state.deviceTypeData.findIndex(
                          (deviceType) => deviceType.value === deviceTypes[0]
                        )
                      ].value,
                  }
            }
            options={[]}
            isDisabled={true}
            onChange={() => {}}
          />
          <Dropdown
            label="Version"
            value={state.firmware}
            options={firmwareOptions}
            isSearchable={true}
            isDisabled={deviceTypes.length !== 1 ? true : false}
            onChange={(item: IDropdownItem<TFirmwareSensorResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_FIRMWARE,
                payload: item,
              });
            }}
          />
          <div
            className={`${
              deviceTypes.length !== 1 || state.errorType === ERROR_TYPE.GENERAL
                ? "flex"
                : "hidden"
            } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4`}
          >
            <div className="mr-2 text-red-500 text-xl">
              <WarningIcon />
            </div>
            <p className="text-red-500">
              {deviceTypes.length === 0
                ? "Error: No devices selected!"
                : deviceTypes.length > 1
                ? "Error: Multiple device types are detected! Please select one type of devices."
                : `Failed: ${state.errorText}`}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-1 space-x-2 items-center justify-end">
          <Button
            title="Cancel"
            type="outline"
            state={
              assignOtas.isLoading && !assignOtas.isError
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_FIRMWARE,
                payload: null,
              });
              dispatch({
                type: ACTION_TYPE.SET_ERROR_TYPE,
                payload: ERROR_TYPE.NONE,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE,
                payload: false,
              });
            }}
          />
          <Button
            title="Assign"
            state={
              state.firmware === null || !state.firmware.value
                ? "disabled"
                : assignOtas.isLoading && !assignOtas.isError
                ? "loading"
                : "active"
            }
            size="xs"
            onClick={onClickOk}
          />
        </div>
      }
      title="OTA Update"
      isVisible={state.isAssignOtaModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_FIRMWARE,
          payload: null,
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.NONE,
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE,
          payload: false,
        });
      }}
    />
  );
};

export default AssignOtaModal;
