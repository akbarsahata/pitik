import Button from "@components/atoms/Button/Button";
import Modal from "@components/atoms/Modal/Modal";
import WarningIcon from "@icons/WarningIcon.svg";
import { Dispatch, MouseEventHandler } from "react";
import { UseMutationResult } from "react-query";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./firmware.constants";

const DeleteModal = ({
  state,
  dispatch,
  onClickOk,
  deleteFirmware,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
  deleteFirmware: UseMutationResult<void, unknown, string, unknown>;
}) => {
  return (
    <Modal
      destroyOnClose={true}
      content={
        <div className="space-y-4">
          <p>Are you sure you want to permanently remove this firmware?</p>
          <div
            className={`${
              state.errorType === ERROR_TYPE.GENERAL ? "flex" : "hidden"
            } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4`}
          >
            <div className="mr-2 text-red-500 text-xl">
              <WarningIcon />
            </div>
            <p className="text-red-500">Failed: {state.errorText}</p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-1 space-x-2 items-center justify-end">
          <Button
            title="Cancel"
            type="outline"
            state={
              deleteFirmware.isLoading && !deleteFirmware.isError
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_ERROR_TYPE,
                payload: ERROR_TYPE.NONE,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
                payload: false,
              });
            }}
          />
          <Button
            title="Remove"
            state={
              deleteFirmware.isLoading && !deleteFirmware.isError
                ? "loading"
                : "active"
            }
            size="xs"
            onClick={onClickOk}
          />
        </div>
      }
      title="Remove Device"
      isVisible={state.isDeleteModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.NONE,
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
          payload: false,
        });
      }}
    />
  );
};

export default DeleteModal;
