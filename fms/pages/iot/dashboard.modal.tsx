import Modal from "@components/atoms/Modal/Modal";
import Table from "@components/molecules/Table/Table";
import { Dispatch } from "react";
import { columns } from "./dashboard.columns";
import { ACTIONS, ACTION_TYPE, TStore } from "./dashboard.constants";

const DashboardModal = ({
  state,
  dispatch,
  modalTitle,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
  modalTitle: string;
}) => {
  return (
    <Modal
      width={"75%"}
      content={
        <div>
          <Table
            tableData={state.filteredDeviceData}
            columns={columns}
            isLastPage={true}
            onClickNext={() => {}}
            onClickPrevious={() => {}}
            tablePage={1}
            scrollX={1500}
            scrollY={750}
            isPagination={false}
          />
        </div>
      }
      footer={null}
      title={modalTitle}
      isVisible={state.isDeviceModalVisible}
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE,
          payload: false,
        });
      }}
    />
  );
};

export default DashboardModal;
