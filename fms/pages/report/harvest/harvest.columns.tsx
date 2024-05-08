import { FARMING_STATUS_HARVEST, HARVEST_MEMBER } from "@constants/index";
import { formatDateWithoutClock } from "@services/utils/date";
import { randomHexString } from "@services/utils/string";
import { THarvest, TFarmingCycleMember } from "@type/response.type";

export const columns = [
  {
    title: "Farming Cycle Code",
    dataIndex: "farmingCycleCode",
    key: "farmingCycleCode",
  },
  {
    title: "PPL",
    dataIndex: "members",
    key: "members",
    render: (record: TFarmingCycleMember[]) => {
      const pplMembers = record?.filter(
        (item) => item.userType === HARVEST_MEMBER.PPL
      );
      return pplMembers && pplMembers.length > 0 ? (
        <ul className="list-disc">
          {pplMembers.map((item: TFarmingCycleMember) => {
            const userId = randomHexString(); // generate a 16-byte random hexadecimal string
            return <li key={userId}>{item.name}</li>;
          })}
        </ul>
      ) : (
        "-"
      );
    },
  },
  {
    title: "Farm",
    dataIndex: "farm",
    key: "farm",
    render: (record: { id: string; name: string }) =>
      record ? record.name : "-",
  },
  {
    title: "Coop",
    dataIndex: "coop",
    key: "coop",
    render: (record: { id: string; name: string }) =>
      record ? record.name : "-",
  },
  {
    title: "Owner",
    dataIndex: "members",
    key: "members",
    render: (record: TFarmingCycleMember[]) =>
      record
        ? record.map((item) => {
            return item.userType === HARVEST_MEMBER.OWNER && item.name;
          })
        : "-",
  },
  {
    title: "Branch",
    dataIndex: "farm",
    key: "farm",
    render: (record: {
      id: string;
      name: string;
      branch: { id: string; name: string };
    }) => (record ? record.branch?.name : "-"),
  },
  {
    title: "Total Harvest",
    dataIndex: "harvest",
    key: "harvest",
    width: 120,
    render: (record: THarvest) =>
      record ? (record.count ? record.count : 0) : 0,
  },
  {
    title: "Status",
    width: 150,
    dataIndex: "status",
    key: "status",
    render: (record: string) =>
      record === FARMING_STATUS_HARVEST.NEW ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          New
        </p>
      ) : record === FARMING_STATUS_HARVEST.IN_PROGRESS ? (
        <p className="bg-blue-200 text-blue-900 rounded py-0.5 text-center">
          In Progress
        </p>
      ) : record === FARMING_STATUS_HARVEST.PENDING ? (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">
          Pending
        </p>
      ) : record === FARMING_STATUS_HARVEST.CLOSED ? (
        <p className="bg-gray-200 text-gray-900 rounded py-0.5 text-center">
          Closed
        </p>
      ) : (
        "-"
      ),
  },
  {
    title: "Initial Population",
    dataIndex: "initialPopulation",
    key: "initialPopulation",
    width: 150,
    render: (record: number) => (record ? record : 0),
  },
  {
    title: "Total Harvest (ekor)",
    dataIndex: "harvest",
    key: "harvest",
    width: 170,
    render: (record: THarvest) =>
      record ? (record.total.quantity ? record.total.quantity : 0) : 0,
  },
  {
    title: "Total Harvest (kg)",
    dataIndex: "harvest",
    key: "harvest",
    width: 170,
    render: (record: THarvest) =>
      record ? (record.total.tonnage ? record.total.tonnage.toFixed(2) : 0) : 0,
  },
  {
    title: "Latest Harvest Date",
    dataIndex: "harvest",
    key: "harvest",
    width: 170,
    render: (record: THarvest) =>
      record && record.latestHarvestDate && record.latestHarvestDate !== "-"
        ? formatDateWithoutClock(record.latestHarvestDate)
        : "-",
  },
];
