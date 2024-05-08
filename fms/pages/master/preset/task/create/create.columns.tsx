export const columns = [
  {
    title: "Task Code",
    dataIndex: "taskCode",
    key: "taskCode",
    render: (record: string) => (record ? record.toUpperCase() : record),
  },
  {
    title: "Task Name",
    dataIndex: "taskName",
    key: "taskName",
  },
];
