import Button from "@components/atoms/Button/Button";
import Modal from "@components/atoms/Modal/Modal";
import { Dispatch } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  TFeedDataPayload,
  TStore,
} from "./edit.constants";
import DeleteIcon from "@icons/DeleteIcon.svg";
import Input from "@components/atoms/Input/Input";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import { IDropdownItem } from "@type/dropdown.interface";
import { TFeedBrandResponse } from "@type/response.type";
import { randomHexString } from "@services/utils/string";

const EditModal = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  let feedbrandOptions: IDropdownItem<TFeedBrandResponse>[] = [];
  state.feedBrandData.map((item) =>
    feedbrandOptions.push({
      value: item,
      label: `(${item.feedbrandCode}) ${item.feedbrandName}`,
    })
  );
  return (
    <Modal
      isVisible={state.isModalVisible}
      width={"45%"}
      title={state.isModalForFeed ? "Daily Feed Data" : "Daily OVK Data"}
      content={
        <div>
          <div>
            {/* This is Header */}
            <div className="flex flex-row w-full space-x-2  font-medium text-gray-500">
              <div className="w-16">
                <p>Actions</p>
              </div>
              <div className="flex-1">
                <p>{state.isModalForFeed ? "Feed Brand" : "OVK Brand"}</p>
              </div>
              <div className="flex-1">
                <p>Total Consumption</p>
              </div>
            </div>
            {/* This is the set of component */}
            {state.records?.map((feedData: TFeedDataPayload, index: number) => (
              <div key={feedData.id} className="mt-6 md:space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                  <div className="w-12 flex items-start justify-center">
                    <Button
                      key={`CTA-${
                        state.isModalForFeed ? "feed" : "ovk"
                      }-${index}`}
                      type="icon-outline"
                      size="lg"
                      icon={
                        <DeleteIcon
                          className={"text-red-500 group-hover:text-white"}
                        />
                      }
                      state={state.records.length > 1 ? "active" : "disabled"}
                      className={"hover:!bg-red-500 group !border-red-500"}
                      onClick={() => {
                        const filteredData = state.records.filter(
                          (e: TFeedDataPayload) => e.id !== feedData.id
                        );

                        dispatch({
                          type: ACTION_TYPE.SET_MODAL_DATA,
                          payload: filteredData,
                        });
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full">
                    {/* Feed Brand */}
                    <Dropdown
                      key={`feed-${
                        state.isModalForFeed ? "feed" : "ovk"
                      }-${index}`}
                      value={
                        state.records[
                          state.records.findIndex(
                            (data: TFeedDataPayload) => data.id === feedData.id
                          )
                        ].feedBrand
                      }
                      options={feedbrandOptions}
                      isSearchable={true}
                      onChange={(
                        dropdownItem: IDropdownItem<TFeedBrandResponse>
                      ) => {
                        let newArr = [...state.records];
                        const index = newArr.findIndex(
                          (data) => data.id === feedData.id
                        );
                        newArr[index].feedBrand = dropdownItem;
                        dispatch({
                          type: ACTION_TYPE.SET_MODAL_DATA,
                          payload: newArr,
                        });
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full">
                    {/* Total Consumption*/}
                    <Input
                      key={`feed-${
                        state.isModalForFeed ? "feed" : "ovk"
                      }-${index}`}
                      className="w-full"
                      type="number"
                      placeholder="Type here"
                      value={
                        state.records[
                          state.records.findIndex(
                            (data: TFeedDataPayload) => data.id === feedData.id
                          )
                        ].totalConsumption as number
                      }
                      onChange={(item) => {
                        let newArr = [...state.records];
                        const index = newArr.findIndex(
                          (data) => data.id === feedData.id
                        );
                        newArr[index].totalConsumption = parseInt(
                          item.target.value
                        );
                        dispatch({
                          type: ACTION_TYPE.SET_MODAL_DATA,
                          payload: newArr,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center mt-8 space-x-1">
            <Button
              title="Add"
              size="xs"
              onClick={() => {
                let newArr = state.records;
                newArr.push({
                  id: randomHexString(),
                  feedBrand: null,
                  totalConsumption: null,
                });

                dispatch({
                  type: ACTION_TYPE.SET_MODAL_DATA,
                  payload: newArr,
                });
              }}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            title="Save"
            size="xs"
            onClick={() => {
              dispatch({
                type: ACTION_TYPE.SET_MODAL_DATA,
                payload: state.records,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_MODAL_VISIBLE,
                payload: false,
              });
            }}
          />
        </div>
      }
      onCancel={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_MODAL_FOR_FEED,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_IS_MODAL_FOR_OVK,
          payload: false,
        });
      }}
    />
  );
};

export default EditModal;
