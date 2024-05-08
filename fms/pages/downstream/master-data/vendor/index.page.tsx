import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import EditIcon from "@icons/EditIcon.svg";
import {
  getCities,
  getDistricts,
  getProvinces,
  getVendors,
} from "@services/api";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TCityResponse,
  TDistrictResponse,
  TGetManyResponse,
  TProvinceResponse,
  TVendorResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { UseQueryResult, useQuery, useQueryClient } from "react-query";
import { columns } from "./vendor.columns";
import { ACTION_TYPE, search, store } from "./vendor.constants";
import { reducer } from "./vendor.reducer";
import AdvanceSearch from "./vendor.search";

export default function Vendor() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, store);
  const router = useRouter();
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TVendorResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getVendors({
        page: state.tablePage,
        limit: 0,
        vendorName: isEmptyString(state.search.vendorName || "")
          ? undefined
          : state.search.vendorName,
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

  if (tableData.isLoading || tableData.isFetching || provinceData.isLoading)
    return <Loading />;
  if (
    tableData.isError ||
    provinceData.isError ||
    cityData.isError ||
    districtData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Vendor" pageTitle="Vendor">
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
        addNewButtonTitle="Add Vendor"
        onClickAddNew={() =>
          router.push("/downstream/master-data/vendor/create")
        }
      />
      <Table
        scrollX={800}
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
                href={
                  "/downstream/master-data/vendor/edit/" +
                  encodeString(record.id)
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
}
