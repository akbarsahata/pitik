import Button from "@components/atoms/Button/Button";
import DropdownMenuItem from "@components/atoms/DropdownItem/DropdownItem";
import Input from "@components/atoms/Input/Input";
import CheckBoxBlankIcon from "@icons/CheckBoxBlankIcon.svg";
import CheckBoxFilledIcon from "@icons/CheckBoxFilledIcon.svg";
import { isEmptyString } from "@services/utils/string";
import { Modal } from "antd";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

const AlertModal = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  return (
    <Modal
      footer={
        <div className="flex flex-1 items-center justify-end">
          <Button
            title="Add to preset"
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_IS_ALERT_LIST_MODAL_VISIBLE,
                payload: false,
              });
              dispatch({
                type: ACTION_TYPE.SET_ALERT_IDS,
                payload: state.selectedAlerts,
              });
              dispatch({
                type: ACTION_TYPE.SET_TABLE_DATA,
                payload: state.selectedAlertDetails,
              });
            }}
          />
        </div>
      }
      title="Alert Presets"
      visible={state.isAlertListModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_ALERT_LIST_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_ALERTS,
          payload: state.alertIds,
        });
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
          payload: state.tableData,
        });
      }}
    >
      <Input
        className="w-full"
        type="text"
        value={state.searchAlertValue}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (
            (e.key === "Backspace" || e.key === "Delete") &&
            isEmptyString(state.searchAlertValue)
          ) {
            dispatch({
              type: ACTION_TYPE.SET_SEARCH_ALERT_RESULT,
              payload: state.alertListData,
            });
          }
        }}
        onChange={(e) => {
          const result = state.alertListData.filter(
            (item) =>
              (item.alertCode &&
                item.alertCode
                  .toLocaleLowerCase()
                  .includes(e.target.value.toLowerCase())) ||
              (item.alertName &&
                item.alertName
                  .toLocaleLowerCase()
                  .includes(e.target.value.toLowerCase()))
          );
          dispatch({
            type: ACTION_TYPE.SET_SEARCH_ALERT_VALUE,
            payload: e.target.value,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH_ALERT_RESULT,
            payload: result,
          });
        }}
      />

      <div className="flex flex-col items-start justify-start mt-6 h-[300px] overflow-y-scroll">
        {isEmptyString(state.searchAlertValue) ? (
          state.alertListData.map((item) => (
            <div key={item.id}>
              <DropdownMenuItem
                onClick={() => {
                  if (state.selectedAlerts.includes(item.id)) {
                    const filteredData = state.selectedAlerts.filter(
                      (e) => e !== item.id
                    );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERTS,
                      payload: filteredData,
                    });
                    const filteredDetailsData =
                      state.selectedAlertDetails.filter(
                        (e) => e.id !== item.id
                      );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
                      payload: filteredDetailsData,
                    });
                  } else {
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERTS,
                      payload: [...state.selectedAlerts, item.id],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
                      payload: [...state.selectedAlertDetails, item],
                    });
                  }
                }}
                className="py-3"
                title={`(${item.alertCode}): ${item.alertName}`}
                leadIcon={
                  state.selectedAlerts.includes(item.id) ? (
                    <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
                  ) : (
                    <CheckBoxBlankIcon className="text-xl ml-4" />
                  )
                }
              />
            </div>
          ))
        ) : state.searchAlertResult.length !== 0 ? (
          state.searchAlertResult.map((item) => (
            <div key={item.id}>
              <DropdownMenuItem
                onClick={() => {
                  if (state.selectedAlerts.includes(item.id)) {
                    const filteredData = state.selectedAlerts.filter(
                      (e) => e !== item.id
                    );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERTS,
                      payload: filteredData,
                    });
                    const filteredDetailsData =
                      state.selectedAlertDetails.filter(
                        (e) => e.id !== item.id
                      );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
                      payload: filteredDetailsData,
                    });
                  } else {
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERTS,
                      payload: [...state.selectedAlerts, item.id],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
                      payload: [...state.selectedAlertDetails, item],
                    });
                  }
                }}
                className="py-3"
                key={item.id}
                title={`(${item.alertCode}): ${item.alertName}`}
                leadIcon={
                  state.selectedAlerts.includes(item.id) ? (
                    <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
                  ) : (
                    <CheckBoxBlankIcon className="text-xl ml-4" />
                  )
                }
              />
            </div>
          ))
        ) : (
          <p>No data...</p>
        )}
      </div>
    </Modal>
  );
};

export default AlertModal;
