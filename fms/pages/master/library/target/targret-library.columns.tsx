import { formatDate } from "@services/utils/date";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TVariableResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "Target Code",
    dataIndex: "targetCode",
    key: "targetCode",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "Target Name",
    dataIndex: "targetName",
    key: "targetName",
  },
  {
    title: "Coop Type",
    dataIndex: "coopType",
    key: ["coopType", "id"],
    render: (record: TCoopTypeResponse) => record && record.coopTypeName,
  },
  {
    title: "Chicken Strain",
    dataIndex: "chickType",
    key: ["chickType", "id"],
    render: (record: TChickenStrainResponse) => record && record.chickTypeName,
  },
  {
    title: "Variable Name",
    dataIndex: "variable",
    key: ["variable", "id"],
    render: (record: TVariableResponse) => record && record.variableName,
  },
  {
    title: "Target Days",
    dataIndex: "targetDaysCount",
    key: "targetDaysCount",
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
  },
  {
    title: "Last Modified Date",
    dataIndex: "modifiedDate",
    key: "modifiedDate",
    render: (record: string) => record && formatDate(record),
  },
];
