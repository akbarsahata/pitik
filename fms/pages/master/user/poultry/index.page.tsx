import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import EditIcon from "@icons/EditIcon.svg";
import { getUsers } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import { TGetManyResponse, TUserResponse } from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./poultry.columns";
import { ACTION_TYPE, ROLE_TYPES, search, store } from "./poultry.constants";
import { reducer } from "./poultry.reducer";
import AdvanceSearch from "./poultry.search";

const Poultry: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getUsers({
        page: state.tablePage,
        limit: 10,
        userTypes: state.search.userType ? undefined : ROLE_TYPES.join(","),
        userType:
          state.search === search ||
          state.search.userType == null ||
          isEmptyString(state.search.userType.value)
            ? undefined
            : state.search.userType.value.toLowerCase(),
        name: isEmptyString(state.search.fullName || "")
          ? undefined
          : state.search.fullName,
        userCode: isEmptyString(state.search.userCode || "")
          ? undefined
          : state.search.userCode,
        email: isEmptyString(state.search.email || "")
          ? undefined
          : state.search.email,
        phoneNumber: isEmptyString(state.search.phoneNumber || "")
          ? undefined
          : state.search.phoneNumber,
        waNumber: isEmptyString(state.search.waNumber || "")
          ? undefined
          : state.search.waNumber,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
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

  const ownerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["ownerData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        userType: USER_TYPE.OWN.full,
        status: true,
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

  if (tableData.isLoading || ownerData.isLoading) return <Loading />;
  if (tableData.isError || ownerData.isError) return <Error router={router} />;

  return (
    <MainWrapper headTitle="Poultry Users" pageTitle="Poultry Users">
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
        addNewButtonTitle="Add New Poultry"
        onClickAddNew={() => router.push("/master/user/poultry/create")}
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
                href={"/master/user/poultry/edit/" + encodeString(record.id)}
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

export default Poultry;
