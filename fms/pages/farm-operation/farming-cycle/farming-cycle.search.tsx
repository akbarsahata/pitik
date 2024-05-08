import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { CONTRACT, FARMING_STATUS } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TChickenStrainResponse,
  TCoopResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  search,
  TStore,
} from "./farming-cycle.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let farmingStatusOptions: IDropdownItem<string>[] = [];
  Object.keys(FARMING_STATUS).forEach((key) =>
    farmingStatusOptions.push({
      value: FARMING_STATUS[key],
      label: key.replace(/_/g, " "),
    })
  );

  let contractOptions: IDropdownItem<string>[] = [];
  CONTRACT.map((item) =>
    contractOptions.push({
      value: item,
      label: item,
    })
  );

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  let coopTypeOptions: IDropdownItem<TCoopTypeResponse>[] = [];
  state.coopTypeData.map((item) =>
    coopTypeOptions.push({
      value: item,
      label: `(${item.coopTypeCode}) ${item.coopTypeName}`,
    })
  );

  let chickTypeOptions: IDropdownItem<TChickenStrainResponse>[] = [];
  state.chickTypeData.map((item) =>
    chickTypeOptions.push({
      value: item,
      label: `(${item.chickTypeCode}) ${item.chickTypeName}`,
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

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* farmingCycleCode */}
          <Input
            label="Farming Cycle Code"
            className="w-full"
            value={state.inputSearch.farmingCycleCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  farmingCycleCode: e.target.value,
                },
              });
            }}
          />
          {/* farmingCycleStatus */}
          <Dropdown
            label="Farming Status"
            value={state.inputSearch.farmingStatus}
            options={farmingStatusOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farmingStatus: item },
              });
            }}
          />
          {/* contract */}
          <Dropdown
            label="Contract Type"
            value={state.inputSearch.contract}
            options={contractOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, contract: item },
              });
            }}
          />
          {/* branch name */}
          <Dropdown
            label="Branch Name"
            value={state.inputSearch.branch}
            options={branchOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBranchResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, branch: item },
              });
            }}
          />
          {/* coopTypeId */}
          <Dropdown
            label="Coop Type"
            value={state.inputSearch.coopType}
            options={coopTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TCoopTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, coopType: item },
              });
            }}
          />
          {/* chickTypeId */}
          <Dropdown
            label="Chick Type"
            value={state.inputSearch.chickType}
            options={chickTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TChickenStrainResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, chickType: item },
              });
            }}
          />
          {/* owner */}
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
