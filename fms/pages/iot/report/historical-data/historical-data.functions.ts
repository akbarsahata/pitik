import {
  TReportHistoricalData,
  TReportHistoricalDataAll,
} from "@type/response.type";
import { Excel } from "antd-table-saveas-excel";
import { HISTORICAL_SENSOR_TYPES, TColumn } from "./historical-data.constants";

export const getRenderableColumns = ({
  tableData,
  sensorType,
}: {
  tableData: TReportHistoricalData[] | undefined;
  sensorType: string;
}) => {
  const columns: any[] = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
  ];
  if (tableData) {
    if (sensorType === HISTORICAL_SENSOR_TYPES.t.key) {
      for (const data in tableData[0]?.temperature) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : item.toFixed(2)) : "-",
        });
      }
    } else if (sensorType === HISTORICAL_SENSOR_TYPES.h.key) {
      for (const data in tableData[0]?.humidity) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : Math.round(item)) : "-",
        });
      }
    } else if (sensorType === HISTORICAL_SENSOR_TYPES.l.key) {
      for (const data in tableData[0]?.lamp) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : Math.round(item)) : "-",
        });
      }
    } else if (sensorType === HISTORICAL_SENSOR_TYPES.a.key) {
      for (const data in tableData[0]?.ammonia) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : item.toFixed(2)) : "-",
        });
      }
    } else if (sensorType === HISTORICAL_SENSOR_TYPES.w.key) {
      for (const data in tableData[0]?.windSpeed) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : item.toFixed(2)) : "-",
        });
      }
    } else if (sensorType === HISTORICAL_SENSOR_TYPES.all.key) {
      const allTableData = transformData(tableData);
      for (const data in allTableData[0]?.all) {
        columns.push({
          title: data,
          dataIndex: [sensorType, data],
          key: data,
          render: (item: number) =>
            item ? (Number.isInteger(item) ? item : item.toFixed(2)) : "-",
        });
      }
    }
  }
  return columns;
};

export function transformData(originalData: TReportHistoricalData[]) {
  const transformedData = originalData.map((item) => {
    let all: { [key: string]: number } = {};
    const properties = Object.keys(item).filter((key) => key !== "time");
    properties.forEach((key) => {
      const prop = key as keyof TReportHistoricalData;
      let modifiedValues: { [key: string]: number } = {};
      if (prop === "temperature") {
        Object.keys(item[prop]).forEach((valueKey) => {
          const temperatureValue = item[prop][valueKey] || 0;
          modifiedValues[`${valueKey} (°C)`] = temperatureValue;
        });
      } else if (prop === "humidity") {
        Object.keys(item[prop]).forEach((valueKey) => {
          const humidityValue = item[prop][valueKey] || 0;
          modifiedValues[`${valueKey} (%)`] = humidityValue;
        });
      } else {
        modifiedValues = item[prop] as { [key: string]: number };
      }
      Object.assign(all, modifiedValues);
    });
    all = Object.keys(all)
      .sort()
      .reduce((allObject, curr) => {
        allObject[curr] = all[curr];
        return allObject;
      }, {} as { [key: string]: number });
    return { time: item.time, all };
  });
  return transformedData;
}

export function handleExcel({
  tab,
  columns,
  tableData,
}: {
  tab: string;
  columns: TColumn[];
  tableData?: TReportHistoricalData[] | TReportHistoricalDataAll[];
}) {
  const excel = new Excel();
  if (tableData) {
    try {
      excel
        .addSheet(`Historical Data - ${tab}`)
        .addColumns(columns)
        .addDataSource(tableData)
        .saveAs("Report-Historical Data.xlsx");
    } catch (error) {
      console.error("handleExcel error", error);
    }
  }
}
