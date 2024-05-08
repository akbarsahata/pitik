import Button from "@components/atoms/Button/Button";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import { randomHexString } from "@services/utils/string";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

const FanModal = ({
  state,
  dispatch,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
}) => {
  return (
    <Modal
      destroyOnClose={true}
      content={
        <div className="space-y-4">
          <div className="w-full">
            <Input
              className="w-full"
              label="Size (inch) *"
              type="number"
              min="1"
              value={state.inputFan.size as number}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_INPUT_FAN,
                  payload: {
                    ...state.inputFan,
                    size: parseFloat(e.target.value),
                  },
                });
              }}
            />
          </div>
          <div className="w-full">
            <Input
              className="w-full"
              label="Capacity (CFM) *"
              type="number"
              value={state.inputFan.capacity as number}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_INPUT_FAN,
                  payload: {
                    ...state.inputFan,
                    capacity: parseFloat(e.target.value),
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
                type: ACTION_TYPE.SET_INPUT_FAN,
                payload: {
                  id: "",
                  capacity: null,
                  size: null,
                },
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
                payload: false,
              });
            }}
          />
          <Button
            title="Add Fan"
            state={
              state.inputFan.capacity === null || state.inputFan.size === null
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              if (state.inputFan.id === "" || state.inputFan.id === undefined) {
                dispatch({
                  type: ACTION_TYPE.SET_FANS,
                  payload: [
                    ...state.fans,
                    {
                      id: randomHexString(),
                      capacity: state.inputFan.capacity,
                      size: state.inputFan.size,
                    },
                  ],
                });
              } else {
                const filteredData = state.fans.filter(
                  (e) => e.id !== state.inputFan.id
                );
                dispatch({
                  type: ACTION_TYPE.SET_FANS,
                  payload: [...filteredData, state.inputFan],
                });
              }
              dispatch({
                type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
                payload: false,
              });
              dispatch({
                type: ACTION_TYPE.SET_INPUT_FAN,
                payload: {
                  id: "",
                  capacity: null,
                  size: null,
                },
              });
            }}
          />
        </div>
      }
      title="Add New Fan"
      isVisible={state.isFanModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_INPUT_FAN,
          payload: {
            id: "",
            capacity: null,
            size: null,
          },
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
          payload: false,
        });
      }}
    />
  );
};

export default FanModal;
