import DropdownMenuItem from "@components/atoms/DropdownItem/DropdownItem";
import Input from "@components/atoms/Input/Input";
import OldDropdown from "@components/atoms/OldDropdown/OldDropdown";
import {
  CONTRACT,
  PERFORMANCE_SUMMARY,
  PROBLEM_DISEASES,
  PROBLEM_FARM_INPUT,
  PROBLEM_FORCE_MAJEURE,
  PROBLEM_INFRASTRUCTURE,
  PROBLEM_MANAGEMENT,
  TREATMENT,
} from "@constants/index";
import CheckBoxBlankIcon from "@icons/CheckBoxBlankIcon.svg";
import CheckBoxFilledIcon from "@icons/CheckBoxFilledIcon.svg";
import { formatDateWithoutClock } from "@services/utils/date";
import { TDailyPerformanceDetailsResponse } from "@type/response.type";
import { Menu, Table } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { Dispatch, ReactNode } from "react";
import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";
import Button from "@components/atoms/Button/Button";

const TableColumns = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  let detailsData = state.detailsData;
  const CommentOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let commentOptions: ItemType[] = [];
    PERFORMANCE_SUMMARY.map((comment) =>
      commentOptions.push({
        label: (
          <DropdownMenuItem
            onClick={() => {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].summary = comment;

              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }}
            title={comment}
          />
        ),
        key: comment,
      })
    );
    return (
      <Menu
        className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg"
        items={commentOptions}
      />
    );
  };

  const InfrastructureOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let infrastructureOptions: ReactNode[] = [];
    PROBLEM_INFRASTRUCTURE.map((problem) =>
      infrastructureOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].issues.infrastructure.includes(problem) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.infrastructure.includes(problem)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.infrastructure.indexOf(problem);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.infrastructure.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.infrastructure = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.infrastructure,
                problem,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={problem}
        />
      )
    );
    if (PROBLEM_INFRASTRUCTURE.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {infrastructureOptions}
        </div>
      );
    }
  };

  const ManagementOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let managementOptions: ReactNode[] = [];
    PROBLEM_MANAGEMENT.map((problem) =>
      managementOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].issues.management.includes(problem) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.management.includes(problem)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.management.indexOf(problem);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.management.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.management = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.management,
                problem,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={problem}
        />
      )
    );
    if (PROBLEM_MANAGEMENT.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {managementOptions}
        </div>
      );
    }
  };

  const FarmInputOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let farmInputOptions: ReactNode[] = [];
    PROBLEM_FARM_INPUT.map((problem) =>
      farmInputOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].issues.farmInput.includes(problem) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.farmInput.includes(problem)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.farmInput.indexOf(problem);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.farmInput.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.farmInput = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.farmInput,
                problem,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={problem}
        />
      )
    );
    if (PROBLEM_FARM_INPUT.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {farmInputOptions}
        </div>
      );
    }
  };

  const DiseasesOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let diseasesOptions: ReactNode[] = [];
    PROBLEM_DISEASES.map((problem) =>
      diseasesOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].issues.diseases.includes(problem) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.diseases.includes(problem)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.diseases.indexOf(problem);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.diseases.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.diseases = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.diseases,
                problem,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={problem}
        />
      )
    );
    if (PROBLEM_DISEASES.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {diseasesOptions}
        </div>
      );
    }
  };

  const ForceMajeureOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let forceMajeureOptions: ReactNode[] = [];
    PROBLEM_FORCE_MAJEURE.map((problem) =>
      forceMajeureOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].issues.forceMajeure.includes(problem) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.forceMajeure.includes(problem)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.forceMajeure.indexOf(problem);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.forceMajeure.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].issues.forceMajeure = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].issues.forceMajeure,
                problem,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={problem}
        />
      )
    );
    if (PROBLEM_FORCE_MAJEURE.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {forceMajeureOptions}
        </div>
      );
    }
  };

  const TreatmentOptions = ({
    item,
  }: {
    item: TDailyPerformanceDetailsResponse;
  }) => {
    let treatmentOptions: ReactNode[] = [];
    TREATMENT.map((treatment) =>
      treatmentOptions.push(
        <DropdownMenuItem
          tailIcon={
            detailsData[
              detailsData.findIndex((data) => data.id === item.id)
            ].treatment.includes(treatment) ? (
              <CheckBoxFilledIcon className="text-primary-100 text-xl ml-4" />
            ) : (
              <CheckBoxBlankIcon className="text-xl ml-4" />
            )
          }
          onClick={() => {
            if (
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].treatment.includes(treatment)
            ) {
              const index =
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].treatment.indexOf(treatment);
              if (index > -1) {
                detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].treatment.splice(index, 1);
              }
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            } else {
              detailsData[
                detailsData.findIndex((data) => data.id === item.id)
              ].treatment = [
                ...detailsData[
                  detailsData.findIndex((data) => data.id === item.id)
                ].treatment,
                treatment,
              ];
              dispatch({
                type: ACTION_TYPE.SET_DETAILS_DATA,
                payload: detailsData,
              });
            }
          }}
          title={treatment}
        />
      )
    );
    if (TREATMENT.length === 0) {
      return (
        <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow-lg ">
          <p className="text-center mx-auto my-4">No data...</p>
        </div>
      );
    } else {
      return (
        <div className="overflow-auto max-h-96 w-full bg-white border border-gray-200 rounded-md drop-shadow-lg px-4 py-2">
          {treatmentOptions}
        </div>
      );
    }
  };

  return (
    <Table
      dataSource={detailsData}
      scroll={{
        x: 1800,
        y: 500,
      }}
      pagination={false}
    >
      <ColumnGroup title="Detail &amp; Action">
        <Column
          title="Date"
          dataIndex="date"
          key="date"
          fixed="left"
          width={150}
          align="center"
          render={(item: string) => formatDateWithoutClock(item || "") || ""}
        />
        <Column
          title="Day"
          dataIndex="day"
          key="day"
          fixed="left"
          width={80}
          align="center"
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          fixed="left"
          width={120}
          align="center"
          render={(record: string) =>
            (
              <p
                className={`${
                  record === "Segera Isi" || record === "Segera Review"
                    ? "bg-yellow-200 text-yellow-900"
                    : record == "Sudah Isi" || record === "Sudah Review"
                    ? "bg-blue-200 text-blue-600"
                    : record == "Telat"
                    ? "bg-red-200 text-red-600"
                    : record == "Selesai"
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record || "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="Daily Data &amp; Summary" fixed={true}>
        <Column
          title="BW Data (gr)"
          key="bw"
          width={120}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Input
                key={record.id}
                type="number"
                placeholder="Input"
                className="w-full"
                size="sm"
                value={
                  (detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ]?.bw.actual as number) || undefined
                }
                onChange={(e) => {
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].bw.actual = parseFloat(e.target.value);

                  dispatch({
                    type: ACTION_TYPE.SET_DETAILS_DATA,
                    payload: detailsData,
                  });
                }}
              />
            </div>
          )}
        />
        <Column
          title="Daily Feed Data (sack)"
          key="feed"
          width={175}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Button
                isAnchor={false}
                size="xs"
                onClick={() => {
                  dispatch({
                    type: ACTION_TYPE.SET_IS_MODAL_VISIBLE,
                    payload: true,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_IS_MODAL_FOR_FEED,
                    payload: true,
                  });
                }}
                title={
                  !detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].feed
                    ? "Add Record"
                    : "View Data"
                }
                type="primary"
                state="active"
                className="w-full"
              />
            </div>
          )}
        />
        <Column
          className={
            state.summaryData.farm.coop.contractType !== CONTRACT[2]
              ? "hidden"
              : ""
          }
          title="Daily OVK Data"
          key="feed"
          width={175}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Button
                isAnchor={false}
                size="xs"
                onClick={() => {
                  dispatch({
                    type: ACTION_TYPE.SET_IS_MODAL_VISIBLE,
                    payload: true,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_IS_MODAL_FOR_OVK,
                    payload: true,
                  });
                }}
                title={
                  !detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].ovk
                    ? "Add Record"
                    : "View Data"
                }
                type="primary"
                state="active"
                className="w-full"
              />
            </div>
          )}
        />
        <Column
          title="Dead Chicken Data"
          key="dead"
          width={170}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Input
                key={record.id}
                type="number"
                placeholder="Input"
                className="w-full"
                size="sm"
                value={
                  (detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ]?.dead as number) || undefined
                }
                onChange={(e) => {
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].dead = parseInt(e.target.value);

                  dispatch({
                    type: ACTION_TYPE.SET_DETAILS_DATA,
                    payload: detailsData,
                  });
                }}
              />
            </div>
          )}
        />
        <Column
          title="Culled Chicken Data"
          key="culled"
          width={180}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Input
                key={record.id}
                type="number"
                placeholder="Input"
                className="w-full"
                size="sm"
                value={
                  (detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ]?.culled as number) || undefined
                }
                onChange={(e) => {
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].culled = parseInt(e.target.value);

                  dispatch({
                    type: ACTION_TYPE.SET_DETAILS_DATA,
                    payload: detailsData,
                  });
                }}
              />
            </div>
          )}
        />
        <Column
          title="Comment/Summary"
          key="summary"
          width={160}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.summary || "Select..."
              }
              menu={<CommentOptions item={record} />}
            />
          )}
        />
      </ColumnGroup>
      <ColumnGroup title="List Problems" fixed={true}>
        <Column
          title="Infrastructure"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                (detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.issues.infrastructure?.length &&
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ]?.issues.infrastructure?.length.toString() +
                    ` issue${
                      detailsData[
                        detailsData.findIndex((data) => data.id === record.id)
                      ]?.issues.infrastructure?.length > 1
                        ? "s"
                        : ""
                    }`) ||
                "Select..."
              }
              menu={<InfrastructureOptions item={record} />}
            />
          )}
        />
        <Column
          title="Management"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                (detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.issues.management.length &&
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].issues.management.length.toString() +
                    ` issue${
                      detailsData[
                        detailsData.findIndex((data) => data.id === record.id)
                      ].issues.management.length > 1
                        ? "s"
                        : ""
                    }`) ||
                "Select..."
              }
              menu={<ManagementOptions item={record} />}
            />
          )}
        />
        <Column
          title="Farm Input"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                (detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.issues.farmInput.length &&
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].issues.farmInput.length.toString() +
                    ` issue${
                      detailsData[
                        detailsData.findIndex((data) => data.id === record.id)
                      ].issues.farmInput.length > 1
                        ? "s"
                        : ""
                    }`) ||
                "Select..."
              }
              menu={<FarmInputOptions item={record} />}
            />
          )}
        />
        <Column
          title="Diseases"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                (detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.issues.diseases.length &&
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].issues.diseases.length.toString() +
                    ` issue${
                      detailsData[
                        detailsData.findIndex((data) => data.id === record.id)
                      ].issues.diseases.length > 1
                        ? "s"
                        : ""
                    }`) ||
                "Select..."
              }
              menu={<DiseasesOptions item={record} />}
            />
          )}
        />
        <Column
          title="Force Majeure"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <OldDropdown
              size="sm"
              title={
                (detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ]?.issues.forceMajeure.length &&
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].issues.forceMajeure.length.toString() +
                    ` issue${
                      detailsData[
                        detailsData.findIndex((data) => data.id === record.id)
                      ].issues.forceMajeure.length > 1
                        ? "s"
                        : ""
                    }`) ||
                "Select..."
              }
              menu={<ForceMajeureOptions item={record} />}
            />
          )}
        />
        <Column
          title="Others"
          key="issues"
          width={200}
          align="center"
          render={(record) => (
            <div key={record.id} className="w-full">
              <Input
                key={record.id}
                placeholder="Input"
                className="w-full"
                size="sm"
                value={
                  (detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ]?.issues.others as string) || undefined
                }
                onChange={(e) => {
                  detailsData[
                    detailsData.findIndex((data) => data.id === record.id)
                  ].issues.others = e.target.value;

                  dispatch({
                    type: ACTION_TYPE.SET_DETAILS_DATA,
                    payload: detailsData,
                  });
                }}
              />
            </div>
          )}
        />
      </ColumnGroup>
      <Column
        title="Treatment"
        key="treatment"
        width={200}
        align="center"
        render={(record) => (
          <OldDropdown
            size="sm"
            title={
              (detailsData[
                detailsData.findIndex((data) => data.id === record.id)
              ]?.treatment.length &&
                detailsData[
                  detailsData.findIndex((data) => data.id === record.id)
                ].treatment.length.toString() +
                  ` issue${
                    detailsData[
                      detailsData.findIndex((data) => data.id === record.id)
                    ].treatment.length > 1
                      ? "s"
                      : ""
                  }`) ||
              "Select..."
            }
            menu={<TreatmentOptions item={record} />}
          />
        )}
      />
    </Table>
  );
};

export default TableColumns;
