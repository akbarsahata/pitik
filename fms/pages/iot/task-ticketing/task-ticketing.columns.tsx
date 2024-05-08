import { formatDate } from "@services/utils/date";

export const columns = [
  {
    title: "Created On",
    dataIndex: "createdOn",
    key: "createdOn",
    width: 60,
    render: (record: string) =>
      !record || record === "-" ? "-" : formatDate(record),
  },
  {
    title: "PIC",
    dataIndex: "pic",
    key: "pic",
    width: 50,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "MAC Address",
    dataIndex: "macAddress",
    key: "macAddress",
    width: 60,
    render: (record: string) => (record ? record.toUpperCase() : "-"),
  },
  {
    title: "Device ID",
    dataIndex: "deviceId",
    key: "deviceId",
    width: 30,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Coop Code",
    dataIndex: "coopCode",
    key: "coopCode",
    width: 80,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Farm Name",
    dataIndex: "farmName",
    key: "farmName",
    width: 80,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branchName",
    width: 80,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Incident",
    dataIndex: "incident",
    key: "incident",
    width: 80,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Modified By",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
    width: 60,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 60,
    render: (record: string) =>
      record === "OPEN" ? (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">
          Open
        </p>
      ) : record === "ON_MAINTENANCE" ? (
        <p className="bg-orange-200 text-orange-900 rounded py-0.5 text-center">
          On Maintenance
        </p>
      ) : record === "RESOLVED" ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          Resolved
        </p>
      ) : (
        <p className="bg-gray-200 text-gray-900 rounded py-0.5 text-center">
          Others
        </p>
      ),
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    width: 60,
    render: (record: string) => (record ? record : "-"),
  },
];
