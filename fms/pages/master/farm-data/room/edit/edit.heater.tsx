import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { randomHexString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { THeaterTypeResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

const HeaterModal = ({
  state,
  dispatch,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
}) => {
  let heaterTypeOptions: IDropdownItem<THeaterTypeResponse>[] = [];
  state.heaterTypeData.map((item) =>
    heaterTypeOptions.push({
      value: item,
      label: item.name,
    })
  );
  return (
    <Modal
      destroyOnClose={true}
      content={
        <div className="space-y-4">
          <div className="w-full">
            <Dropdown
              label="Heater Type *"
              value={state.inputHeater.heaterType}
              options={heaterTypeOptions}
              onChange={(item: IDropdownItem<THeaterTypeResponse>) => {
                dispatch({
                  type: ACTION_TYPE.SET_INPUT_HEATER,
                  payload: { ...state.inputHeater, heaterType: item },
                });
              }}
            />
          </div>
          <div className="w-full">
            <Input
              className="w-full"
              label="Quantity *"
              type="number"
              value={state.inputHeater.quantity as number}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_INPUT_HEATER,
                  payload: {
                    ...state.inputHeater,
                    quantity: parseInt(e.target.value),
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
            title="Cancel"
            type="outline"
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_INPUT_HEATER,
                payload: {
                  id: "",
                  heaterType: null,
                  quantity: null,
                },
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
                payload: false,
              });
            }}
          />
          <Button
            title="Add Heater"
            state={
              state.inputHeater.quantity === null ||
              state.inputHeater.heaterType === null
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              if (
                state.inputHeater.id === "" ||
                state.inputHeater.id === undefined
              ) {
                dispatch({
                  type: ACTION_TYPE.SET_HEATER_IN_ROOMS,
                  payload: [
                    ...state.heaterInRooms,
                    {
                      id: randomHexString(),
                      heaterType: state.inputHeater.heaterType,
                      quantity: state.inputHeater.quantity,
                    },
                  ],
                });
              } else {
                const filteredData = state.heaterInRooms.filter(
                  (e) => e.id !== state.inputHeater.id
                );
                dispatch({
                  type: ACTION_TYPE.SET_HEATER_IN_ROOMS,
                  payload: [...filteredData, state.inputHeater],
                });
              }
              dispatch({
                type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
                payload: false,
              });
              dispatch({
                type: ACTION_TYPE.SET_INPUT_HEATER,
                payload: {
                  id: "",
                  quantity: null,
                  heaterType: null,
                },
              });
            }}
          />
        </div>
      }
      title="Add New Heater"
      isVisible={state.isHeaterModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_INPUT_HEATER,
          payload: {
            id: "",
            quantity: null,
            heaterType: null,
          },
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
          payload: false,
        });
      }}
    />
  );
};

export default HeaterModal;
