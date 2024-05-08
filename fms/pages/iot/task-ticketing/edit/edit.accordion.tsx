import Accordion from "@components/atoms/Accordion/Accordion";
import { TIotTicketDetailsResponse } from "@type/response.type";
import { TICKET_STATUS } from "../task-ticketing.constants";

const DetailsAccordion = ({ data }: { data: TIotTicketDetailsResponse }) => {
  return (
    <div className="w-full mt-4">
      <Accordion
        defaultOpen={true}
        backgroundColor={
          data.status === TICKET_STATUS.OPEN
            ? "bg-red-50"
            : data.status === TICKET_STATUS.ON_MAINTENANCE
            ? "bg-orange-50"
            : data.status === TICKET_STATUS.RESOLVED
            ? "bg-green-50"
            : "bg-gray-50"
        }
        borderColor={
          data.status === TICKET_STATUS.OPEN
            ? "border-red-500"
            : data.status === TICKET_STATUS.ON_MAINTENANCE
            ? "border-orange-500"
            : data.status === TICKET_STATUS.RESOLVED
            ? "border-green-500"
            : "border-gray-500"
        }
        chevronColor={
          data.status === TICKET_STATUS.OPEN
            ? "text-red-500"
            : data.status === TICKET_STATUS.ON_MAINTENANCE
            ? "text-orange-500"
            : data.status === TICKET_STATUS.RESOLVED
            ? "text-green-500"
            : "text-gray-500"
        }
        title={
          <div className="flex flex-col sm:flex-row flex-1">
            <p>
              Status{" "}
              <span className="font-bold">
                {data.status.replace(/_/g, " ")}
              </span>
            </p>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row xl:space-x-4 space-y-8 md:space-y-0">
          <div className="flex flex-1 flex-col xl:flex-row space-y-8 xl:space-y-0 xl:w-full xl:space-x-4">
            <div className="xl:w-1/4">
              <p className="font-semibold text-lg">Device Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="w-28">Online Time</p>
                  <p className="flex-1 font-semibold">
                    : {data.createdOn || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">MAC Address</p>
                  <p className="flex-1 font-semibold">
                    : {data.macAddress || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Device ID</p>
                  <p className="flex-1 font-semibold">
                    : {data.deviceId || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="xl:w-1/2">
              <p className="font-semibold text-lg">Farm Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="w-28">Coop Code</p>
                  <p className="flex-1 font-semibold">
                    : {data.coopCode || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Farm Name</p>
                  <p className="flex-1 font-semibold">
                    : {data.farmName || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Branch</p>
                  <p className="flex-1 font-semibold">
                    : {data.branchName || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="xl:w-1/4">
              <p className="font-semibold text-lg">Incident</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="flex-1 font-semibold">{data.incident || "-"}</p>
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
