import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TVariableResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  search,
  TStore,
} from "./target-library.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
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

  let variableOptions: IDropdownItem<TVariableResponse>[] = [];
  state.variableData.map((item) =>
    variableOptions.push({
      value: item,
      label: `(${item.variableCode}) ${item.variableName}`,
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* targetCode */}
          <Input
            label="Target Code"
            className="w-full"
            value={state.inputSearch.targetCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, targetCode: e.target.value },
              });
            }}
          />
          {/* targetName */}
          <Input
            label="Target Name"
            className="w-full"
            value={state.inputSearch.targetName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, targetName: e.target.value },
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
          {/* variableId */}
          <Dropdown
            label="Variable"
            value={state.inputSearch.variable}
            options={variableOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TVariableResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, variable: item },
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
