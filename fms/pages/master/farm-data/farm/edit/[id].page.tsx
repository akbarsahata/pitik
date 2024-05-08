import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getBranches,
  getCities,
  getDistricts,
  getFarm,
  getProvinces,
  getUsers,
  putEditFarm,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
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
import { useReducer, useState } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  setErrorText,
  setFarmInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const farmId = decodeString(router.query.id as string);
  const [useStateOwnerData, setUseStateOwnerData] = useState<TUserResponse[]>(
    []
  );

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((item: TUserResponse) =>
    ownerOptions.push({
      value: item,
      label: `(${item.userCode}) ${item.fullName}`,
    })
  );

  let provinceOptions: IDropdownItem<TProvinceResponse>[] = [];
  state.provinceData.map((item: TProvinceResponse) =>
    provinceOptions.push({
      value: item,
      label: item.provinceName,
    })
  );

  let cityOptions: IDropdownItem<TCityResponse>[] = [];
  state.cityData.map((item: TCityResponse) =>
    cityOptions.push({
      value: item,
      label: item.cityName,
    })
  );

  let districtOptions: IDropdownItem<TDistrictResponse>[] = [];
  state.districtData.map((item: TDistrictResponse) =>
    districtOptions.push({
      value: item,
      label: item.districtName,
    })
  );

  let branchOptions: IDropdownItem<TBranchResponse>[] = [];
  state.branchData.map((item: TBranchResponse) =>
    branchOptions.push({
      value: item,
      label: `(${item.code}) ${item.name}`,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  const editFarm = useMutation(
    ["editFarm"],
    async () =>
      await putEditFarm(
        {
          userOwnerId: state.userOwner ? state.userOwner.value.id : "",
          farmCode: state.farmCode,
          farmName: state.farmName,
          branchId: state.branch ? state.branch.value.id : "",
          provinceId: state.province ? state.province.value.id : 0,
          cityId: state.city ? state.city.value.id : 0,
          districtId: state.district ? state.district.value.id : 0,
          zipCode: state.zipCode,
          addressName: state.addressName,
          address1: state.address1,
          address2: state.address2,
          latitude: state.latitude,
          longitude: state.longitude,
          remarks: state.remarks || "",
          status: state.status ? state.status.value : true,
        },
        farmId
      ),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
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
        setUseStateOwnerData(ownerList);
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

  const provinceData: UseQueryResult<
    { data: TGetManyResponse<{ data: TProvinceResponse[] }> },
    AxiosError
  > = useQuery(["provinceData"], async () => await getProvinces({}), {
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
  });

  const cityData: UseQueryResult<
    { data: TGetManyResponse<{ data: TCityResponse[] }> },
    AxiosError
  > = useQuery(
    ["cityData", state.province],
    async () =>
      await getCities({
        provinceId: state.province?.value.id as number,
      }),
    {
      enabled: !!state.province,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const cityList = data.data.data || [];
        if (state.temp.cityId) {
          const city =
            cityList[
              cityList.findIndex((item) => item.id === state.temp.cityId)
            ];
          dispatch({
            type: ACTION_TYPE.SET_CITY,
            payload: city
              ? {
                  value: city,
                  label: city?.cityName,
                }
              : null,
          });
        }
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
    ["districtData", state.city],
    async () =>
      await getDistricts({
        cityId: state.city?.value.id as number,
      }),
    {
      enabled: !!state.city,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const districtList = data.data.data || [];
        if (state.temp.districtId) {
          const district =
            districtList[
              districtList.findIndex(
                (item) => item.id === state.temp.districtId
              )
            ];
          dispatch({
            type: ACTION_TYPE.SET_DISTRICT,
            payload: district
              ? {
                  value: district,
                  label: district?.districtName,
                }
              : null,
          });
        }
        dispatch({
          type: ACTION_TYPE.SET_DISTRICT_DATA,
          payload: districtList,
        });
      },
    }
  );

  const farmData: UseQueryResult<
    { data: TGetByIdResponse<TFarmResponse> },
    AxiosError
  > = useQuery(["farmData"], async () => await getFarm(farmId), {
    refetchOnWindowFocus: false,
    enabled: !!useStateOwnerData.length || !!state.branchData.length,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setFarmInitialData({
        dispatch,
        data: data.data,
        state,
        ownerData: useStateOwnerData,
      });
    },
  });

  if (
    ownerData.isLoading ||
    farmData.isLoading ||
    farmData.isFetching ||
    editFarm.isSuccess ||
    provinceData.isLoading ||
    branchData.isLoading ||
    branchData.isFetching
  )
    return <Loading />;

  if (
    farmData.isError ||
    ownerData.isError ||
    provinceData.isError ||
    cityData.isError ||
    districtData.isError ||
    branchData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Farm"
      pageTitle={`Edit Farm - ${state.oldName}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Farm Details</p>
            {/* Branch Name */}
            <div className="flex-1 w-full">
              <Dropdown
                label="Branch Name *"
                state={
                  state.errorType === ERROR_TYPE.BRANCH ? "error" : "active"
                }
                errorMessage="Please select the branch!"
                value={state.branch}
                options={branchOptions}
                isSearchable={true}
                onChange={(item: IDropdownItem<TBranchResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_BRANCH,
                    payload: item,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                }}
              />
            </div>
            {/* Owner & Farm Code */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Owner */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Owner *"
                  value={state.userOwner}
                  state={
                    state.errorType === ERROR_TYPE.USER_OWNER
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please select the farm's owner!"
                  options={ownerOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TUserResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_USER_OWNER,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Farm Code */}
              <div className="flex-1 w-full">
                <Input
                  label="Farm Code *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.FARM_CODE
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please input a farm code!"
                  value={state.farmCode}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_FARM_CODE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            {/* Status & Farm Name */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Status */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Status *"
                  value={state.status}
                  state={
                    state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                  }
                  errorMessage="Please select the farm's status!"
                  options={statusOptions}
                  onChange={(item: IDropdownItem<boolean>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_STATUS,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Farm Name */}
              <div className="flex-1 w-full">
                <div className="flex-1 w-full">
                  <Input
                    label="Farm Name *"
                    className="w-full"
                    state={
                      state.errorType === ERROR_TYPE.FARM_NAME
                        ? "error"
                        : "active"
                    }
                    errorMessage="Please input a farm name!"
                    value={state.farmName}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_FARM_NAME,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-6">
            <p className="font-semibold text-md">Area Details</p>
            {/* Province & City */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* Province */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Province *"
                  value={state.province}
                  state={
                    state.errorType === ERROR_TYPE.PROVINCE ? "error" : "active"
                  }
                  errorMessage="Please select the farm's province!"
                  options={provinceOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TProvinceResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_PROVINCE,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CITY,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DISTRICT,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CITY_DATA,
                      payload: [],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DISTRICT_DATA,
                      payload: [],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_TEMP,
                      payload: {
                        cityId: undefined,
                        districtId: undefined,
                      },
                    });
                  }}
                />
              </div>
              {/* City */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="City *"
                  value={state.city}
                  state={
                    state.errorType === ERROR_TYPE.CITY ? "error" : "active"
                  }
                  errorMessage="Please select the farm's city!"
                  options={cityOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TCityResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CITY,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DISTRICT,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DISTRICT_DATA,
                      payload: [],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_TEMP,
                      payload: {
                        cityId: undefined,
                        districtId: undefined,
                      },
                    });
                  }}
                />
              </div>
            </div>
            {/* District & Postal Code */}
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              {/* District */}
              <div className="flex-1 w-full">
                <Dropdown
                  label="District *"
                  value={state.district}
                  state={
                    state.errorType === ERROR_TYPE.DISTRICT ? "error" : "active"
                  }
                  errorMessage="Please select the farm's district!"
                  options={districtOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TDistrictResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DISTRICT,
                      payload: item,
                    });
                  }}
                />
              </div>
              {/* Postal Code */}
              <div className="flex-1 w-full">
                <Input
                  label="Postal Code *"
                  className="w-full"
                  type="number"
                  state={
                    state.errorType === ERROR_TYPE.ZIP_CODE ? "error" : "active"
                  }
                  errorMessage="Please input a postal code!"
                  value={state.zipCode}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ZIP_CODE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <p className="font-semibold text-md">Address Details</p>
          {/* Address Name */}
          <div className="w-full">
            <Input
              label="Address Name *"
              className="w-full"
              state={
                state.errorType === ERROR_TYPE.ADDRESS_NAME ? "error" : "active"
              }
              errorMessage="Please input an address name (max. 50)!"
              value={state.addressName}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_ADDRESS_NAME,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          {/* Address 1 & Address 2 */}
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            {/* Address 1 */}
            <div className="flex-1 w-full">
              <Input
                label="Address 1 *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.ADDRESS1 ? "error" : "active"
                }
                errorMessage="Please input an address!"
                value={state.address1}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ADDRESS1,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            {/* Address 2 */}
            <div className="flex-1 w-full">
              <Input
                label="Address 2"
                className="w-full"
                value={state.address2}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ADDRESS2,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          {/* Latitude & Longitude */}
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            {/* Latitude */}
            <div className="flex-1 w-full">
              <Input
                label="Latitude *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.LATITUDE ? "error" : "active"
                }
                errorMessage="Please input the latitude data!"
                value={state.latitude}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_LATITUDE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            {/* Longitude */}
            <div className="flex-1 w-full">
              <Input
                label="Longitude *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.LONGITUDE ? "error" : "active"
                }
                errorMessage="Please input the longitude data!"
                value={state.longitude}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_LONGITUDE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          {/* Remarks */}
          <div className="w-full h-full">
            <Input
              label="Remarks"
              type="textarea"
              className="w-full h-full"
              value={state.remarks}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_REMARKS,
                  payload: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={`${
          state.errorType === ERROR_TYPE.GENERAL ? "flex" : "hidden"
        } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded mt-4`}
      >
        <div className="mr-2 text-red-500 text-xl">
          <WarningIcon />
        </div>
        <p className="text-red-500">Failed: {state.errorText}</p>
      </div>

      <div
        className={`flex flex-row items-start justify-end mb-6 ${
          state.errorType === ERROR_TYPE.GENERAL ? "mt-4" : "mt-12"
        } space-x-3`}
      >
        <Button
          size="xs"
          state={editFarm.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={editFarm.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            editFarm.mutate();
          }}
          title="Edit Farm"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
