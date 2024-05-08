import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { FARMING_STATUS_HARVEST } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCoopResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";
import { MouseEventHandler } from "react";
import { ACTIONS, emptySearch, TState } from "./harvest.constants";

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

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let statusOptions: IDropdownItem<string>[] = [];
  Object.keys(FARMING_STATUS_HARVEST).forEach((key) =>
    statusOptions.push({
      value: FARMING_STATUS_HARVEST[key],
      label: key.replace(/_/g, " "),
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
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: {
                    ...state.inputSearch,
                    farmingCycleCode: e.target.value,
                  },
                },
              });
            }}
          />
          {/* Farm Name */}
          <Dropdown
            label="Farm Name"
            value={state.inputSearch.farm}
            isSearchable={true}
            options={farmOptions}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, farm: item },
                },
              });
            }}
          />
          {/* Coop */}
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

          {/* Branch */}
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

          {/* owner */}
          <Dropdown
            label="Owner"
            value={state.inputSearch.owner}
            options={ownerOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, owner: item },
                },
              });
            }}
          />

          {/* farmingCycleStatus */}
          <Dropdown
            label="Status"
            value={state.inputSearch.status}
            options={statusOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, status: item },
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
