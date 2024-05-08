import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import EditIcon from "@icons/EditIcon.svg";
import { getTaskLibraries } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import { TGetManyResponse, TTaskLibraryResponse } from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./task-library.columns";
import { ACTION_TYPE, search, store } from "./task-library.constants";
import { reducer } from "./task-library.reducer";
import AdvanceSearch from "./task-library.search";

const Task: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TTaskLibraryResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getTaskLibraries({
        page: state.tablePage,
        limit: 10,
        taskCode: isEmptyString(state.search.taskCode || "")
          ? undefined
          : state.search.taskCode,
        taskName: isEmptyString(state.search.taskName || "")
          ? undefined
          : state.search.taskName,
        manualDeadline: state.search.manualDeadline
          ? parseInt(state.search.manualDeadline)
          : undefined,
        harvestOnly: state.search.harvestOnly
          ? state.search.harvestOnly.value
          : undefined,
        manualTrigger: state.search.manualTrigger
          ? state.search.manualTrigger.value
          : undefined,
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

  if (tableData.isLoading) return <Loading />;
  if (tableData.isError) return <Error router={router} />;

  return (
    <MainWrapper headTitle="Task Library" pageTitle="Task Library">
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
        addNewButtonTitle="Add New Task Library"
        onClickAddNew={() => router.push("/master/library/task/create")}
      />
      <Table
        tableData={tableData.data?.data.data}
        scrollX={4500}
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
                href={"/master/library/task/edit/" + encodeString(record.id)}
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

export default Task;
