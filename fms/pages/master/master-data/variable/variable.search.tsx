import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { VARIABLE_TYPE } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./variable.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let variableTypeOptions: IDropdownItem<string>[] = [];
  VARIABLE_TYPE.map((item) =>
    variableTypeOptions.push({
      value: item,
      label: item.toUpperCase(),
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
          {/* variable code */}
          <Input
            label="Variable Code"
            className="w-full"
            value={state.inputSearch.variableCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, variableCode: e.target.value },
              });
            }}
          />
          {/* variable name */}
          <Input
            label="Variable Name"
            className="w-full"
            value={state.inputSearch.variableName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, variableName: e.target.value },
              });
            }}
          />
          {/* variable UOM */}
          <Input
            label="Variable UOM"
            className="w-full"
            value={state.inputSearch.variableUOM}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, variableUOM: e.target.value },
              });
            }}
          />
          {/* variableType */}
          <Dropdown
            label="Variable Type"
            value={state.inputSearch.variableType}
            options={variableTypeOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, variableType: item },
              });
            }}
          />
          {/* status */}
          <Dropdown
            label="Variable Status"
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
