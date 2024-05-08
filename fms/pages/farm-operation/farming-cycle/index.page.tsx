import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { FARMING_STATUS, USER_TYPE } from "@constants/index";
import EditIcon from "@icons/EditIcon.svg";
import FileListIcon from "@icons/FileListIcon.svg";
import {
  getBranches,
  getChickenStrains,
  getCoops,
  getCoopTypes,
  getFarmingCycles,
  getFarms,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TChickenStrainResponse,
  TCoopResponse,
  TCoopTypeResponse,
  TFarmingCycleResponse,
  TFarmResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./farming-cycle.columns";
import { ACTION_TYPE, search, store } from "./farming-cycle.constants";
import { reducer } from "./farming-cycle.reducer";
import AdvanceSearch from "./farming-cycle.search";

const FarmingCycle: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TFarmingCycleResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getFarmingCycles({
        page: state.tablePage,
        limit: 10,
        farmingCycleCode: isEmptyString(state.search.farmingCycleCode || "")
          ? undefined
          : state.search.farmingCycleCode,
        farmingStatus:
          state.search.farmingStatus === null ||
          isEmptyString(state.search.farmingStatus.value)
            ? undefined
            : state.search.farmingStatus.value,
        coopTypeId:
          state.search.coopType === null ||
          isEmptyString(state.search.coopType.value.id)
            ? undefined
            : state.search.coopType.value.id,
        chickTypeId:
          state.search.chickType === null ||
          isEmptyString(state.search.chickType.value.id)
            ? undefined
            : state.search.chickType.value.id,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
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
        contract:
          state.search.contract === null ||
          isEmptyString(state.search.contract.value)
            ? undefined
            : state.search.contract.value,
        branchId:
          state.search.branch === null ||
          isEmptyString(state.search.branch.value.id)
            ? undefined
            : state.search.branch.value.id,
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

  const ownerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["ownerData"],
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
        const ownerList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_OWNER_DATA,
          payload: ownerList,
        });
      },
    }
  );

  const coopTypeData: UseQueryResult<
    { data: TGetManyResponse<TCoopTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["coopTypeData"],
    async () =>
      await getCoopTypes({
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
        const coopTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_TYPE_DATA,
          payload: coopTypeList,
        });
      },
    }
  );

  const chickTypeData: UseQueryResult<
    { data: TGetManyResponse<TChickenStrainResponse[]> },
    AxiosError
  > = useQuery(
    ["chickTypeData"],
    async () =>
      await getChickenStrains({
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
        const chickTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CHICK_TYPE_DATA,
          payload: chickTypeList,
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
          type: ACTION_TYPE.SET_COOP_DATA,
          payload: coopList,
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
        type: ACTION_TYPE.SET_BRANCH_DATA,
        payload: branchList,
      });
    },
  });

  if (tableData.isLoading) return <Loading />;
  if (
    tableData.isError ||
    ownerData.isError ||
    farmData.isError ||
    coopData.isError ||
    coopTypeData.isError ||
    chickTypeData.isError ||
    branchData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Farming Cycle" pageTitle="Farming Cycle">
      <TableBar
        isResetAllButtonVisible={state.search === search ? false : true}
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
        addNewButtonTitle="Add New Farming Cycle"
        onClickAddNew={() =>
          router.push("/farm-operation/farming-cycle/create")
        }
      />
      <Table
        scrollX={2500}
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 68,
            key: "action",
            render: (record: TFarmingCycleResponse) => (
              <Button
                type="icon-outline"
                title="Edit"
                size="sm"
                icon={
                  record.farmingStatus === FARMING_STATUS.CLOSED ? (
                    <FileListIcon />
                  ) : (
                    <EditIcon />
                  )
                }
                isAnchor={true}
                href={
                  "/farm-operation/farming-cycle/edit/" +
                  encodeString(record.farmingCycleId)
                }
              />
            ),
          },
          ...columns,
        ]}
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

export default FarmingCycle;
