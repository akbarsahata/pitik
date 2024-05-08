import {
  TCoopResponse,
  TRoomResponse,
  TSensorResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "Room Code",
    dataIndex: "room",
    key: "room",
    render: (record: TRoomResponse) =>
      record ? `(${record.roomCode}) ${record.roomType.name}` : "-",
  },
  {
    title: "Coop",
    dataIndex: "coop",
    key: "coop",
    render: (record: TCoopResponse) =>
      record ? `(${record.coopCode}) ${record.coopName}` : "-",
  },
  {
    title: "MAC Address",
    dataIndex: "mac",
    key: "mac",
    render: (record: string) => record.toUpperCase() || "-",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
    render: (record: boolean) =>
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
    width: 100,
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
    title: "Sensors",
    dataIndex: "sensors",
    width: 350,
    key: "sensors",
    render: (record: TSensorResponse[]) =>
      record && record.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {record.map((item: TSensorResponse) => (
            <p
              key={item.id}
              className="bg-gray-200 text-gray-900 rounded py-0.5 text-center mb-2 mr-2"
            >
              {item.sensorCode} | {item.position}
            </p>
          ))}
        </div>
      ) : (
        "-"
      ),
  },
];
