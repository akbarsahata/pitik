import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./owner.constants";

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

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* name */}
          <Input
            label="Name"
            className="w-full"
            value={state.inputSearch.name}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, name: e.target.value },
              });
            }}
          />
          {/* userCode */}
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
          {/* phoneNumber */}
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
            label="User Status"
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
