import { REALIZATION_STATUS } from "@constants/index";
import { formatDateWithoutClock } from "@services/utils/date";

export const columns = [
  {
    title: "Harvest No",
    dataIndex: "harvestNo",
    key: "harvestNo",
    width: 120,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Status",
    width: 150,
    dataIndex: "status",
    key: "status",
    render: (record: string) =>
      record === REALIZATION_STATUS.FINAL ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          Final
        </p>
      ) : record === REALIZATION_STATUS.DRAFT ? (
        <p className="bg-blue-200 text-blue-900 rounded py-0.5 text-center">
          Draft
        </p>
      ) : record === REALIZATION_STATUS.DELETED ? (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">
          Deleted
        </p>
      ) : (
        "-"
      ),
  },
  {
    title: "Harvest Date",
    dataIndex: "date",
    key: "date",
    render: (record: string) => (record ? formatDateWithoutClock(record) : "-"),
  },
  {
    title: "Bakul/Customer Name",
    dataIndex: "bakulName",
    key: "bakulName",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "No. DO",
    dataIndex: "deliveryOrder",
    key: "deliveryOrder",
    render: (record: string) => (record ? record : "-"),
  },

  {
    title: "No. Data Timbang",
    dataIndex: "weighingNumber",
    key: "weighingNumber",
    width: 180,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Total Harvest (ekor)",
    dataIndex: "total",
    key: "total",
    width: 160,
    render: (record: { quantity: number; tonnage: number }) =>
      record ? (record.quantity ? record.quantity : 0) : 0,
  },
  {
    title: "Total Harvest (kg)",
    dataIndex: "total",
    key: "total",
    width: 160,
    render: (record: { quantity: number; tonnage: number }) =>
      record ? (record.tonnage ? record.tonnage.toFixed(2) : 0) : 0,
  },
];
