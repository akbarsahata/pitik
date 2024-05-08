import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TCoopResponse,
  TDeviceTypeResponse,
  TFarmResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./device.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
    })
  );

  let deviceTypeOptions: IDropdownItem<TDeviceTypeResponse>[] = [];
  state.deviceTypeData.map((item) =>
    deviceTypeOptions.push({
      value: item,
      label: item.text,
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* farm */}
          <Dropdown
            label="Farm"
            value={state.inputSearch.farm}
            options={farmOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farm: item },
              });
            }}
          />

          {/* coopId */}
          <Dropdown
            label="Coop"
            value={state.inputSearch.coop}
            options={coopOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TCoopResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, coop: item },
              });
            }}
          />

          {/* Device Type */}
          <Dropdown
            label="Device Type"
            value={state.inputSearch.deviceType}
            options={deviceTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TDeviceTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, deviceType: item },
              });
            }}
          />

          {/* macADdress */}
          <Input
            label="MAC Address"
            className="w-full"
            value={state.inputSearch.macAddress}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, macAddress: e.target.value },
              });
            }}
          />

          {/* deviceId */}
          <Input
            label="Device ID"
            className="w-full"
            value={state.inputSearch.deviceId}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, deviceId: e.target.value },
              });
            }}
          />

          {/* phoneNumber */}
          <Input
            label="Phone Number"
            className="w-full"
            value={state.inputSearch.phoneNumber}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, phoneNumber: e.target.value },
              });
            }}
          />
        </div>
      }
      footer={
        <div className="flex flex-1 space-x-2 items-center justify-end">
          <Button
            title="Apply"
            state={state.inputSearch === search ? "disabled" : "active"}
            size="xs"
            onClick={onClickOk}
          />
        </div>
      }
      title="Advance Search"
      isVisible={state.isAdvanceSearchVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_INPUT_SEARCH,
          payload: state.search,
        });
      }}
    />
  );
};

export default AdvanceSearch;
