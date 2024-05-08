import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import FileListIcon from "@icons/FileListIcon.svg";
import {
  getAreas,
  getCities,
  getCoops,
  getDailyPerformances,
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
  TCoopResponse,
  TDailyPerformanceTableResponse,
  TDistrictResponse,
  TFarmResponse,
  TGetManyResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./daily-performance.columns";
import { ACTION_TYPE, search, store } from "./daily-performance.constants";
import { reducer } from "./daily-performance.reducer";
import AdvanceSearch from "./daily-performance.search";

const DailyPerformance: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TDailyPerformanceTableResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getDailyPerformances({
        page: state.tablePage,
        limit: 10,
        farmingStatus:
          state.search.farmingStatus === null ||
          isEmptyString(state.search.farmingStatus.value)
            ? undefined
            : state.search.farmingStatus.value,
        farmingCycleCode: isEmptyString(state.search.farmingCycleCode || "")
          ? undefined
          : state.search.farmingCycleCode,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
        pplId:
          state.search.ppl === null || isEmptyString(state.search.ppl.value.id)
            ? undefined
            : state.search.ppl.value.id,
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
        provinceId:
          state.search.province === null || state.search.province.value.id === 0
            ? undefined
            : state.search.province.value.id,
        cityId:
          state.search.city === null || state.search.city.value.id === 0
            ? undefined
            : state.search.city.value.id,
        districtId:
          state.search.district === null || state.search.district.value.id === 0
            ? undefined
            : state.search.district.value.id,
        branchId:
          state.search.branch === null ||
          isEmptyString(state.search.branch.value.id)
            ? undefined
            : state.search.branch.value.id,
        summary:
          state.search.summary === null ||
          isEmptyString(state.search.summary.value)
            ? undefined
            : state.search.summary.value,
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

  const userData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["userData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        status: true,
        userTypes: [USER_TYPE.OWN.full, USER_TYPE.PPL.full].join(","),
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const userList = data.data || [];
        const ownerList = userList.filter(
          (user) => user.userType === USER_TYPE.OWN.full
        );
        dispatch({
          type: ACTION_TYPE.SET_OWNER_DATA,
          payload: ownerList,
        });
        const pplList = userList.filter(
          (user) => user.userType === USER_TYPE.PPL.full
        );
        dispatch({
          type: ACTION_TYPE.SET_PPL_DATA,
          payload: pplList,
        });
      },
    }
  );

  const provinceData: UseQueryResult<
    { data: { data: TGetManyResponse<TProvinceResponse[]> } },
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
    { data: { data: TGetManyResponse<TCityResponse[]> } },
    AxiosError
  > = useQuery(
    ["cityData", state.inputSearch.province],
    async () =>
      await getCities({
        provinceId: state.inputSearch.province?.value.id || 0,
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
    { data: { data: TGetManyResponse<TDistrictResponse[]> } },
    AxiosError
  > = useQuery(
    ["districtData", state.inputSearch.city],
    async () =>
      await getDistricts({
        cityId: state.inputSearch.city?.value.id || 0,
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
  > = useQuery(["branchData"], async () => await getAreas(), {
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
    userData.isError ||
    provinceData.isError ||
    cityData.isError ||
    districtData.isError ||
    farmData.isError ||
    coopData.isError ||
    branchData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Daily Performance" pageTitle="Daily Performance">
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
        newButtonVisible={false}
      />
      <Table
        scrollX={1200}
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 68,
            key: "action",
            render: (record: { id: string }) => (
              <Button
                isAnchor={true}
                href={
                  "/report/daily-performance/details/" + encodeString(record.id)
                }
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

export default DailyPerformance;
