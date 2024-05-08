import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TContractTypeResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./coop.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let coopTypeOptions: IDropdownItem<TCoopTypeResponse>[] = [];
  state.coopTypeData.map((item) =>
    coopTypeOptions.push({
      value: item,
      label: `(${item.coopTypeCode}) ${item.coopTypeName}`,
    })
  );

  let contractTypeOptions: IDropdownItem<TContractTypeResponse>[] = [];
  state.contractTypeData.map((item) =>
    contractTypeOptions.push({
      value: item,
      label: item.contractName,
    })
  );

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
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
            label="Coop Code"
            className="w-full"
            value={state.inputSearch.coopCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, coopCode: e.target.value },
              });
            }}
          />
          {/* coopName */}
          <Input
            label="Coop Name"
            className="w-full"
            value={state.inputSearch.coopName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, coopName: e.target.value },
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
          {/* contract */}
          <Dropdown
            label="Contract Type"
            value={state.inputSearch.contractType}
            options={contractTypeOptions}
            onChange={(item: IDropdownItem<TContractTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, contractType: item },
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
