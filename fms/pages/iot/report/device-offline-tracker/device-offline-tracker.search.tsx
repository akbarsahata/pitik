import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { formatDateYearFirst } from "@services/utils/date";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TCoopResponse, TFarmResponse } from "@type/response.type";
import { MouseEventHandler } from "react";
import {
  ACTIONS,
  emptySearch,
  TState,
} from "./device-offline-tracker.constants";

const AdvanceSearch = ({
  dispatch,
  state,
  onClickOk,
}: {
  dispatch: any;
  state: TState;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const today = new Date();
  // NOTE: Min start date to check device offline tracker is 90 days or 3 months
  const minStartDate = new Date(
    new Date().setDate(today.getDate() - 90)
  ).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
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

  return (
    <Modal
      content={
        <div className="space-y-4">
          {/* Start Date */}
          <div className="flex-1 w-full">
            <Input
              className="w-full"
              type="date"
              label="Start Date*"
              value={state.inputSearch.startDate}
              min={minStartDate}
              max={formatDateYearFirst(today.toISOString())}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_INPUT_SEARCH,
                  payload: {
                    data: {
                      ...state.inputSearch,
                      startDate: e.target.value,
                    },
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
              label="End Date*"
              value={state.inputSearch.endDate}
              min={minStartDate}
              max={formatDateYearFirst(today.toISOString())}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_INPUT_SEARCH,
                  payload: {
                    data: {
                      ...state.inputSearch,
                      endDate: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>

          {/* farmId */}
          <Dropdown
            label="Farm"
            value={state.inputSearch.farm}
            isSearchable={true}
            options={farmOptions}
            onChange={(item: IDropdownItem<TFarmResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, farm: item, coop: null },
                },
              });
            }}
          />
          {/* coopId */}
          <Dropdown
            label="Coop"
            value={state.inputSearch.coop}
            isSearchable={true}
            options={coopOptions}
            onChange={(item: IDropdownItem<TCoopResponse>) => {
              dispatch({
                type: ACTIONS.SET_INPUT_SEARCH,
                payload: {
                  data: { ...state.inputSearch, coop: item },
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
              isEmptyString(state.inputSearch.startDate) ||
              isEmptyString(state.inputSearch.endDate)
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
