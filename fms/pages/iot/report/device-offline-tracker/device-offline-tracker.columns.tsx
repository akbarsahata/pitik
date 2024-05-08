import { TCoopResponse, TRoomResponse } from "@type/response.type";

export const columns = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    render: (record: number) => record && record,
  },
  {
    title: "Farm",
    dataIndex: "coop",
    key: "coop",
    render: (record: TCoopResponse) =>
      record ? (
        `(${record?.farm.farmCode}) ${record?.farm.farmName}`
      ) : (
        <div className="text-center">{"-"}</div>
      ),
  },
  {
    title: "Building",
    dataIndex: "room",
    key: "room",
    width: 250,
    render: (record: TRoomResponse) =>
      record ? (
        `(${record?.building.buildingType.name}) ${record?.building.name}`
      ) : (
        <div className="text-center">{"-"}</div>
      ),
  },
  {
    title: "Room",
    dataIndex: "room",
    key: "room",
    width: 180,
    render: (record: TRoomResponse) =>
      record ? record.roomType.name : <div className="text-center">{"-"}</div>,
  },
  {
    title: "Device ID",
    dataIndex: "deviceId",
    key: "deviceId",
    render: (record: any) =>
      record ? record : <div className="text-center">{"-"}</div>,
  },
  {
    title: "Count Total Offline",
    dataIndex: "totalOfflineCount",
    key: "totalOfflineCount",
    render: (record: any) =>
      record ? (
        <div className="text-center">{record}</div>
      ) : (
        <div className="text-center">{"-"}</div>
      ),
  },
  {
    title: "Duration Offline (Hour)",
    dataIndex: "totalOfflineTime",
    key: "totalOfflineTime",
    render: (record: any) =>
      record ? (
        <div className="text-center">{record}</div>
      ) : (
        <div className="text-center">{"-"}</div>
      ),
  },
];
