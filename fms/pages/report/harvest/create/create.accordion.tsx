import Accordion from "@components/atoms/Accordion/Accordion";
import { FARMING_STATUS_HARVEST, HARVEST_MEMBER } from "@constants/index";
import { formatDateWithoutClock } from "@services/utils/date";
import { THarvestDetailResponse } from "@type/response.type";

const DetailsAccordion = ({ data }: { data: THarvestDetailResponse }) => {
  return (
    <div className="w-full mt-4">
      <Accordion
        defaultOpen={true}
        backgroundColor={
          data.status === FARMING_STATUS_HARVEST.NEW
            ? "bg-green-50"
            : data.status === FARMING_STATUS_HARVEST.IN_PROGRESS
            ? "bg-blue-50"
            : data.status === FARMING_STATUS_HARVEST.CLOSED
            ? "bg-gray-50"
            : "bg-gray-50"
        }
        borderColor={
          data.status === FARMING_STATUS_HARVEST.NEW
            ? "border-green-500"
            : data.status === FARMING_STATUS_HARVEST.IN_PROGRESS
            ? "border-blue-80"
            : data.status === FARMING_STATUS_HARVEST.CLOSED
            ? "border-gray-80"
            : "border-gray-500"
        }
        chevronColor={
          data.status === FARMING_STATUS_HARVEST.NEW
            ? "text-green-500"
            : data.status === FARMING_STATUS_HARVEST.IN_PROGRESS
            ? "text-blue-500"
            : data.status === FARMING_STATUS_HARVEST.CLOSED
            ? "text-gray-80"
            : "text-gray-500"
        }
        title={
          <div className="flex flex-col sm:flex-row flex-1">
            <p>
              Status{" "}
              <span className="font-bold">
                {data.status
                  ? data.status === FARMING_STATUS_HARVEST.NEW
                    ? "New"
                    : data.status === FARMING_STATUS_HARVEST.IN_PROGRESS
                    ? "In Progress"
                    : data.status === FARMING_STATUS_HARVEST.CLOSED
                    ? "Closed"
                    : "Pending"
                  : "-"}
              </span>
              <span className="mx-3 text-gray-500">|</span>
            </p>
            <p>
              Total Harvest{" "}
              <span className="font-bold">{data.harvest?.count || "-"}</span>
            </p>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row xl:space-x-2 space-y-8 md:space-y-0">
          <div className="md:w-1/3">
            <p className="font-semibold text-lg">Farm Details</p>
            <div className="flex flex-col md:flex-row w-full">
              <div className="mt-3 space-y-3 w-full">
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/4">FC Code</p>
                  <p className="flex-1 font-semibold">
                    : {data.farmingCycleCode || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/4">Farm Name</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm?.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/4">Coop Name</p>
                  <p className="flex-1 font-semibold">
                    : {data.coop?.name || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="flex md:mt-7 flex-col md:flex-row w-full">
              <div className="mt-3 space-y-3 w-full">
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/3">Owner</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.members && data.members.length > 0
                      ? data.members
                          .filter(
                            (item) => item.userType === HARVEST_MEMBER.OWNER
                          )
                          .map((item) => item.name)
                          .join(", ")
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/3">PPL</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.members && data.members.length > 0
                      ? data.members
                          .filter(
                            (item) => item.userType === HARVEST_MEMBER.PPL
                          )
                          .map((item) => item.name)
                          .join(", ")
                      : "-"}
                  </p>
                </div>

                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/3">Initial Population</p>
                  <p className="flex-1 font-semibold">
                    : {data.initialPopulation ? data.initialPopulation : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <p className="font-semibold text-lg">Harvest Summary</p>
            <div className="flex flex-col md:flex-row w-full">
              <div className="mt-3 space-y-3 w-full">
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/2">Total Harvest (ekor)</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.harvest?.total?.quantity ||
                    data.harvest?.total?.quantity === 0
                      ? data.harvest?.total?.quantity
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/2">Total Harvest (kg)</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.harvest?.total?.tonnage ||
                    data.harvest?.total?.tonnage === 0
                      ? data.harvest?.total?.tonnage.toFixed(2)
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start flex-1">
                  <p className="w-1/2">Latest Harvest Date</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.harvest?.latestHarvestDate
                      ? formatDateWithoutClock(data.harvest.latestHarvestDate)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DetailsAccordion;
