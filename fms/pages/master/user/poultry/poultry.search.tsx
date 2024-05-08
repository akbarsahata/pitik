import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import { TUserResponse } from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import {
  ACTION_TYPE,
  TStore,
  ROLE_TYPES,
  search,
  ACTIONS,
} from "./poultry.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let userStatusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    userStatusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let roleOptions: IDropdownItem<string>[] = [];
  ROLE_TYPES.map((item) =>
    roleOptions.push({
      value: item,
      label: item.toUpperCase(),
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* rolw */}
          <Dropdown
            label="Role"
            value={state.inputSearch.userType}
            options={roleOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, userType: item },
              });
            }}
          />
          {/* owner */}
          <Dropdown
            label="Owner"
            isSearchable={true}
            value={state.inputSearch.owner}
            options={ownerOptions}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, owner: item },
              });
            }}
          />
          {/* user code */}
          <Input
            label="User Code"
            className="w-full"
            value={state.inputSearch.userCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, userCode: e.target.value },
              });
            }}
          />
          {/* full name */}
          <Input
            label="Full Name"
            className="w-full"
            value={state.inputSearch.fullName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, fullName: e.target.value },
              });
            }}
          />
          {/* email */}
          <Input
            label="Email"
            className="w-full"
            value={state.inputSearch.email}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, email: e.target.value },
              });
            }}
          />
          {/* phone number */}
          <Input
            label="Phone Number"
            type="phone"
            className="w-full"
            value={state.inputSearch.phoneNumber}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, phoneNumber: e.target.value },
              });
            }}
          />
          {/* waNumber */}
          <Input
            label="WhatsApp Number"
            type="phone"
            className="w-full"
            value={state.inputSearch.waNumber}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, waNumber: e.target.value },
              });
            }}
          />
          {/* status */}
          <Dropdown
            label="Poultry Status"
            value={state.inputSearch.status}
            options={userStatusOptions}
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
