import { formatDate } from "@services/utils/date";

export const columns = [
  {
    title: "Chicken Strain Code",
    dataIndex: "chickTypeCode",
    key: "chickTypeCode",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "Chicken Strain Name",
    dataIndex: "chickTypeName",
    key: "chickTypeName",
  },

  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    render: (render: string) => (render ? render : "-"),
  },
  {
    title: "Active",
    width: 86,
    dataIndex: "status",
    key: "status",
    render: (record: boolean) => (record ? "Yes" : "No"),
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
