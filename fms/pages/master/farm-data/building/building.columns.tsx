import { TBuildingTypeResponse, TFarmResponse } from "@type/response.type";

export const columns = [
  {
    title: "Farm",
    dataIndex: "farm",
    key: "farm",
    render: (record: TFarmResponse) =>
      record ? `(${record?.farmCode}) ${record?.farmName}` : "-",
  },
  {
    title: "Owner",
    dataIndex: "farm",
    key: "farm",
    render: (record: TFarmResponse) =>
      record.owner
        ? `(${record.owner?.userCode}) ${record.owner?.userCode}`
        : "-",
  },
  {
    title: "Building Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Building Type",
    dataIndex: "buildingType",
    key: "buildingType",
    render: (record: TBuildingTypeResponse) => (record ? record?.name : "-"),
  },
  {
    title: "Active",
    dataIndex: "isActive",
    key: "isActive",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
];
