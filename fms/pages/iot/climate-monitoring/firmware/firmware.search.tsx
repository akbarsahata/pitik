import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import { TDeviceTypeResponse } from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./firmware.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
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
          {/* version */}
          <Input
            label="Version"
            placeholder="Type Here"
            className="w-full"
            value={state.inputSearch.version}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, version: e.target.value },
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

          {/* description */}
          <Input
            label="Description"
            placeholder="Type Here"
            className="w-full"
            value={state.inputSearch.description}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, description: e.target.value },
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
