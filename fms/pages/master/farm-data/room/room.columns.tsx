import {
  TBuildingResponse,
  TControllerTypeResponse,
  TCoopResponse,
  TFanResponse,
  TFloorTypeResponse,
  THeaterTypeResponse,
  TRoomResponse,
  TRoomTypeResponse,
} from "@type/response.type";

export const columns = [
  {
    title: "Owner",
    dataIndex: "building",
    key: "building",
    render: (record: TBuildingResponse) =>
      record
        ? `(${record?.farm.owner?.userCode}) ${record?.farm.owner?.fullName}`
        : "-",
  },
  {
    title: "Farm",
    dataIndex: "building",
    key: "building",
    render: (record: TBuildingResponse) =>
      record ? `(${record.farm.farmCode}) ${record.farm?.farmName}` : "-",
  },
  {
    title: "Coop",
    dataIndex: "coop",
    key: "coop",
    render: (record: TCoopResponse) =>
      record ? `(${record.coopCode}) ${record.coopName}` : "-",
  },
  {
    title: "Building",
    dataIndex: "building",
    key: "building",
    render: (record: TBuildingResponse) =>
      record ? `(${record?.buildingType.name}) ${record?.name}` : "-",
  },
  {
    title: "Room",
    dataIndex: "roomType",
    key: "roomType",
    render: (record: TRoomTypeResponse) => (record ? record?.name : "-"),
  },
  {
    title: "Floor Type",
    dataIndex: "floorType",
    key: "floorType",
    render: (record: TFloorTypeResponse) => (record ? record?.name : "-"),
  },
  {
    title: "Population",
    dataIndex: "population",
    key: "population",
    render: (record: number) => record || "-",
  },
  {
    title: "Controller Type",
    dataIndex: "controllerType",
    key: "controllerType",
    render: (record: TControllerTypeResponse) => (record ? record?.name : "-"),
  },
  {
    title: "Heater Type",
    dataIndex: "heaterInRooms",
    key: "heaterInRooms",
    render: (
      record: {
        id: string;
        quantity: number;
        heaterType: THeaterTypeResponse;
      }[]
    ) =>
      record && (
        <ul className="list-disc ml-4">
          {record.map(
            (heater: {
              id: string;
              quantity: number;
              heaterType: THeaterTypeResponse;
            }) => (
              <li key={heater.id}>
                {`${heater.quantity} x ${heater.heaterType.name}` || "-"}
              </li>
            )
          )}
        </ul>
      ),
  },
  {
    title: "Fans",
    dataIndex: "fans",
    key: "fans",
    render: (record: TFanResponse[]) =>
      record && (
        <ul className="list-disc ml-4">
          {record.map((fan: TFanResponse) => (
            <li key={fan.id}>
              {`${fan.size} inch (${fan.capacity} CFM)` || "-"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Inlet Size",
    key: "id",
    render: (record: TRoomResponse) =>
      record.inletLength + " x " + record.inletWidth + " m",
  },
  {
    title: "Inlet Position",
    dataIndex: "inletPosition",
    key: "inletPosition",
  },
  {
    title: "Cooling Pad",
    dataIndex: "isCoolingPadExist",
    key: "isCoolingPadExist",
    render: (record: boolean) => (record ? "Exist" : "Not Exist"),
  },
  {
    title: "Active",
    dataIndex: "isActive",
    key: "isActive",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
];
