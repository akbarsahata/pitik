import { formatDateWithoutClock } from "@services/utils/date";

export const columns = [
  {
    title: "Version",
    dataIndex: "version",
    key: "version",
    width: 120,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Device Type",
    dataIndex: "deviceType",
    key: "deviceType",
    width: 200,
    render: (record: string) => (record ? `${record}`.replace(/_/g, " ") : "-"),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "File Size",
    dataIndex: "fileSize",
    key: "fileSize",
    render: (record: string) => (record ? `${record} Bytes` : "-"),
  },
  {
    title: "Date Registered",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (record: string) =>
      !record || record === "-" ? "-" : formatDateWithoutClock(record),
  },
];
