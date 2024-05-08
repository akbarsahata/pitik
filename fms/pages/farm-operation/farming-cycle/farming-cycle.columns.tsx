import { FARMING_STATUS } from "@constants/index";
import { formatDate, formatDateWithoutClock } from "@services/utils/date";
import { TFarmingCycleResponse } from "@type/response.type";

export const columns = [
  {
    title: "Farming Cycle Code",
    width: 170,
    dataIndex: "farmingCycleCode",
    key: "farmingCycleCode",
  },
  {
    title: "Status",
    dataIndex: "farmingStatus",
    key: "farmingStatus",
    width: 150,
    render: (record: string) =>
      record === FARMING_STATUS.NEW ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          New
        </p>
      ) : record === FARMING_STATUS.IN_PROGRESS ? (
        <p className="bg-blue-200 text-blue-600 rounded py-0.5 text-center">
          In Progress
        </p>
      ) : record === FARMING_STATUS.CLOSED ? (
        <p className="bg-gray-200 text-gray-600 rounded py-0.5 text-center">
          Closed
        </p>
      ) : (
        <p className="text-center">-</p>
      ),
  },
  {
    title: "Coop Name",
    dataIndex: "coopName",
    key: "coopName",
  },
  {
    title: "Coop Type",
    dataIndex: "coopTypeName",
    key: "coopTypeName",
  },
  {
    title: "Repopulate",
    dataIndex: "isRepopulated",
    key: "isRepopulated",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
  {
    title: "Owner",
    dataIndex: "ownerName",
    key: "ownerName",
  },
  {
    title: () => (
      <p className="text-center">
        Initial <br />
        Population
      </p>
    ),
    width: 110,
    dataIndex: "initialPopulation",
    key: "initialPopulation",
  },
  {
    title: "Production Team",
    key: "productionTeam",
    render: (record: TFarmingCycleResponse) =>
      record.productionTeam && record.productionTeam.length > 0 ? (
        <ul className="list-disc" key={record.farmingCycleId}>
          {(record &&
            record.productionTeam.map((item: string) => (
              <li key={item}>{item}</li>
            ))) ||
            "-"}
        </ul>
      ) : (
        "-"
      ),
  },
  {
    title: "Coop Operator",
    key: "coopOperatorTeam",
    render: (record: TFarmingCycleResponse) =>
      record.coopOperatorTeam && record.coopOperatorTeam.length > 0 ? (
        <ul className="list-disc" key={record.farmingCycleId}>
          {(record &&
            record.coopOperatorTeam.map((item: string) => (
              <li key={item}>{item}</li>
            ))) ||
            "-"}
        </ul>
      ) : (
        "-"
      ),
  },
  {
    title: "Farming Start Date",
    dataIndex: "farmingCycleStartDate",
    key: "farmingCycleStartDate",
    render: (record: string) =>
      !record || record === "-" ? "-" : formatDateWithoutClock(record),
  },
  {
    title: "Farming Closed Date",
    dataIndex: "closedDate",
    key: "closedDate",
    render: (record: string) =>
      !record || record === "-" ? "-" : formatDateWithoutClock(record),
  },
  {
    title: "Contract Type",
    dataIndex: "contractName",
    key: "contractName",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branchName",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Last Modified By",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Last Modified Date",
    dataIndex: "modifiedDate",
    key: "modifiedDate",
    render: (record: string) => (record ? formatDate(record) : "-"),
  },
];
