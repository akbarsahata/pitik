import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingTypeResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./building.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let buildingTypeOptions: IDropdownItem<TBuildingTypeResponse>[] = [];
  state.buildingTypeData.map((item) =>
    buildingTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* coopCode */}
          <Input
            label="Building Name"
            className="w-full"
            value={state.inputSearch.buildingName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, buildingName: e.target.value },
              });
            }}
          />
          {/* buildingTypeId */}
          <Dropdown
            label="Building Type"
            value={state.inputSearch.buildingType}
            options={buildingTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBuildingTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, buildingType: item },
              });
            }}
          />
          {/* ownerId */}
          <Dropdown
            label="Owner"
            value={state.inputSearch.owner}
            options={ownerOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, owner: item },
              });
            }}
          />
          {/* farmId */}
          <Dropdown
            label="Farm"
            value={state.inputSearch.farm}
            isSearchable={true}
            options={farmOptions}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farm: item },
              });
            }}
          />
          {/* status */}
          <Dropdown
            label="Status"
            value={state.inputSearch.status}
            options={statusOptions}
            onChange={(item: IDropdownItem<boolean>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, status: item },
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
