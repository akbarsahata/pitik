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
  getCities,
  getDistricts,
  getFarms,
  getProvinces,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBranchResponse,
  TCityResponse,
  TDistrictResponse,
  TFarmResponse,
  TGetByIdResponse,
  TGetManyResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./farm.columns";
import { ACTION_TYPE, search, store } from "./farm.constants";
import { reducer } from "./farm.reducer";
import AdvanceSearch from "./farm.search";

const Farm: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TFarmResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getFarms({
        page: state.tablePage,
        limit: 10,
        userOwnerId:
          state.search.userOwner === null ||
          isEmptyString(state.search.userOwner.value.id)
            ? undefined
            : state.search.userOwner.value.id,
        farmCode: isEmptyString(state.search.farmCode || "")
          ? undefined
          : state.search.farmCode,
        branchId:
          state.search.branch === null ||
          isEmptyString(state.search.branch.value.id)
            ? undefined
            : state.search.branch.value.id,
        farmName: isEmptyString(state.search.farmName || "")
          ? undefined
          : state.search.farmName,
        provinceId:
          state.search.province === null || state.search.province.value.id === 0
            ? undefined
            : state.search.province.value.id.toString(),
        cityId:
          state.search.city === null || state.search.city.value.id === 0
            ? undefined
            : state.search.city.value.id.toString(),
        districtId:
          state.search.district === null || state.search.district.value.id === 0
            ? undefined
            : state.search.district.value.id.toString(),
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
    { data: TGetByIdResponse<TUserResponse[]> },
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

  const provinceData: UseQueryResult<
    { data: TGetManyResponse<{ data: TProvinceResponse[] }> },
    AxiosError
  > = useQuery(
    ["provinceData"],
    async () =>
      await getProvinces({
        name: undefined,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const provinceList = data.data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_PROVINCE_DATA,
          payload: provinceList,
        });
      },
    }
  );

  const cityData: UseQueryResult<
    { data: TGetManyResponse<{ data: TCityResponse[] }> },
    AxiosError
  > = useQuery(
    ["cityData", state.inputSearch.province],
    async () =>
      await getCities({
        provinceId: state.inputSearch.province?.value.id as number,
      }),
    {
      enabled: !!state.inputSearch.province,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const cityList = data.data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CITY_DATA,
          payload: cityList,
        });
      },
    }
  );

  const districtData: UseQueryResult<
    { data: TGetManyResponse<{ data: TDistrictResponse[] }> },
    AxiosError
  > = useQuery(
    ["districtData", state.inputSearch.city],
    async () =>
      await getDistricts({
        cityId: state.inputSearch.city?.value.id as number,
      }),
    {
      enabled: !!state.inputSearch.city,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const districtList = data.data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DISTRICT_DATA,
          payload: districtList,
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

  if (tableData.isLoading || ownerData.isLoading || provinceData.isLoading)
    return <Loading />;
  if (
    tableData.isError ||
    ownerData.isError ||
    provinceData.isError ||
    cityData.isError ||
    districtData.isError ||
    branchData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Farm" pageTitle="Farm">
      <TableBar
        isResetAllButtonVisible={state.search === search ? false : true}
        onClickResetSearch={() => {
          dispatch({ type: ACTION_TYPE.RESET_SEARCH, payload: null });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_CITY_DATA,
            payload: [],
          });
          dispatch({
            type: ACTION_TYPE.SET_DISTRICT_DATA,
            payload: [],
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: true,
          })
        }
        addNewButtonTitle="Add New Farm"
        onClickAddNew={() => router.push("/master/farm-data/farm/create")}
      />
      <Table
        scrollX={3600}
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
                href={"/master/farm-data/farm/edit/" + encodeString(record.id)}
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

export default Farm;
