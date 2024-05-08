import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import FileListIcon from "@icons/FileListIcon.svg";
import {
  getBranches,
  getCoops,
  getFarmingCycleHarvests,
  getFarms,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TCoopResponse,
  TFarmingCycleHarvestItem,
  TFarmingCycleHarvestTableResponse,
  TFarmResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./harvest.columns";
import { ACTIONS, emptySearch, initialState } from "./harvest.constants";
import { reducer } from "./harvest.reducer";
import AdvanceSearch from "./harvest.search";

const Harvest: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TFarmingCycleHarvestTableResponse> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getFarmingCycleHarvests({
        page: state.tablePage,
        limit: 10,
        farmingCycleCode: isEmptyString(state.search.farmingCycleCode)
          ? undefined
          : state.search.farmingCycleCode,
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
        branchId:
          state.search.branch === null || state.search.branch.value.id === 0
            ? undefined
            : state.search.branch.value.id,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
        status:
          state.search.status === null ||
          isEmptyString(state.search.status.value)
            ? undefined
            : state.search.status.value,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const onPage = Math.ceil(data.count / 10);
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
  const ownerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["userData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userType: USER_TYPE.OWN.full,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        dispatch({
          type: ACTIONS.SET_OWNER_DATA,
          payload: { data: data.data },
        });
      },
    }
  );

  if (tableData.isLoading) return <Loading />;
  if (
    tableData.isError ||
    ownerData.isError ||
    farmData.isError ||
    coopData.isError ||
    branchData.isError
  )
    return <Error router={router} />;
  return (
    <MainWrapper headTitle="Harvest" pageTitle="Harvest">
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
        addNewButtonTitle="Add Realization"
        onClickAddNew={() => router.push("/report/harvest/create")}
      />
      <Table
        scrollX={2000}
        tableData={tableData.data?.data.data.farmingCycles}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 68,
            key: "action",
            render: (record: TFarmingCycleHarvestItem) => (
              <Button
                isAnchor={true}
                href={"/report/harvest/details/" + encodeString(record.id)}
                type="icon-outline"
                title="Edit"
                size="sm"
                icon={<FileListIcon />}
              />
            ),
          },
          ...columns,
        ]}
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

export default Harvest;
