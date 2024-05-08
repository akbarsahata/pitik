import Table from "@components/molecules/Table/Table";
import MainWrapper from "@components/wrappers/Main/Main";
import { isAuthenticate } from "@services/utils/authenticate";
import { Tabs } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useReducer } from "react";
import {
  ACTION_TYPE,
  ACTIONS,
  emptySearch,
  HISTORICAL_SENSOR_TYPES,
  store,
} from "./historical-data.constants";
import { reducer } from "./historical-data.reducer";
import AdvanceSearch from "./historical-data.search";

import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import FileExcel from "@icons/FileExcel.svg";
import {
  getBuildings,
  getCoops,
  getDevicesSensor,
  getDeviceTypes,
  getFarms,
  getReportHistoricalData,
  getRooms,
} from "@services/api";
import { isEmptyString } from "@services/utils/string";
import {
  TBuildingResponse,
  TCoopResponse,
  TDevicesSensorResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  TGetManyResponse,
  TReportHistoricalData,
  TRoomResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useQuery, UseQueryResult } from "react-query";
import {
  getRenderableColumns,
  handleExcel,
  transformData,
} from "./historical-data.functions";

const HistoricalData: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  useEffect(() => {
    dispatch({
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
      payload: true,
    });
  }, []);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TReportHistoricalData[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getReportHistoricalData({
        page: state.tablePage,
        limit: 15,
        macAddress: isEmptyString(state.search?.macAddress || "")
          ? undefined
          : state.search.macAddress,
        startDate: new Date(state.search.startDate).toISOString() || "",
        endDate:
          new Date(state.search.endDate + "T23:59:59.000Z").toISOString() || "",
        interval: state.search.interval?.value || 0,
      }),
    {
      enabled: !!state.search.macAddress,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        // Pagination
        const onPage = Math.ceil(data.count / 10);
        if (onPage === state.tablePage) {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage,
          });
        }
      },
    }
  );

  const farmData: UseQueryResult<
    { data: TGetManyResponse<TFarmResponse[]> },
    AxiosError
  > = useQuery(
    ["farmData"],
    async () =>
      await getFarms({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const farmList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FARM_DATA,
          payload: farmList,
        });
      },
    }
  );

  const coopData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["coopData", state.inputSearch.farm],
    async () =>
      await getCoops({
        page: 1,
        limit: 0,
        status: true,
        farmId: state.inputSearch.farm?.value.id,
      }),
    {
      enabled: !!state.inputSearch.farm,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const coopList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_DATA,
          payload: coopList,
        });
      },
    }
  );

  const buildingData: UseQueryResult<
    { data: TGetManyResponse<TBuildingResponse[]> },
    AxiosError
  > = useQuery(
    ["buildingData", state.inputSearch.farm],
    async () =>
      await getBuildings({
        page: 1,
        limit: 0,
        status: true,
        farmId: state.inputSearch.farm?.value.id,
      }),
    {
      enabled: !!state.inputSearch.farm,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const buildingList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING_DATA,
          payload: buildingList,
        });
      },
    }
  );

  const roomData: UseQueryResult<
    { data: TGetManyResponse<TRoomResponse[]> },
    AxiosError
  > = useQuery(
    ["roomData", state.inputSearch.building],
    async () =>
      await getRooms({
        page: 1,
        limit: 0,
        buildingId: state.inputSearch.building?.value.id,
      }),
    {
      enabled: !!state.inputSearch.building,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const roomIdList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_ROOM_DATA,
          payload: roomIdList,
        });
      },
    }
  );

  const deviceTypeData: UseQueryResult<
    { data: TGetManyResponse<TDeviceTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["deviceTypeData"],
    async () =>
      await getDeviceTypes({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE_DATA,
          payload: deviceTypeList,
        });
      },
    }
  );

  const deviceData: UseQueryResult<
    { data: TGetManyResponse<TDevicesSensorResponse[]> },
    AxiosError
  > = useQuery(
    ["deviceData", state.inputSearch.coop, state.inputSearch.deviceType],
    async () =>
      await getDevicesSensor({
        page: 1,
        limit: 0,
        coopId: state.inputSearch.coop?.value.id,
        deviceType: state.inputSearch.deviceType?.value.value,
      }),
    {
      enabled: !!state.inputSearch.coop && !!state.inputSearch.deviceType,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_DATA,
          payload: deviceList,
        });
      },
    }
  );
  let tabs = [
    {
      menu: HISTORICAL_SENSOR_TYPES.all.label,
      component: (
        <Table
          key={1}
          scrollX={500}
          tableData={tableData.data && transformData(tableData.data?.data.data)}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.all.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },
    {
      menu: HISTORICAL_SENSOR_TYPES.t.label,
      component: (
        <Table
          key={2}
          scrollX={500}
          tableData={tableData.data?.data.data}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.t.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },
    {
      menu: HISTORICAL_SENSOR_TYPES.h.label,
      component: (
        <Table
          key={3}
          scrollX={500}
          tableData={tableData.data?.data.data}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.h.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },
    {
      menu: HISTORICAL_SENSOR_TYPES.l.label,
      component: (
        <Table
          key={4}
          scrollX={500}
          tableData={tableData.data?.data.data}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.l.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },
    {
      menu: HISTORICAL_SENSOR_TYPES.a.label,
      component: (
        <Table
          key={5}
          scrollX={500}
          tableData={tableData.data?.data.data}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.a.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },

    {
      menu: HISTORICAL_SENSOR_TYPES.w.label,
      component: (
        <Table
          key={6}
          scrollX={500}
          tableData={tableData.data?.data.data}
          isPagination={false}
          pagination={{
            position: ["bottomRight"],
          }}
          columns={getRenderableColumns({
            tableData: tableData.data?.data.data,
            sensorType: HISTORICAL_SENSOR_TYPES.w.key,
          })}
          tablePage={state.tablePage}
          isLastPage={state.isLastPage}
          onClickNext={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage + 1,
            })
          }
          onClickPrevious={() =>
            dispatch({
              type: ACTION_TYPE.SET_TABLE_PAGE,
              payload: state.tablePage - 1,
            })
          }
        />
      ),
    },
  ];

  if (tableData.isLoading) return <Loading />;
  if (
    tableData.isError ||
    farmData.isError ||
    coopData.isError ||
    buildingData.isError ||
    roomData.isError ||
    deviceData.isError ||
    deviceTypeData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Historical Data" pageTitle="Historical Data">
      <TableBar
        isResetAllButtonVisible={state.search === emptySearch ? false : true}
        exportButtonLeadIcon={<FileExcel />}
        exportButtonState={tableData.data?.data.data ? "active" : "disabled"}
        onClickExport={() => {
          const tableToExport = state.tableToExport || "all"; // to set default value if no tab has been clicked
          if (tableData.data?.data.data) {
            handleExcel({
              tab: tableToExport,
              columns: getRenderableColumns({
                tableData: tableData.data?.data.data,
                sensorType: tableToExport,
              }),
              tableData:
                tableToExport === "all"
                  ? transformData(tableData.data?.data.data)
                  : tableData.data?.data.data,
            });
          }
        }}
        onClickResetSearch={() => {
          dispatch({ type: ACTION_TYPE.RESET_SEARCH, payload: null });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: true,
          })
        }
      />
      <Tabs
        defaultActiveKey="1"
        className="mt-5"
        onTabClick={(key) => {
          const dispatchData: ACTIONS = {
            type: ACTION_TYPE.SET_TABLE_TO_EXPORT,
            payload: HISTORICAL_SENSOR_TYPES[key]?.key,
          };
          dispatchData.payload =
            key === "1"
              ? HISTORICAL_SENSOR_TYPES.all.key
              : key === "2"
              ? HISTORICAL_SENSOR_TYPES.t.key
              : key === "3"
              ? HISTORICAL_SENSOR_TYPES.h.key
              : key === "4"
              ? HISTORICAL_SENSOR_TYPES.l.key
              : key === "5"
              ? HISTORICAL_SENSOR_TYPES.a.key
              : key === "6"
              ? HISTORICAL_SENSOR_TYPES.w.key
              : "";
          dispatch(dispatchData);
        }}
      >
        {tabs.map((item: { menu: string; component: any }, index: any) => (
          <Tabs.TabPane tab={item.menu} key={index + 1}>
            {item.component}
          </Tabs.TabPane>
        ))}
      </Tabs>

      <AdvanceSearch
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: 1,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH,
            payload: state.inputSearch,
          });
        }}
      />
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default HistoricalData;
