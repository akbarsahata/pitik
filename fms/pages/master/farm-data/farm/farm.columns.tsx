import { formatDate } from "@services/utils/date";

export const columns = [
  {
    title: "Branch",
    dataIndex: "branchName",
    key: "branchName",
    render: (record: string) => record || "-",
  },
  {
    title: "Owner",
    dataIndex: "ownerName",
    key: "ownerName",
  },
  {
    title: "Farm Code",
    dataIndex: "farmCode",
    key: "farmCode",
  },
  {
    title: "Farm Name",
    dataIndex: "farmName",
    width: 250,
    key: "farmName",
  },
  {
    title: "Province",
    dataIndex: "provinceName",
    key: "provinceName",
  },
  {
    title: "City",
    dataIndex: "cityName",
    key: "cityName",
  },
  {
    title: "District",
    dataIndex: "districtName",
    key: "districtName",
  },
  {
    title: "Postal Code",
    dataIndex: "zipCode",
    key: "zipCode",
    render: (record: string) => record || "-",
  },
  {
    title: "Address Name",
    dataIndex: "addressName",
    key: "addressName",
    render: (record: string) => record || "-",
  },
  {
    title: "Address 1",
    dataIndex: "address1",
    key: "address1",
    render: (record: string) => record || "-",
  },
  {
    title: "Address 2",
    dataIndex: "address2",
    key: "address2",
    render: (record: string) => record || "-",
  },
  {
    title: "Latitude",
    dataIndex: "latitude",
    width: 150,
    key: "latitude",
    render: (record: string) => record || "-",
  },
  {
    title: "Longitude",
    dataIndex: "longitude",
    width: 150,
    key: "longitude",
    render: (record: string) => record || "-",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    render: (record: string) => record || "-",
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
    render: (record: string) => record || "-",
  },
  {
    title: "Last Modified Date",
    dataIndex: "modifiedDate",
    key: "modifiedDate",
    render: (record: string) => (record && formatDate(record)) || "-",
  },
];
