import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCoopResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";
import { MouseEventHandler } from "react";
import { ACTIONS, emptySearch, TState } from "./task-ticketing.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: any;
  state: TState;
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

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  let picOptions: IDropdownItem<TUserResponse>[] = [];
  state.picData.map((item: TUserResponse) =>
    picOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  return (
    <Modal
      className="pb-40"
      content={
        <div className="space-y-4">
          {/* macAddress */}
          <Input
            label="MAC Address"
            className="w-full"
            value={state.inputSearch.macAddress}
            onChange={(e) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, macAddress: e.target.value },
                },
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
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, deviceId: e.target.value },
                },
              });
            }}
          />

          {/* farm */}
          <Dropdown
            label="Farm"
            value={state.inputSearch.farm}
            options={farmOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, farm: item },
                },
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
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, coop: item },
                },
              });
            }}
          />

          {/* BranchId */}
          <Dropdown
            label="Branch"
            value={state.inputSearch.branch}
            options={branchOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBranchResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, branch: item },
                },
              });
            }}
          />

          {/* Incident */}
          <Input
            label="Incident"
            className="w-full"
            value={state.inputSearch.incident}
            onChange={(e) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, incident: e.target.value },
                },
              });
            }}
          />

          {/* IT Support */}
          <Dropdown
            label="IT Support"
            value={state.inputSearch.pic}
            options={picOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, pic: item },
                },
              });
            }}
          />
        </div>
      }
      footer={
        <div className="flex flex-1 space-x-2 items-center justify-end">
          <Button
            title="Apply"
            state={state.inputSearch === emptySearch ? "disabled" : "active"}
            size="xs"
            onClick={onClickOk}
          />
        </div>
      }
      title="Advance Search"
      isVisible={state.isAdvanceSearchVisible}
      onCancel={() => {
        dispatch({
          type: ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE,
          payload: { data: false },
        });
        dispatch({
          type: ACTIONS.SET_INPUT_SEARCH,
          payload: { data: state.search },
        });
      }}
    />
  );
};

export default AdvanceSearch;
