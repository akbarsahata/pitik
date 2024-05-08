import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import EditIcon from "@icons/EditIcon.svg";
import {
  getChickenStrains,
  getCoopTypes,
  getTargets,
  getVariables,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TGetManyResponse,
  TTargetLibraryResponse,
  TVariableResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import isEmpty from "validator/lib/isEmpty";
import { ACTION_TYPE, search, store } from "./target-library.constants";
import { reducer } from "./target-library.reducer";
import AdvanceSearch from "./target-library.search";
import { columns } from "./targret-library.columns";

const Internal: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TTargetLibraryResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getTargets({
        page: state.tablePage,
        limit: 10,
        targetCode: isEmpty(state.search.targetCode as string, {
          ignore_whitespace: false,
        })
          ? undefined
          : state.search.targetCode,
        targetName: isEmpty(state.search.targetName as string, {
          ignore_whitespace: false,
        })
          ? undefined
          : state.search.targetName,
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
        variableId:
          state.search.variable === null ||
          isEmptyString(state.search.variable.value.id)
            ? undefined
            : state.search.variable.value.id,
        status: state.search.status ? state.search.status.value : undefined,
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

  const variableData: UseQueryResult<
    { data: TGetManyResponse<TVariableResponse[]> },
    AxiosError
  > = useQuery(
    ["variableData"],
    async () =>
      await getVariables({
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
        const variableList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_VARIABLE_DATA,
          payload: variableList,
        });
      },
    }
  );

  if (
    tableData.isLoading ||
    coopTypeData.isLoading ||
    chickTypeData.isLoading ||
    variableData.isLoading
  )
    return <Loading />;
  if (
    tableData.isError ||
    coopTypeData.isError ||
    chickTypeData.isError ||
    variableData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Target Libraries" pageTitle="Target Libraries">
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
        addNewButtonTitle="Add New Target Library"
        onClickAddNew={() => router.push("/master/library/target/create")}
      />
      <Table
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 68,
            key: "action",
            render: (record: { id: string }) => (
              <Button
                type="icon-outline"
                title="Edit"
                size="sm"
                icon={<EditIcon />}
                isAnchor={true}
                href={"/master/library/target/edit/" + encodeString(record.id)}
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

export default Internal;
