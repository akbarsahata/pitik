import { formatDateWithoutClock } from "@services/utils/date";
import { getDisplayFormatPhone } from "@services/utils/phone";
import {
  TCoopResponse,
  TRoomResponse,
  TSensorResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "MAC Address",
    dataIndex: "mac",
    key: "mac",
    width: 150,
    render: (record: string) => (record ? record.toUpperCase() : "-"),
  },
  {
    title: "Device ID",
    dataIndex: "deviceId",
    key: "deviceId",
    width: 120,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Device Type",
    dataIndex: "deviceType",
    key: "deviceType",
    width: 150,
    render: (record: string) => (record ? `${record}`.replace(/_/g, " ") : "-"),
  },
  {
    title: "Farm",
    dataIndex: "coop",
    key: "coop",
    width: 250,
    render: (record: TCoopResponse) =>
      record ? `(${record?.farm.farmCode}) ${record?.farm.farmName}` : "-",
  },
  {
    title: "Coop",
    dataIndex: "coop",
    key: "coop",
    width: 250,
    render: (record: TCoopResponse) =>
      record ? `(${record?.coopCode}) ${record?.coopName}` : "-",
  },
  {
    title: "Building Name",
    dataIndex: "room",
    key: "room",
    width: 250,
    render: (record: TRoomResponse) =>
      record
        ? `(${record?.building.buildingType.name}) ${record?.building.name}`
        : "-",
  },
  {
    title: "Room",
    dataIndex: "room",
    key: "room",
    width: 180,
    render: (record: TRoomResponse) =>
      record ? `(${record.roomCode}) ${record.roomType.name}` : "-",
  },
  {
    title: "Firmware Version",
    dataIndex: "firmWareVersion",
    key: "firmWareVersion",
    width: 180,
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 200,
    render: (record: string) => (record ? getDisplayFormatPhone(record) : "-"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 200,
    render: (record: string) =>
      record ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          Active
        </p>
      ) : (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">
          Inactive
        </p>
      ),
  },
  {
    title: "State",
    dataIndex: "isOnline",
    key: "isOnline",
    width: 200,
    render: (record: boolean) =>
      record ? (
        <p className="bg-blue-200 text-blue-900 rounded py-0.5 text-center">
          On
        </p>
      ) : (
        <p className="bg-gray-200 text-gray-900 rounded py-0.5 text-center">
          Off
        </p>
      ),
  },
  {
    title: "Total Sensor",
    dataIndex: "sensors",
    key: "sensors",
    width: 100,
    render: (record: TSensorResponse[]) => (record ? record.length : "-"),
  },
  {
    title: "Sensor",
    dataIndex: "sensors",
    key: "sensors",
    width: 250,
    render: (record: TSensorResponse[]) =>
      record ? (
        <div className="grid grid-cols-2 gap-2">
          {record.map((item) => (
            <p
              key={item.id}
              className="bg-gray-200 text-gray-900 rounded py-0.5 px-2 text-center"
            >
              {item.sensorCode} | {item.position}
            </p>
          ))}
        </div>
      ) : (
        "-"
      ),
  },
  {
    title: "Error Notes",
    dataIndex: "errors",
    key: "errors",
    width: 180,
    render: (record: { code: number; description: string }[]) =>
      record && record.length > 0 ? (
        <ul className="list-disc">
          {(record &&
            record.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))) ||
            "-"}
        </ul>
      ) : (
        "-"
      ),
  },
  {
    title: "Date Registered",
    dataIndex: "registrationDate",
    key: "registrationDate",
    width: 150,
    render: (record: string) =>
      !record || record === "-" ? "-" : formatDateWithoutClock(record),
  },
];
