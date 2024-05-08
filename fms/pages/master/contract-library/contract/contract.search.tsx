import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import { TBranchResponse, TContractTypeResponse } from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./contract.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let contractTypeOptions: IDropdownItem<TContractTypeResponse>[] = [];
  state.contractTypeData.map((item) =>
    contractTypeOptions.push({
      value: item,
      label: item.contractName,
    })
  );

  let customizeOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    customizeOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    })
  );

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
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
          {/* customized contract */}
          <Dropdown
            label="Customized Contract"
            value={state.inputSearch.customize}
            options={customizeOptions}
            onChange={(item: IDropdownItem<boolean>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, customize: item },
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
          {/* Effective Start Date */}
          <div className="flex-1 w-full">
            <Input
              className="w-full"
              type="date"
              label="Effective Start Date"
              value={state.inputSearch.effectiveStartDate}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_INPUT_SEARCH,
                  payload: {
                    ...state.inputSearch,
                    effectiveStartDate: e.target.value,
                  },
                });
              }}
            />
          </div>
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
