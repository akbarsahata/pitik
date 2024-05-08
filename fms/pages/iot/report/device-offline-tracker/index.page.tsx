import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import MainWrapper from "@components/wrappers/Main/Main";
import {
  getCoops,
  getFarms,
  getReportDeviceOfflineTracker,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { isEmptyString } from "@services/utils/string";
import {
  TCoopResponse,
  TFarmResponse,
  TGetManyResponse,
  TReportDeviceOfflineTrackertResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./device-offline-tracker.columns";
import {
  ACTIONS,
  emptySearch,
  initialState,
} from "./device-offline-tracker.constants";
import { reducer } from "./device-offline-tracker.reducer";
import AdvanceSearch from "./device-offline-tracker.search";
import Loading from "@components/wrappers/Loading/Loading";
import Error from "@components/wrappers/Error/Error";

const DeviceOfflineTracker: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE,
      payload: { data: true },
    });
  }, []);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TReportDeviceOfflineTrackertResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getReportDeviceOfflineTracker({
        page: state.tablePage,
        limit: 10,
        startDate: new Date(state.search.startDate).toISOString() || "",
        endDate:
          new Date(state.search.endDate + "T23:59:59.000Z").toISOString() || "",
        farmId:
          state.search.farm === null ||
          isEmptyString(state.search.farm.value.id)
            ? undefined
            : state.search.farm.value.id,
        coopId:
          state.search.coop === null ||
          isEmptyString(state.search.coop.value.id)
            ? undefined
            : state.search.coop.value.id,
      }),
    {
      enabled: !!state.search.startDate && !!state.search.endDate,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const itemsPerPage = 10;
        const startIndex = (state.tablePage - 1) * itemsPerPage;
        data.data?.forEach((item, i) => {
          item.no = startIndex + i + 1;
        });
        const onPage = Math.ceil(data.count / itemsPerPage);

        if (onPage === state.tablePage) {
          dispatch({
            type: ACTIONS.SET_IS_LAST_PAGE,
            payload: { data: true },
          });
        } else {
          dispatch({
            type: ACTIONS.SET_IS_LAST_PAGE,
            payload: { data: false },
          });
          dispatch({
            type: ACTIONS.SET_TABLE_PAGE,
            payload: { data: state.tablePage },
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
        status: true,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const farmList = data.data || [];
        dispatch({
          type: ACTIONS.SET_FARM_DATA,
          payload: { data: farmList },
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
        farmId: state.inputSearch.farm.value.id,
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
          type: ACTIONS.SET_COOP_DATA,
          payload: { data: coopList },
        });
      },
    }
  );
  const tableDataWithIndex = tableData.data?.data?.data.map((item, i) => ({
    ...item,
    no: i + 1,
  }));

  if (tableData.isLoading) return <Loading />;
  if (tableData.isError || farmData.isError || coopData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Device Offline Tracker"
      pageTitle="Device Offline Tracker"
    >
      <TableBar
        isResetAllButtonVisible={state.search === emptySearch ? false : true}
        newButtonVisible={false}
        onClickResetSearch={() => {
          dispatch({ type: ACTIONS.RESET_SEARCH, payload: { data: {} } });
          dispatch({
            type: ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: { data: false },
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: { data: true },
          })
        }
      />
      <Table
        scrollX={500}
        tableData={tableData.data?.data.data}
        columns={columns}
        tablePage={state.tablePage}
        isLastPage={state.isLastPage}
        onClickNext={() =>
          dispatch({
            type: ACTIONS.SET_TABLE_PAGE,
            payload: { data: state.tablePage + 1 },
          })
        }
        onClickPrevious={() =>
          dispatch({
            type: ACTIONS.SET_TABLE_PAGE,
            payload: { data: state.tablePage - 1 },
          })
        }
      />

      <AdvanceSearch
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTIONS.SET_TABLE_PAGE,
            payload: { data: 1 },
          });
          dispatch({
            type: ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: { data: false },
          });
          dispatch({
            type: ACTIONS.SET_SEARCH,
            payload: { data: state.inputSearch },
          });
        }}
      />
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default DeviceOfflineTracker;
