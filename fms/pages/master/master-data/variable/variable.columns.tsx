import { formatDate } from "@services/utils/date";

export const columns = [
  {
    title: "Variable Code",
    dataIndex: "variableCode",
    key: "variableCode",
  },
  {
    title: "Variable Name",
    dataIndex: "variableName",
    key: "variableName",
  },
  {
    title: "Variable UOM",
    dataIndex: "variableUOM",
    key: "variableUOM",
    width: 120,
    render: (render: string) => (render ? render : "-"),
  },
  {
    title: "Variable Type",
    dataIndex: "variableType",
    key: "variableType",
  },
  {
    title: "Number",
    dataIndex: "digitComa",
    key: "digitComa",
    width: 90,
    render: (render: number) => (render ? render : "-"),
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
