import Button from "@components/atoms/Button/Button";
import DropdownMenuItem from "@components/atoms/DropdownItem/DropdownItem";
import Input from "@components/atoms/Input/Input";
import CheckBoxBlankIcon from "@icons/CheckBoxBlankIcon.svg";
import CheckBoxFilledIcon from "@icons/CheckBoxFilledIcon.svg";
import { isEmptyString } from "@services/utils/string";
import { Modal } from "antd";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

const TaskModal = ({
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
                type: ACTION_TYPE.SET_IS_TASK_LIST_MODAL_VISIBLE,
                payload: false,
              });
              dispatch({
                type: ACTION_TYPE.SET_TASK_IDS,
                payload: state.selectedTasks,
              });
              dispatch({
                type: ACTION_TYPE.SET_TABLE_DATA,
                payload: state.selectedTaskDetails,
              });
            }}
          />
        </div>
      }
      title="Task Presets"
      visible={state.isTaskListModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_TASK_LIST_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_TASKS,
          payload: state.taskIds,
        });
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
          payload: state.tableData,
        });
      }}
    >
      <Input
        className="w-full"
        type="text"
        value={state.searchTaskValue}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (
            (e.key === "Backspace" || e.key === "Delete") &&
            isEmptyString(state.searchTaskValue)
          ) {
            dispatch({
              type: ACTION_TYPE.SET_SEARCH_TASK_RESULT,
              payload: state.taskListData,
            });
          }
        }}
        onChange={(e) => {
          const result = state.taskListData.filter(
            (item) =>
              (item.taskCode &&
                item.taskCode
                  .toLocaleLowerCase()
                  .includes(e.target.value.toLowerCase())) ||
              (item.taskName &&
                item.taskName
                  .toLocaleLowerCase()
                  .includes(e.target.value.toLowerCase()))
          );
          dispatch({
            type: ACTION_TYPE.SET_SEARCH_TASK_VALUE,
            payload: e.target.value,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH_TASK_RESULT,
            payload: result,
          });
        }}
      />

      <div className="flex flex-col items-start justify-start mt-6 h-[300px] overflow-y-scroll">
        {isEmptyString(state.searchTaskValue) ? (
          state.taskListData.map((item) => (
            <div key={item.id}>
              <DropdownMenuItem
                onClick={() => {
                  if (state.selectedTasks.includes(item.id)) {
                    const filteredData = state.selectedTasks.filter(
                      (e) => e !== item.id
                    );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASKS,
                      payload: filteredData,
                    });
                    const filteredDetailsData =
                      state.selectedTaskDetails.filter((e) => e.id !== item.id);
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
                      payload: filteredDetailsData,
                    });
                  } else {
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASKS,
                      payload: [...state.selectedTasks, item.id],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
                      payload: [...state.selectedTaskDetails, item],
                    });
                  }
                }}
                className="py-3"
                title={`(${item.taskCode}): ${item.taskName}`}
                leadIcon={
                  state.selectedTasks.includes(item.id) ? (
                    <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
                  ) : (
                    <CheckBoxBlankIcon className="text-xl ml-4" />
                  )
                }
              />
            </div>
          ))
        ) : state.searchTaskResult.length !== 0 ? (
          state.searchTaskResult.map((item) => (
            <div key={item.id}>
              <DropdownMenuItem
                onClick={() => {
                  if (state.selectedTasks.includes(item.id)) {
                    const filteredData = state.selectedTasks.filter(
                      (e) => e !== item.id
                    );
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASKS,
                      payload: filteredData,
                    });
                    const filteredDetailsData =
                      state.selectedTaskDetails.filter((e) => e.id !== item.id);
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
                      payload: filteredDetailsData,
                    });
                  } else {
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASKS,
                      payload: [...state.selectedTasks, item.id],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
                      payload: [...state.selectedTaskDetails, item],
                    });
                  }
                }}
                className="py-3"
                key={item.id}
                title={`(${item.taskCode}): ${item.taskName}`}
                leadIcon={
                  state.selectedTasks.includes(item.id) ? (
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

export default TaskModal;
