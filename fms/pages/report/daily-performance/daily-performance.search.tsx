import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { FARMING_STATUS } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCityResponse,
  TCoopResponse,
  TDistrictResponse,
  TFarmResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  search,
  TStore,
} from "./daily-performance.constants";

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

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
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

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let summaryOptions: IDropdownItem<string>[] = [];
  ["Below", "Average", "Good"].map((item) =>
    summaryOptions.push({
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

  let pplOptions: IDropdownItem<TUserResponse>[] = [];
  state.pplData.map((item: TUserResponse) =>
    pplOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  return (
    <Modal
      content={
        <div className="space-y-4">
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
          {/* summary */}
          <Dropdown
            label="Summary"
            value={state.inputSearch.summary}
            options={summaryOptions}
            onChange={(item: IDropdownItem<string>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, summary: item },
              });
            }}
          />
          {/* PPL */}
          <Dropdown
            label="PPL"
            value={state.inputSearch.ppl}
            options={pplOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TUserResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, ppl: item },
              });
            }}
          />
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
          {/* districtId */}
          <Dropdown
            label="Branch"
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
