import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCityResponse,
  TDistrictResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./farm.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let provinceOptions: IDropdownItem<TProvinceResponse>[] = [];
  state.provinceData.map((item) =>
    provinceOptions.push({
      value: item,
      label: item.provinceName,
    })
  );

  let cityOptions: IDropdownItem<TCityResponse>[] = [];
  state.cityData.map((item) =>
    cityOptions.push({
      value: item,
      label: item.cityName,
    })
  );

  let districtOptions: IDropdownItem<TDistrictResponse>[] = [];
  state.districtData.map((item) =>
    districtOptions.push({
      value: item,
      label: item.districtName,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
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
          {/* userOwnerId */}
          <Dropdown
            label="Owner"
            value={state.inputSearch.userOwner}
            options={ownerOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, userOwner: item },
              });
            }}
          />
          {/* farmCode */}
          <Input
            label="Farm Code"
            className="w-full"
            value={state.inputSearch.farmCode}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farmCode: e.target.value },
              });
            }}
          />
          {/* farm name */}
          <Input
            label="Farm Name"
            className="w-full"
            value={state.inputSearch.farmName}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farmName: e.target.value },
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
          {/* provinceId */}
          <Dropdown
            label="Province"
            value={state.inputSearch.province}
            options={provinceOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TProvinceResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  province: item,
                  city: null,
                  district: null,
                },
              });
            }}
          />
          {/* cityId */}
          <Dropdown
            label="City"
            value={state.inputSearch.city}
            options={cityOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TCityResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, city: item, district: null },
              });
            }}
          />
          {/* districtId */}
          <Dropdown
            label="District"
            value={state.inputSearch.district}
            options={districtOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TDistrictResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, district: item },
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
