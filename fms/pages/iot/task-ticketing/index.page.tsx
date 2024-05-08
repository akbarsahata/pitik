import Button from "@components/atoms/Button/Button";
import DeviceCard from "@components/atoms/DeviceCard/DeviceCard";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import EditIcon from "@icons/EditIcon.svg";
import FileListIcon from "@icons/FileListIcon.svg";
import {
  getBranches,
  getCoops,
  getFarms,
  getIotTickets,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TCoopResponse,
  TFarmResponse,
  TGetManyResponse,
  TIotTicketDataResponse,
  TUserResponse,
} from "@type/response.type";
import { Tabs } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { columns } from "./task-ticketing.columns";
import {
  ACTIONS,
  emptySearch,
  initialState,
  TGetManyIotTicketResponse,
  TICKET_STATUS,
} from "./task-ticketing.constants";
import { handlePagination, manageTablePages } from "./task-ticketing.functions";
import { reducer } from "./task-ticketing.reducer";
import AdvanceSearch from "./task-ticketing.search";

const TaskTicketing: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  const advanceSearches = {
    macAddress: isEmptyString(state.search.macAddress)
      ? undefined
      : state.search.macAddress.toLowerCase(),
    deviceId: isEmptyString(state.search.deviceId)
      ? undefined
      : state.search.deviceId,
    farmId:
      state.search.farm === null || isEmptyString(state.search.farm.value.id)
        ? undefined
        : state.search.farm.value.id,
    coopId:
      state.search.coop === null || isEmptyString(state.search.coop.value.id)
        ? undefined
        : state.search.coop.value.id,
    branchId:
      state.search.branch === null ||
      isEmptyString(state.search.branch.value.id)
        ? undefined
        : state.search.branch.value.id,
    picId:
      state.search.pic === null || isEmptyString(state.search.pic.value.id)
        ? undefined
        : state.search.pic.value.id,
    incident: isEmptyString(state.search.incident)
      ? undefined
      : state.search.incident,
  };

  const tableDataAll: UseQueryResult<
    { data: TGetManyIotTicketResponse<TIotTicketDataResponse[]> },
    AxiosError
  > = useQuery(
    ["tableDataAll", state.search, state.tablePageAll.tablePage],
    async () => {
      return await getIotTickets({
        page: state.tablePageAll.tablePage,
        limit: 10,
        ...advanceSearches,
      });
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        manageTablePages({ data, tab: TICKET_STATUS.ALL, dispatch, state });
        if (state.activeTab === TICKET_STATUS.ALL) {
          dispatch({
            type: ACTIONS.SET_TABLE_DATA,
            payload: { data: data.data },
          });
        }
      },
    }
  );

  const tableDataOpen: UseQueryResult<
    { data: TGetManyIotTicketResponse<TIotTicketDataResponse[]> },
    AxiosError
  > = useQuery(
    ["tableDataOpen", state.search, state.tablePageOpen.tablePage],
    async () => {
      return await getIotTickets({
        page: state.tablePageOpen.tablePage,
        limit: 10,
        status: "OPEN",
        ...advanceSearches,
      });
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        manageTablePages({ data, tab: TICKET_STATUS.OPEN, dispatch, state });
        dispatch({
          type: ACTIONS.SET_DEVICE_STATUS,
          payload: { data: data.deviceStatus },
        });
        if (state.activeTab === TICKET_STATUS.OPEN) {
          dispatch({
            type: ACTIONS.SET_TABLE_DATA,
            payload: { data: data.data },
          });
        }
      },
    }
  );

  const tableDataOnMaintenance: UseQueryResult<
    { data: TGetManyIotTicketResponse<TIotTicketDataResponse[]> },
    AxiosError
  > = useQuery(
    [
      "tableDataOnMaintenance",
      state.search,
      state.tablePageOnMaintenance.tablePage,
    ],
    async () => {
      return await getIotTickets({
        page: state.tablePageOnMaintenance.tablePage,
        limit: 10,
        status: "ON_MAINTENANCE",
        ...advanceSearches,
      });
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        manageTablePages({
          data,
          tab: TICKET_STATUS.ON_MAINTENANCE,
          dispatch,
          state,
        });
        if (state.activeTab === TICKET_STATUS.ON_MAINTENANCE) {
          dispatch({
            type: ACTIONS.SET_TABLE_DATA,
            payload: { data: data.data },
          });
        }
      },
    }
  );

  const tableDataResolved: UseQueryResult<
    { data: TGetManyIotTicketResponse<TIotTicketDataResponse[]> },
    AxiosError
  > = useQuery(
    ["tableDataResolved", state.search, state.tablePageResolved.tablePage],
    async () => {
      return await getIotTickets({
        page: state.tablePageResolved.tablePage,
        limit: 10,
        status: "RESOLVED",
        ...advanceSearches,
      });
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        manageTablePages({
          data,
          tab: TICKET_STATUS.RESOLVED,
          dispatch,
          state,
        });
        if (state.activeTab === TICKET_STATUS.RESOLVED) {
          dispatch({
            type: ACTIONS.SET_TABLE_DATA,
            payload: { data: data.data },
          });
        }
      },
    }
  );

  const tableDataOthers: UseQueryResult<
    { data: TGetManyIotTicketResponse<TIotTicketDataResponse[]> },
    AxiosError
  > = useQuery(
    ["tableDataOthers", state.search, state.tablePageOthers.tablePage],
    async () => {
      return await getIotTickets({
        page: state.tablePageOthers.tablePage,
        limit: 10,
        status: "OTHERS",
        ...advanceSearches,
      });
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        manageTablePages({ data, tab: TICKET_STATUS.OTHERS, dispatch, state });
        if (state.activeTab === TICKET_STATUS.OTHERS) {
          dispatch({
            type: ACTIONS.SET_TABLE_DATA,
            payload: { data: data.data },
          });
        }
      },
    }
  );

  const coopData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["coopData"],
    async () =>
      await getCoops({
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
        const coopList = data.data || [];
        dispatch({
          type: ACTIONS.SET_COOP_DATA,
          payload: { data: coopList },
        });
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
          type: ACTIONS.SET_FARM_DATA,
          payload: { data: farmList },
        });
      },
    }
  );

  const branchData: UseQueryResult<
    { data: { data: TGetManyResponse<TBranchResponse[]> } },
    AxiosError
  > = useQuery(["branchData"], async () => await getBranches(), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const branchList = data.data.data || [];
      dispatch({
        type: ACTIONS.SET_BRANCH_DATA,
        payload: { data: branchList },
      });
    },
  });

  const picData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["picData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userTypes: [USER_TYPE.IS.full].join(","),
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const userList = data.data || [];
        const picList = userList.filter(
          (user) => user.userType === USER_TYPE.IS.full
        );
        dispatch({
          type: ACTIONS.SET_PIC_DATA,
          payload: { data: picList },
        });
      },
    }
  );

  if (
    tableDataAll.isLoading ||
    tableDataOpen.isLoading ||
    tableDataOnMaintenance.isLoading ||
    tableDataResolved.isLoading ||
    tableDataOthers.isLoading
  )
    return <Loading />;
  if (
    coopData.isError ||
    farmData.isError ||
    branchData.isError ||
    picData.isError ||
    tableDataAll.isError ||
    tableDataOpen.isError ||
    tableDataOnMaintenance.isError ||
    tableDataResolved.isError ||
    tableDataOthers.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Task Ticketing" pageTitle="Task Ticketing">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-y-4 md:space-y-0 md:gap-4 lg:space-y-0 mt-5">
          <DeviceCard
            text="Total Device"
            type="open"
            total={state.deviceStatus.open}
          />
          <DeviceCard
            text="Total Device"
            type="onMaintenance"
            total={state.deviceStatus.onMaintenance}
          />
          <DeviceCard
            text="Total Device"
            type="resolved"
            total={state.deviceStatus.resolved}
          />
          <DeviceCard
            text="Total Device"
            type="others"
            total={state.deviceStatus.others}
          />
        </div>
        <Tabs
          defaultActiveKey={state.activeTab}
          className="mt-5"
          onChange={(key) => {
            dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: { data: key } });
            dispatch({
              type: ACTIONS.SET_TABLE_DATA,
              payload: {
                data:
                  key === TICKET_STATUS.ALL
                    ? tableDataAll.data?.data.data
                    : key === TICKET_STATUS.OPEN
                    ? tableDataOpen.data?.data.data
                    : key === TICKET_STATUS.ON_MAINTENANCE
                    ? tableDataOnMaintenance.data?.data.data
                    : key === TICKET_STATUS.RESOLVED
                    ? tableDataResolved.data?.data.data
                    : tableDataOthers.data?.data.data,
              },
            });
          }}
        >
          <Tabs.TabPane tab="All" key={TICKET_STATUS.ALL}></Tabs.TabPane>
          <Tabs.TabPane tab="Open" key={TICKET_STATUS.OPEN}></Tabs.TabPane>
          <Tabs.TabPane
            tab="On Maintenance"
            key={TICKET_STATUS.ON_MAINTENANCE}
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab="Resolved"
            key={TICKET_STATUS.RESOLVED}
          ></Tabs.TabPane>
          <Tabs.TabPane tab="Others" key={TICKET_STATUS.OTHERS}></Tabs.TabPane>
        </Tabs>
        <TableBar
          isResetAllButtonVisible={state.search === emptySearch ? false : true}
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
          newButtonVisible={false}
        />

        <Table
          scrollX={2400}
          tableData={state.tableData}
          columns={[
            {
              title: "Action",
              fixed: "left",
              width: 20,
              key: "action",
              render: (record: TIotTicketDataResponse) => (
                <div className="flex flex-row items-center justify-start mb-2">
                  <div className="w-12 pl-1 flex items-center justify-start">
                    <Button
                      type="icon-outline"
                      title="Edit"
                      size="sm"
                      icon={
                        record.status === TICKET_STATUS.RESOLVED ? (
                          <FileListIcon />
                        ) : (
                          <EditIcon />
                        )
                      }
                      isAnchor={true}
                      href={
                        "/iot/task-ticketing/edit/" + encodeString(record.id)
                      }
                    />
                  </div>
                </div>
              ),
            },
            ...columns,
          ]}
          tablePage={
            state.activeTab === TICKET_STATUS.ALL
              ? state.tablePageAll.tablePage
              : state.activeTab === TICKET_STATUS.OPEN
              ? state.tablePageOpen.tablePage
              : state.activeTab === TICKET_STATUS.ON_MAINTENANCE
              ? state.tablePageOnMaintenance.tablePage
              : state.activeTab === TICKET_STATUS.RESOLVED
              ? state.tablePageResolved.tablePage
              : state.activeTab === TICKET_STATUS.OTHERS
              ? state.tablePageOthers.tablePage
              : 1
          }
          isLastPage={
            state.activeTab === TICKET_STATUS.ALL
              ? state.tablePageAll.isLastPage
              : state.activeTab === TICKET_STATUS.OPEN
              ? state.tablePageOpen.isLastPage
              : state.activeTab === TICKET_STATUS.ON_MAINTENANCE
              ? state.tablePageOnMaintenance.isLastPage
              : state.activeTab === TICKET_STATUS.RESOLVED
              ? state.tablePageResolved.isLastPage
              : state.activeTab === TICKET_STATUS.OTHERS
              ? state.tablePageOthers.isLastPage
              : true
          }
          onClickNext={() => handlePagination({ type: "add", state, dispatch })}
          onClickPrevious={() =>
            handlePagination({ type: "substract", state, dispatch })
          }
        />

        <AdvanceSearch
          dispatch={dispatch}
          state={state}
          onClickOk={() => {
            dispatch({
              type: ACTIONS.SET_RESET_ALL_TABLE_PAGE,
              payload: {
                data: null,
              },
            });
            queryClient.invalidateQueries();
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
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default TaskTicketing;
