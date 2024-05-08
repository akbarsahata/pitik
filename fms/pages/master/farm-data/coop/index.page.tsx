import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import EditIcon from "@icons/EditIcon.svg";
import {
  getBranches,
  getContractTypes,
  getCoops,
  getCoopTypes,
  getFarms,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TContractTypeResponse,
  TCoopResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TFileUploadResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./coop.columns";
import { ACTION_TYPE, search, store } from "./coop.constants";
import { PhotoModal } from "./coop.photo";
import { reducer } from "./coop.reducer";
import AdvanceSearch from "./coop.search";

const Variable: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getCoops({
        page: state.tablePage,
        limit: 10,
        coopCode: isEmptyString(state.search.coopCode || "")
          ? undefined
          : state.search.coopCode,
        coopName: isEmptyString(state.search.coopName || "")
          ? undefined
          : state.search.coopName,
        coopTypeId:
          state.search.coopType === null ||
          isEmptyString(state.search.coopType.value.id)
            ? undefined
            : state.search.coopType.value.id,
        farmId:
          state.search.farm === null ||
          isEmptyString(state.search.farm.value.id)
            ? undefined
            : state.search.farm.value.id,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
        contractTypeId:
          state.search.contractType === null ||
          isEmptyString(state.search.contractType.value.id)
            ? undefined
            : state.search.contractType.value.id,
        branchId:
          state.search.branch === null ||
          isEmptyString(state.search.branch.value.id)
            ? undefined
            : state.search.branch.value.id,
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

  const contractTypeData: UseQueryResult<
    { data: TGetManyResponse<TContractTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["contractTypeData"],
    async () => await getContractTypes({ page: 1, limit: 0 }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const contractTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CONTRACT_TYPE_DATA,
          payload: contractTypeList,
        });
      },
    }
  );

  if (
    tableData.isLoading ||
    coopTypeData.isLoading ||
    farmData.isLoading ||
    ownerData.isLoading
  )
    return <Loading />;
  if (
    tableData.isError ||
    coopTypeData.isError ||
    farmData.isError ||
    ownerData.isError ||
    branchData.isError ||
    contractTypeData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Coop" pageTitle="Coop">
      <PhotoModal
        photoData={state.photoData}
        isVisible={state.photoModalVisible}
        onClose={() => {
          dispatch({
            type: ACTION_TYPE.SET_PHOTO_MODAL_VISIBLE,
            payload: false,
          });
        }}
      />
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
        addNewButtonTitle="Add New Coop"
        onClickAddNew={() => router.push("/master/farm-data/coop/create")}
      />
      <Table
        tableData={tableData.data?.data.data}
        scrollX={4000}
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
                href={"/master/farm-data/coop/edit/" + encodeString(record.id)}
              />
            ),
          },
          ...columns.slice(0, 18),
          {
            title: "Image",
            dataIndex: "coopImages",
            key: ["coopImages", "filename"],
            render: (record: TFileUploadResponse[]) =>
              record.length > 0 ? (
                <Button
                  title={`Photos ${record.length}`}
                  size="xs"
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPE.SET_PHOTO_DATA,
                      payload: record,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_PHOTO_MODAL_VISIBLE,
                      payload: true,
                    });
                  }}
                />
              ) : (
                "-"
              ),
          },
          ...columns.slice(19),
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

export default Variable;
