import { formatDate } from "@services/utils/date";
import { getDisplayFormatPhone } from "@services/utils/phone";

export const columns = [
  {
    title: "Role",
    dataIndex: "userType",
    key: "userType",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "User Code",
    dataIndex: "userCode",
    key: "userCode",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (record: string) =>
      record ? getDisplayFormatPhone(record || "") : record,
  },
  {
    title: "WhatsApp Number",
    dataIndex: "waNumber",
    key: "waNumber",
    render: (record: string) =>
      record ? getDisplayFormatPhone(record || "") : record,
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
