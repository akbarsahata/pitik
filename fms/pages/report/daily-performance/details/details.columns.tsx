import { CONTRACT } from "@constants/index";
import { formatDateWithoutClock } from "@services/utils/date";
import { TDailyPerformanceDetailsResponse } from "@type/response.type";
import { Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const TableColumns = ({
  tableData,
  contractType,
}: {
  tableData: TDailyPerformanceDetailsResponse[];
  contractType: string | null;
}) => {
  return (
    <Table
      dataSource={tableData}
      scroll={{
        x: 1800,
        y: 500,
      }}
      pagination={false}
    >
      <ColumnGroup title="Detail &amp; Action">
        <Column
          title="Date"
          dataIndex="date"
          key="date"
          fixed="left"
          width={150}
          align="center"
          render={(item: string) => formatDateWithoutClock(item || "") || ""}
        />
        <Column
          title="Day"
          dataIndex="day"
          key="day"
          fixed="left"
          width={80}
          align="center"
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          fixed="left"
          width={120}
          align="center"
          render={(record: string) =>
            (
              <p
                className={`${
                  record == "Segera Isi" || record === "Segera Review"
                    ? "bg-yellow-200 text-yellow-900"
                    : record == "Sudah Isi" || record === "Sudah Review"
                    ? "bg-blue-200 text-blue-600"
                    : record == "Telat"
                    ? "bg-red-200 text-red-600"
                    : record == "Selesai"
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record || "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="Daily Data &amp; Summary" fixed={true}>
        <Column
          title={() => (
            <p className="text-center">
              BW <br />
              Data (gr)
            </p>
          )}
          dataIndex="bw"
          key="bw"
          width={120}
          align="center"
          render={(record) =>
            record.actual ? parseFloat(record.actual).toLocaleString() : "-"
          }
        />
        <Column
          title={() => <p className="text-center">Daily Feed Data (sack)</p>}
          key="feed"
          width={350}
          align="center"
          render={(record) =>
            record.feed
              ? record.feed
                ? parseFloat(record.feed).toFixed(2)
                : "-"
              : //TODO: Replace lines 94-97 with the updated code once the backend API has been adjusted. Don't forget to modify the API service and apply the appropriate masking as well
                //record.feed && record.feed.length > 0 ? (
                // <ul className="list-disc" key={record.dailyPerformanceId}>
                //   {(record &&
                //     record.feed.length.map((item: string) => (
                //       <li key={item}>{item}</li>
                //     ))) ||
                //     "-"}
                // </ul>
                //)
                "-"
          }
        />
        <Column
          className={contractType !== CONTRACT[2] ? "hidden" : ""}
          title={() => <p className="text-center">Daily OVK Data</p>}
          key="ovk"
          width={350}
          align="center"
          render={(record) =>
            //TODO: Once the backend API has been adjusted, don't forget to modify the API service and apply the appropriate masking as well
            record.ovk && record.ovk.length > 0 ? (
              <ul className="list-disc" key={record.dailyPerformanceId}>
                {(record &&
                  record.ovk.length.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))) ||
                  "-"}
              </ul>
            ) : (
              "-"
            )
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Dead <br />
              Chicken Data
            </p>
          )}
          key="dead"
          width={150}
          align="center"
          render={(record) => record.dead || "-"}
        />
        <Column
          title={() => (
            <p className="text-center">
              Culled <br />
              Chicken Data
            </p>
          )}
          key="culled"
          width={150}
          align="center"
          render={(record) => record.culled || "-"}
        />
        <Column
          title={() => (
            <p className="text-center">
              Comment / <br />
              Summary
            </p>
          )}
          key="summary"
          dataIndex="summary"
          width={150}
          align="center"
          render={(record: string) =>
            (
              <p
                className={`${
                  record == "Average"
                    ? "bg-orange-50 text-primary-80"
                    : record == "Below"
                    ? "bg-red-200 text-red-600"
                    : record == "Good"
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record || "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="Body Weight" fixed={true}>
        <Column
          title={() => (
            <p className="text-center">
              BW <br />
              Standard (gr)
            </p>
          )}
          dataIndex="bw"
          key="bw"
          width={140}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toLocaleString() : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              BW <br />
              Actual (gr)
            </p>
          )}
          key="bw"
          width={140}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.bw.actual || !record.bw.standard
                    ? ""
                    : record.bw.actual < record.bw.standard
                    ? "bg-red-200 text-red-600"
                    : record.bw.actual >= record.bw.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.bw.actual
                  ? parseFloat(record.bw.actual).toLocaleString()
                  : "-"}
              </p>
            ) || "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              ADG <br />
              Standard (gr)
            </p>
          )}
          dataIndex="adg"
          key="adg"
          width={150}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(0) : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              ADG <br />
              Actual (gr)
            </p>
          )}
          key="adg"
          width={140}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.adg.actual || !record.adg.standard
                    ? ""
                    : record.adg.actual < record.adg.standard
                    ? "bg-red-200 text-red-600"
                    : record.adg.actual >= record.adg.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.adg.actual
                  ? parseFloat(record.adg.actual).toFixed(0)
                  : "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="Mortality" fixed={true}>
        <Column
          title={() => (
            <p className="text-center">
              Standard Daily <br />
              Mortality (%)
            </p>
          )}
          dataIndex="mortality"
          key="mortality"
          width={150}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(2) + "%" : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Actual Daily <br />
              Mortality (%)
            </p>
          )}
          key="mortality"
          width={150}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.mortality.actual || !record.mortality.standard
                    ? ""
                    : record.mortality.actual < record.mortality.standard
                    ? "bg-green-200 text-green-600"
                    : record.mortality.actual >= record.mortality.standard
                    ? "bg-red-200 text-red-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.mortality.actual
                  ? parseFloat(record.mortality.actual).toFixed(2) + "%"
                  : "-"}
              </p>
            ) || "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Standard Acumulation <br />
              Mortality (%)
            </p>
          )}
          dataIndex="mortalityCummulative"
          key="mortalityCummulative"
          width={200}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(2) + "%" : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Actual Acumulation <br />
              Mortality (%)
            </p>
          )}
          key="mortalityCummulative"
          width={200}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.mortalityCummulative.actual ||
                  !record.mortalityCummulative.standard
                    ? ""
                    : record.mortalityCummulative.actual <
                      record.mortalityCummulative.standard
                    ? "bg-green-200 text-green-600"
                    : record.mortalityCummulative.actual >=
                      record.mortalityCummulative.standard
                    ? "bg-red-200 text-red-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.mortalityCummulative.actual
                  ? parseFloat(record.mortalityCummulative.actual).toFixed(2) +
                    "%"
                  : "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="Harvest &amp; Population" fixed={true}>
        <Column
          title="Harvest"
          dataIndex="population"
          key="population"
          width={120}
          align="center"
          render={(record) => record.dailyHarvest || "-"}
        />
        <Column
          title={() => (
            <p className="text-center">
              Current <br />
              Population
            </p>
          )}
          dataIndex="population"
          key="population"
          width={150}
          align="center"
          render={(record) => record.remaining?.toLocaleString() || "-"}
        />
      </ColumnGroup>
      <ColumnGroup title="Feed Intake" fixed={true}>
        <Column
          title={() => (
            <p className="text-center">
              Standard Feed <br />
              Intake (gr/chicken)
            </p>
          )}
          dataIndex="feedIntake"
          key="feedIntake"
          width={150}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(0) : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Actual Feed <br />
              Intake (gr/chicken)
            </p>
          )}
          key="feedIntake"
          width={150}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.feedIntake.actual || !record.feedIntake.standard
                    ? ""
                    : record.feedIntake.actual < record.feedIntake.standard
                    ? "bg-red-200 text-red-600"
                    : record.feedIntake.actual >= record.feedIntake.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.feedIntake.actual
                  ? parseFloat(record.feedIntake.actual).toFixed(0)
                  : "-"}
              </p>
            ) || "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Standard Total <br />
              Daily Feed (sack)
            </p>
          )}
          dataIndex="feedConsumption"
          key="feedConsumption"
          width={180}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(2) : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              Actual Total <br />
              Daily Feed (sack)
            </p>
          )}
          key="feedConsumption"
          width={150}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.feedConsumption.actual ||
                  !record.feedConsumption.standard
                    ? ""
                    : record.feedConsumption.actual <
                      record.feedConsumption.standard
                    ? "bg-red-200 text-red-600"
                    : record.feedConsumption.actual >=
                      record.feedConsumption.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.feedConsumption.actual
                  ? parseFloat(record.feedConsumption.actual).toFixed(2)
                  : "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="FCR &amp; IP" fixed={true}>
        <Column
          title={() => (
            <p className="text-center">
              FCR <br />
              Standard
            </p>
          )}
          dataIndex="fcr"
          key="fcr"
          width={120}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(3) : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              FCR <br />
              Actual
            </p>
          )}
          key="fcr"
          width={120}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.fcr.actual || !record.fcr.standard
                    ? ""
                    : record.fcr.actual < record.fcr.standard
                    ? "bg-red-200 text-red-600"
                    : record.fcr.actual >= record.fcr.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.fcr.actual
                  ? parseFloat(record.fcr.actual).toFixed(3)
                  : "-"}
              </p>
            ) || "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              IP <br />
              Standard
            </p>
          )}
          dataIndex="ip"
          key="ip"
          width={120}
          align="center"
          render={(record) =>
            record.standard ? parseFloat(record.standard).toFixed(0) : "-"
          }
        />
        <Column
          title={() => (
            <p className="text-center">
              IP <br />
              Actual
            </p>
          )}
          key="ip"
          width={120}
          align="center"
          render={(record) =>
            (
              <p
                className={`${
                  !record.ip.actual || !record.ip.standard
                    ? ""
                    : record.ip.actual < record.ip.standard
                    ? "bg-red-200 text-red-600"
                    : record.ip.actual >= record.ip.standard
                    ? "bg-green-200 text-green-600"
                    : ""
                } rounded py-0.5`}
              >
                {record.ip.actual
                  ? parseFloat(record.ip.actual).toFixed(0)
                  : "-"}
              </p>
            ) || "-"
          }
        />
      </ColumnGroup>
      <ColumnGroup title="List Problem" fixed={true}>
        <Column
          title="Infrastructure"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) =>
            (record.infrastructure.length && (
              <ul className="list-disc ml-1 text-left">
                {record.infrastructure.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )) ||
            "-"
          }
        />
        <Column
          title="Management"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) =>
            (record.management.length && (
              <ul className="list-disc ml-1 text-left">
                {record.management.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )) ||
            "-"
          }
        />
        <Column
          title="Farm Input"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) =>
            (record.farmInput.length && (
              <ul className="list-disc ml-1 text-left">
                {record.farmInput.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )) ||
            "-"
          }
        />
        <Column
          title="Diseases"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) =>
            (record.diseases.length && (
              <ul className="list-disc ml-1 text-left">
                {record.diseases.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )) ||
            "-"
          }
        />
        <Column
          title="Force Majeure"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) =>
            (record.forceMajeure.length && (
              <ul className="list-disc ml-1 text-left">
                {record.forceMajeure.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )) ||
            "-"
          }
        />
        <Column
          title="Others"
          dataIndex="issues"
          key="issues"
          width={200}
          align="center"
          render={(record) => record.others || "-"}
        />
      </ColumnGroup>
      <Column
        title="Treatment"
        key="treatment"
        width={200}
        align="center"
        render={(record) =>
          (record.treatment && (
            <ul className="list-disc ml-1 text-left">
              {record.treatment.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )) ||
          "-"
        }
      />
    </Table>
  );
};

export default TableColumns;
