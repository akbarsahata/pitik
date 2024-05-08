import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import FileListIcon from "@icons/FileListIcon.svg";
import FileAddLineIcon from "@icons/FileAddLineIcon.svg";
import { getBranches, getContracts, getContractTypes } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TContractResponse,
  TContractTypeResponse,
  TGetManyResponse,
} from "@type/response.type";
import { Menu } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./contract.columns";
import { ACTION_TYPE, search, store } from "./contract.constants";
import { reducer } from "./contract.reducer";
import AdvanceSearch from "./contract.search";

const Contract: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TContractResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getContracts({
        page: state.tablePage,
        limit: 10,
        refContractTypeId:
          state.search.contractType === null ||
          isEmptyString(state.search.contractType.value.id)
            ? undefined
            : state.search.contractType.value.id,
        branchId:
          state.search.branch === null ||
          isEmptyString(state.search.branch.value.id)
            ? undefined
            : state.search.branch.value.id,
        effectiveStartDate:
          state.search.effectiveStartDate === null ||
          isEmptyString(state.search.effectiveStartDate || "")
            ? undefined
            : state.search.effectiveStartDate,
        customize: state.search.customize
          ? state.search.customize.value
          : undefined,
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

  const contractOptionsDropdown = (
    <Menu
      items={[
        {
          label: (
            <a
              rel="noopener noreferrer"
              href="/master/contract-library/contract/create/mitra-garansi"
            >
              Mitra Garansi
            </a>
          ),
          key: "1",
        },
        {
          label: (
            <a
              rel="noopener noreferrer"
              href="/master/contract-library/contract/create/cost-plus"
            >
              Cost Plus
            </a>
          ),
          key: "2",
        },
      ]}
    />
  );

  if (tableData.isLoading || tableData.isFetching) return <Loading />;
  if (tableData.isError || contractTypeData.isError || branchData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Contract Data" pageTitle="Contract Data">
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
        addNewButtonTitle="Add New Contract"
        isButtonDropdown={true}
        dropdownContent={contractOptionsDropdown}
      />
      <Table
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 120,
            key: "action",
            render: (record: TContractResponse) => (
              <div className="flex flex-row items-center justify-start mb-2">
                <div className="w-12 pl-1 flex items-center justify-start">
                  <Button
                    type="icon-outline"
                    title="Edit"
                    size="sm"
                    icon={<FileListIcon />}
                    onClick={() =>
                      router.push({
                        pathname:
                          record.contractType.contractName === "Cost Plus"
                            ? "/master/contract-library/contract/detail/cost-plus/[id]"
                            : record.contractType.contractName ===
                                "Mitra Garansi" && record.customize === false
                            ? "/master/contract-library/contract/detail/mitra-garansi/[id]"
                            : "Mitra Garansi" && record.customize === true
                            ? "/master/contract-library/contract/customise/detail/mitra-garansi/[id]"
                            : null,
                        query: { id: encodeString(record.id) },
                      })
                    }
                  />
                </div>
                <div className="w-12 pl-1 flex items-center justify-start">
                  {record.contractType.contractName !== "Mitra Garansi" ||
                  (record.contractType.contractName === "Mitra Garansi" &&
                    record.customize) ? (
                    <div className="w-12 pl-1 flex items-center justify-start">
                      <button className="flex flex-row items-center justify-between border cursor-not-allowed bg-white border-gray-400 text-gray-400 p-2.5 rounded-lg">
                        <div className="flex-1 flex flex-row justify-start items-center">
                          <FileAddLineIcon />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="icon-outline"
                      title="Add Line"
                      size="sm"
                      icon={<FileAddLineIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/master/contract-library/contract/customise/create/mitra-garansi/[id]",
                          query: { id: encodeString(record.id) },
                        });
                      }}
                    />
                  )}
                </div>
              </div>
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

export default Contract;
