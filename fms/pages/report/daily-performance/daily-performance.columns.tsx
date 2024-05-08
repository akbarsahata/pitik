import { FARMING_STATUS } from "@constants/index";
import { formatDateWithoutClock } from "@services/utils/date";
import {
  TCoopResponse,
  TDailyPerformanceTableResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "Age",
    width: 86,
    dataIndex: "age",
    key: "age",
  },
  {
    title: "PPL",
    dataIndex: "userPpl",
    key: ["userPpl", "id"],
    render: (record: TUserResponse) => `${record.fullName}`,
  },
  {
    title: "Farmer",
    dataIndex: "farm",
    key: ["farm", "id"],
    render: (record: TFarmResponse) => `${record.farmName}`,
  },
  {
    title: "Coop",
    dataIndex: "coop",
    key: ["coop", "id"],
    render: (record: TCoopResponse) => `${record.coopName}`,
  },
  {
    title: "DOC-in Date",
    dataIndex: "farmingCycleStartDate",
    key: "farmingCycleStartDate",
    render: (record: string) => (record ? formatDateWithoutClock(record) : "-"),
  },
  {
    title: "Status",
    width: 120,
    dataIndex: "farmingStatus",
    key: "farmingStatus",
    render: (record: string) =>
      record === FARMING_STATUS.NEW
        ? "New"
        : record === FARMING_STATUS.IN_PROGRESS
        ? "In Progress"
        : record === FARMING_STATUS.CLOSED
        ? "Closed"
        : "-",
  },
  {
    title: "Summary",
    width: 120,
    dataIndex: "summary",
    key: ["summary", "id"],
    render: (record: TDailyPerformanceTableResponse) =>
      record ? record.summary : "-",
  },
];
