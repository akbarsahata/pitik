import Button from "@components/atoms/Button/Button";
import Modal from "@components/atoms/Modal/Modal";
import WarningIcon from "@icons/WarningIcon.svg";
import { MouseEventHandler } from "react";
import { ACTIONS, ERROR_TYPE, TState } from "./details.constants";

const DeleteModal = ({
  state,
  dispatch,
  onClickOk,
  deleteRealization,
}: {
  state: TState;
  dispatch: any;
  onClickOk: MouseEventHandler<HTMLButtonElement> | undefined;
  deleteRealization: any;
}) => {
  return (
    <Modal
      destroyOnClose={true}
      content={
        <div className="space-y-4">
          <p>Are you sure you want to permanently remove this item?</p>
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
              deleteRealization.isLoading && !deleteRealization.isError
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTIONS.SET_ERROR_TYPE,
                payload: { data: ERROR_TYPE.NONE },
              });
              dispatch({
                type: ACTIONS.SET_IS_DELETE_MODAL_VISIBLE,
                payload: { data: false },
              });
            }}
          />
          <Button
            title="Remove"
            state={
              deleteRealization.isLoading && !deleteRealization.isError
                ? "loading"
                : "active"
            }
            size="xs"
            onClick={onClickOk}
          />
        </div>
      }
      title="Remove realization"
      isVisible={state.isDeleteModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTIONS.SET_ERROR_TYPE,
          payload: { data: ERROR_TYPE.NONE },
        });
        dispatch({
          type: ACTIONS.SET_IS_DELETE_MODAL_VISIBLE,
          payload: { data: false },
        });
      }}
    />
  );
};

export default DeleteModal;
