import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { formatDateYearFirst, getDatesBetween } from "@services/utils/date";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TBuildingTypeResponse,
  TCoopResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  TRoomResponse,
} from "@type/response.type";
import { Dispatch, MouseEventHandler } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./historical-data.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const today = new Date();
  // NOTE: Min start date to check historical data is 40 days or 1 farming cycle
  const minStartDate = new Date(
    new Date().setDate(today.getDate() - 40)
  ).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  let deviceTypeOptions: IDropdownItem<TDeviceTypeResponse>[] = [];
  state.deviceTypeData.map((item) =>
    deviceTypeOptions.push({
      value: item,
      label:
        item.text === "Climate Monitoring" ? "Smart Monitoring" : item.text,
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

  let buildingOptions: IDropdownItem<TBuildingTypeResponse>[] = [];
  state.buildingData.map((item) =>
    buildingOptions.push({
      value: item,
      label: item.name,
    })
  );

  let roomOptions: IDropdownItem<TRoomResponse>[] = [];
  state.roomData.map((item: TRoomResponse) =>
    roomOptions.push({
      value: item,
      label: `(${item.roomCode}) ${item?.roomType.name}`,
    })
  );

  //Set limit interval based on start date and end date
  let intervalList: number[] = [60, 120, 180, 720, 1440];
  const countDays = getDatesBetween(
    new Date(state.inputSearch.startDate),
    new Date(state.inputSearch.endDate)
  );
  if (countDays.length > 0) {
    if (countDays.length < 2) {
      intervalList.unshift(10, 30);
    } else if (countDays.length > 1 && countDays.length < 3) {
      intervalList.unshift(30);
    }
  }

  let intervalOptions: IDropdownItem<number>[] = [];
  intervalList.map((item) => {
    intervalOptions.push({
      value: item,
      label:
        item === 10 || item === 30 ? `${item} Minutes` : `${item / 60} Hours`,
    });
  });

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* Device Type */}
          <Dropdown
            label="Device Type *"
            value={state.inputSearch.deviceType}
            options={deviceTypeOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TDeviceTypeResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  deviceType: item,
                  device: null,
                  coop: null,
                },
              });
            }}
          />

          {/* farm */}
          <Dropdown
            label="Farm *"
            value={state.inputSearch.farm}
            options={farmOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_COOP_DATA,
                payload: [],
              });
              dispatch({
                type: ACTION_TYPE.SET_BUILDING_DATA,
                payload: [],
              });
              dispatch({
                type: ACTION_TYPE.SET_ROOM_DATA,
                payload: [],
              });
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  farm: item,
                  coop: null,
                  building: null,
                  room: null,
                },
              });
            }}
          />

          {/* coopId */}
          <Dropdown
            label="Coop *"
            value={state.inputSearch.coop}
            isSearchable={true}
            options={coopOptions}
            onChange={(item: IDropdownItem<TCoopResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  coop: item,
                  device: null,
                },
              });
            }}
          />

          {/* building */}
          <Dropdown
            label="Building *"
            value={state.inputSearch.building}
            options={buildingOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TBuildingResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, building: item, room: null },
              });
            }}
          />

          {/* room */}
          <Dropdown
            label="Room *"
            value={state.inputSearch.room}
            options={roomOptions}
            isSearchable={true}
            onChange={(item: IDropdownItem<TRoomResponse>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, room: item },
              });
            }}
          />

          {/* macAddress */}
          <Input
            label="MAC Address *"
            className="w-full"
            value={state.inputSearch.macAddress}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: { ...state.inputSearch, macAddress: e.target.value },
              });
            }}
          />

          <div className="flex w-full">
            {/* Start Date */}
            <div className="flex-1 w-full mr-3">
              <Input
                className="w-full"
                type="date"
                label="Start Date *"
                value={state.inputSearch.startDate}
                min={minStartDate}
                max={formatDateYearFirst(today.toISOString())}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_INPUT_SEARCH,
                    payload: {
                      ...state.inputSearch,
                      startDate: e.target.value,
                    },
                  });
                }}
              />
            </div>

            {/* End Date */}
            <div className="flex-1 w-full">
              <Input
                className="w-full"
                type="date"
                label="End Date *"
                value={state.inputSearch.endDate}
                min={minStartDate}
                max={formatDateYearFirst(today.toISOString())}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_INPUT_SEARCH,
                    payload: {
                      ...state.inputSearch,
                      endDate: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>

          {/* interval */}
          <Dropdown
            label="Interval *"
            value={state.inputSearch.interval}
            isSearchable={true}
            options={intervalOptions}
            onChange={(item: IDropdownItem<number>) => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_SEARCH,
                payload: {
                  ...state.inputSearch,
                  interval: item,
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
            state={
              state.inputSearch.deviceType === null ||
              state.inputSearch.farm === null ||
              state.inputSearch.coop === null ||
              state.inputSearch.building === null ||
              state.inputSearch.room === null ||
              state.inputSearch.macAddress === "" ||
              isEmptyString(state.inputSearch.startDate) ||
              isEmptyString(state.inputSearch.endDate) ||
              state.inputSearch.interval === null
                ? "disabled"
                : "active"
            }
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
