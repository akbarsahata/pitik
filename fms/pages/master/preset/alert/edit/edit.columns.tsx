export const columns = [
  {
    title: "Alert Code",
    dataIndex: "alertCode",
    key: "alertCode",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "Alert Name",
    dataIndex: "alertName",
    key: "alertName",
  },
];
