import { formatDate } from "@services/utils/date";
import { TCoopTypeResponse } from "@type/response.type";

export const columns = [
  {
    title: "Preset Code",
    dataIndex: "alertPresetCode",
    key: "alertPresetCode",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "Preset Name",
    dataIndex: "alertPresetName",
    key: "alertPresetName",
  },
  {
    title: "Coop Type",
    dataIndex: "coopType",
    key: ["coopType", "coopTypeName"],
    render: (record: TCoopTypeResponse) => record.coopTypeName,
  },
  {
    title: "Preset Type",
    dataIndex: "presetType",
    key: "presetType",
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
