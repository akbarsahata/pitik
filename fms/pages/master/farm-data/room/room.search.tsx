import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Modal from "@components/atoms/Modal/Modal";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TBuildingTypeResponse,
  TCoopResponse,
  TFarmResponse,
  TFloorTypeResponse,
  TRoomTypeResponse,
  TUserResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, search, TStore } from "./room.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  let buildingOptions: IDropdownItem<TBuildingResponse>[] = [];
  state.buildingData.map((item) =>
    buildingOptions.push({
      value: item,
      label: `(${item.buildingType.name}) ${item.name}`,
    })
  );

  let buildingTypeOptions: IDropdownItem<TBuildingTypeResponse>[] = [];
  state.buildingTypeData.map((item) =>
    buildingTypeOptions.push({
      value: item,
      label: item.name,
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

  let roomTypeOptions: IDropdownItem<TRoomTypeResponse>[] = [];
  state.roomTypeData.map((item) =>
    roomTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let floorTypeOptions: IDropdownItem<TFloorTypeResponse>[] = [];
  state.floorTypeData.map((item) =>
    floorTypeOptions.push({
      value: item,
      label: item.name,
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
          {/* farmId */}
          <Dropdown
            label="Farm"
            value={state.inputSearch.farm}
            isSearchable={true}
            options={farmOptions}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, farm: item, building: null },
              });
            }}
          />
          {/* buildingId */}
          <Dropdown
            label="Building"
            value={state.inputSearch.building}
            options={buildingOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBuildingResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, building: item },
              });
            }}
          />
          {/* buildingTypeId */}
          <Dropdown
            label="Building Type"
            value={state.inputSearch.buildingType}
            options={buildingTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBuildingTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, buildingType: item },
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
          {/* roomTypeId */}
          <Dropdown
            label="Room Type"
            value={state.inputSearch.roomType}
            options={roomTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TRoomTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, roomType: item },
              });
            }}
          />
          {/* floorTypeId */}
          <Dropdown
            label="Floor Type"
            value={state.inputSearch.floorType}
            options={floorTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TFloorTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, floorType: item },
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
