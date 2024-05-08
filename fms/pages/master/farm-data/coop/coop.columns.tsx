import { formatDate } from "@services/utils/date";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "Owner",
    dataIndex: ["farm", "owner"],
    key: ["owner", "id"],
    render: (record: TUserResponse) =>
      `(${record.userCode}) ${record.fullName}`,
  },
  {
    title: "Farm",
    dataIndex: "farm",
    key: ["farm", "id"],
    render: (record: TFarmResponse) =>
      `(${record.farmCode}) ${record.farmName}`,
  },
  {
    title: "Coop Code",
    dataIndex: "coopCode",
    key: "coopCode",
  },
  {
    title: "Coop Name",
    dataIndex: "coopName",
    key: "coopName",
  },
  {
    title: "Coop Type",
    dataIndex: "coopType",
    key: ["coopType", "id"],
    render: (record: TCoopTypeResponse) => record.coopTypeName,
  },
  {
    title: "Contract Type",
    dataIndex: "contractName",
    key: "contractName",
    render: (record: string) => record || "-",
  },
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branchName",
    render: (record: string) => record || "-",
  },
  {
    title: "Poultry Leader",
    dataIndex: "leader",
    key: ["leader", "id"],
    render: (record: TUserResponse) =>
      (record && `(${record.userCode}) ${record.fullName}`) || "-",
  },
  {
    title: "Poultry Worker",
    dataIndex: "workers",
    key: "workers",
    render: (record: TUserResponse[]) =>
      record.length > 0 ? (
        <ul className="list-disc">
          {(record &&
            record.map((worker) => (
              <li key={worker.id}>{worker.fullName}</li>
            ))) ||
            "-"}
        </ul>
      ) : (
        "-"
      ),
  },
  {
    title: "Chick Type",
    dataIndex: "chickType",
    key: ["chickType", "id"],
    render: (record: TChickenStrainResponse) =>
      (record && record.chickTypeName) || "-",
  },
  {
    title: "Number of Fan",
    dataIndex: "numFan",
    key: "numFan",
  },
  {
    title: "Capacity Fan",
    dataIndex: "capacityFan",
    key: "capacityFan",
  },
  {
    title: "Height (m)",
    dataIndex: "height",
    key: "height",
  },
  {
    title: "Length (m)",
    dataIndex: "length",
    key: "length",
  },
  {
    title: "Width (m)",
    dataIndex: "width",
    key: "width",
  },
  {
    title: "Max Capacity",
    dataIndex: "maxCapacity",
    key: "maxCapacity",
  },
  {
    title: "First Chick In Date",
    dataIndex: "chickInDate",
    key: "chickInDate",
    render: (record: string) => (record && record) || "-",
  },
  {
    title: "Controller Type",
    dataIndex: "otherControllerType",
    key: "otherControllerType",
    render: (record: string) => (record && record) || "-",
  },
  {
    title: "Inlet Type",
    dataIndex: "otherInletType",
    key: "otherInletType",
    render: (record: string) => (record && record) || "-",
  },
  {
    title: "Heater Type",
    dataIndex: "otherHeaterType",
    key: "otherHeaterType",
    render: (record: string) => (record && record) || "-",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    render: (record: string) => (record && record) || "-",
  },
  {
    title: "Active",
    width: 86,
    dataIndex: "status",
    key: "status",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
  },
  {
    title: "Date Created",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (record: string) => record && formatDate(record),
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
