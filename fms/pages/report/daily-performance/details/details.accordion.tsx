import Accordion from "@components/atoms/Accordion/Accordion";
import { formatDate, formatDateWithoutClock } from "@services/utils/date";
import {
  TDailyPerformanceSummaryResponse,
  TUserResponse,
} from "@type/response.type";

const DetailsAccordion = ({
  data,
}: {
  data: TDailyPerformanceSummaryResponse;
}) => {
  return (
    <div className="w-full mt-4">
      <Accordion
        backgroundColor={
          data.doc?.summary === "Good"
            ? "bg-green-50"
            : data.doc?.summary === "Average"
            ? "bg-orange-50"
            : "bg-red-50"
        }
        borderColor={
          data.doc?.summary === "Good"
            ? "border-green-500"
            : data.doc?.summary === "Average"
            ? "border-primary-80"
            : "border-red-500"
        }
        chevronColor={
          data.doc?.summary === "Good"
            ? "text-green-500"
            : data.doc?.summary === "Average"
            ? "text-primary-80"
            : "text-red-500"
        }
        title={
          <div className="flex flex-col sm:flex-row flex-1">
            <p>
              Age{" "}
              <span className="font-bold">
                {data.performance.age?.toFixed(0) || "-"}
              </span>
              <span className="mx-3 text-gray-500">|</span>
            </p>
            <p>
              Body Weight (BW){" "}
              <span className="font-bold">
                {(data.performance.bw.actual &&
                  data.performance.bw.actual.toLocaleString() + " gram") ||
                  "-"}
              </span>
              <span className="mx-3 text-gray-500">|</span>
            </p>
            <p>
              Summary{" "}
              <span className="font-bold">{data.doc.summary || "-"}</span>
            </p>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row xl:space-x-4">
          <div className="flex flex-1 flex-col xl:flex-row space-y-8 xl:space-y-0 xl:w-1/2 xl:space-x-4">
            <div className="xl:w-1/2">
              <p className="font-semibold text-lg">Farm &amp; Coop Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="w-28">Farmer Name</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.owner || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Coop Name</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Coop Type</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.type || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Contract Type</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.contractType || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Branch</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.branch.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Province</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.branch.province.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">City</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.branch.city.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">District</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.branch.district.name || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">MM</p>
                  <p className="flex-1 font-semibold">
                    : {data.farm.coop.mm?.fullName || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">PPL</p>:{" "}
                  {data.farm.coop.ppl.length && (
                    <ul className="list-disc ml-5">
                      {data.farm.coop.ppl.map((ppl: TUserResponse) => (
                        <li key={ppl.id}>{ppl.fullName || "-"}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="xl:w-1/2">
              <p className="font-semibold text-lg">DOC-in Information</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="w-28">DOC Brands</p>
                  <p className="flex-1 font-semibold">
                    : {data.doc.supplier || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Hatchery</p>
                  <p className="flex-1 font-semibold">
                    : {data.doc.hatchery || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Uniformity</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {(data.doc.uniformity && data.doc.uniformity + "%") || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">BW DOC</p>
                  <p className="flex-1 font-semibold">
                    : {(data.doc.bw && data.doc.bw + " gram") || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">DOC In</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.doc.arrivalTime
                      ? formatDate(data.doc.arrivalTime || "", false)
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Recording Date</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {data.doc.recordingTime
                      ? formatDateWithoutClock(data.doc.recordingTime || "")
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Summary</p>
                  <p className="flex-1 font-semibold">
                    : {data.doc.summary || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col xl:flex-row space-y-8 xl:space-y-0 xl:w-1/2 xl:space-x-4">
            <div className="xl:w-1/2 space-y-4">
              <div>
                <p className="font-semibold text-lg">Feed Information</p>
                <div className="mt-3 space-y-3">
                  <div className="flex flex-row items-start">
                    <p className="w-28">Pre-Starter</p>
                    <p className="flex-1 font-semibold">
                      : {data.feed.prestarter || "-"}
                    </p>
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Starter</p>
                    <p className="flex-1 font-semibold">
                      : {data.feed.starter || "-"}
                    </p>
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Finisher</p>
                    <p className="flex-1 font-semibold">
                      : {data.feed.finisher || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">Issues This Week</p>

                <div className="mt-3 space-y-3">
                  <div className="flex flex-row items-start">
                    <p className="w-28">Infrastructure</p>:{" "}
                    {data.issues.infrastructure?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.infrastructure.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Management</p>:{" "}
                    {data.issues.management?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.management.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Farm Input</p>:{" "}
                    {data.issues.farmInput?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.farmInput.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Diseases</p>:{" "}
                    {data.issues.diseases?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.diseases.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Force Majeure</p>:{" "}
                    {data.issues.forceMajeure?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.forceMajeure.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-28">Others</p>:{" "}
                    {data.issues.others?.length ? (
                      <ul className="list-disc ml-5">
                        {data.issues.others.map((item: string) => (
                          <li key={item}>{item || "-"}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-1/2">
              <p className="font-semibold text-lg">Performance Summary</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-row items-start">
                  <p className="w-28">Current Populations</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.population.current || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Initial Populations</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.population.initial || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">Age</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.age?.toFixed(0) || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">BW / Standard</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.bw.actual?.toLocaleString() || "-"}{" "}
                    <span className="text-gray-500 font-normal">/</span>{" "}
                    {data.performance.bw.standard?.toLocaleString() || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">% Mortality / Standard</p>
                  <p className="flex-1 font-semibold">
                    :{" "}
                    {(data.performance.mortality.actual &&
                      data.performance.mortality.actual.toFixed(2) + "%") ||
                      "-"}{" "}
                    <span className="text-gray-500 font-normal">/</span>{" "}
                    {(data.performance.mortality.standard &&
                      data.performance.mortality.standard.toFixed(2) + "%") ||
                      "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">FCR / Standard</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.fcr.actual?.toFixed(3) || "-"}{" "}
                    <span className="text-gray-500 font-normal">/</span>{" "}
                    {data.performance.fcr.standard?.toFixed(3) || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">IP / Standard</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.ip.actual?.toFixed(0) || "-"}{" "}
                    <span className="text-gray-500 font-normal">/</span>{" "}
                    {data.performance.ip.standard?.toFixed(0) || "-"}
                  </p>
                </div>
                <div className="flex flex-row items-start">
                  <p className="w-28">BW Day 8th</p>
                  <p className="flex-1 font-semibold">
                    : {data.performance.bwDayEight?.toFixed(1) || "-"}
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
