import { formatDate, formatDateWithoutClock } from "@services/utils/date";
import { TBranchResponse } from "@type/response.type";

export const columns = [
  {
    title: "Contract Type",
    dataIndex: ["contractType", "contractName"],
    key: ["contractType", "contractName"],
  },
  {
    title: "Customized",
    dataIndex: "customize",
    width: 180,
    key: "customize",
    render: (record: boolean) =>
      record ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          Yes
        </p>
      ) : (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">No</p>
      ),
  },
  {
    title: "Effective Start Date",
    dataIndex: "effectiveStartDate",
    key: "effectiveStartDate",
    render: (record: string) => record && formatDateWithoutClock(record),
  },
  {
    title: "Branch Name",
    dataIndex: "branch",
    key: ["branch", "id"],
    render: (record: TBranchResponse) => `(${record.code}) ${record.name}`,
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    render: (record: string) => (record ? record : "-"),
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
    render: (record: string) => record || "-",
  },
  {
    title: "Last Modified Date",
    dataIndex: "modifiedDate",
    key: "modifiedDate",
    render: (record: string) => (record && formatDate(record)) || "-",
  },
];
