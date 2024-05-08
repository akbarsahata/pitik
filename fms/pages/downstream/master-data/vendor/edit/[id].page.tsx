import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { PO_PRICE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getCities,
  getDistricts,
  getProductCategories,
  getProvinces,
  getVendor,
  putEditVendor,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TCityResponse,
  TDistrictResponse,
  TGetByIdResponse,
  TGetManyResponse,
  TProductItemResponse,
  TProvinceResponse,
  TVendorResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { UseQueryResult, useMutation, useQuery } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  setErrorText,
  setVendorInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const currentVendorId = decodeString(router.query.id as string);

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

  let purchasableProductsOptions: IDropdownItem<TProductItemResponse>[] = [];
  state.purchasableProductsData.map((item: TProductItemResponse) =>
    purchasableProductsOptions.push({
      value: item,
      label: item.name,
    })
  );

  let priceBasisOptions: IDropdownItem<string>[] = [];
  PO_PRICE.map((item) =>
    priceBasisOptions.push({
      value: item,
      label: item,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

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

  const purchasableProductsData: UseQueryResult<
    { data: TGetManyResponse<TProductItemResponse[]> },
    AxiosError
  > = useQuery(
    ["purchasableProductsData"],
    async () => await getProductCategories(),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const purchasableProductsList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_PURCHASABLE_PRODUCTS_DATA,
          payload: purchasableProductsList,
        });
      },
    }
  );

  const vendorData: UseQueryResult<
    { data: TGetByIdResponse<TVendorResponse> },
    AxiosError
  > = useQuery(["vendorData"], async () => await getVendor(currentVendorId), {
    refetchOnWindowFocus: false,
    enabled:
      !!state.provinceData.length || !!state.purchasableProductsData.length,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      setVendorInitialData({
        dispatch,
        data: data.data,
        state,
      });
    },
  });

  const editVendor = useMutation(
    ["editVendor"],
    async () => {
      await putEditVendor(
        {
          vendorName: state.vendorName,
          provinceId: state.province?.value.id as number,
          cityId: state.city?.value.id as number,
          districtId: state.district?.value.id as number,
          plusCode: state.plusCode,
          purchasableProducts: state.purchasableProducts
            ? state.purchasableProducts?.map((item) => item.value.id)
            : [],
          priceBasis: state.priceBasis ? state.priceBasis.value : "",
          status: state.status ? state.status?.value : true,
        },
        currentVendorId
      );
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.replace("/downstream/master-data/vendor");
      },
    }
  );

  if (
    editVendor.isLoading ||
    editVendor.isSuccess ||
    vendorData.isLoading ||
    provinceData.isLoading
  )
    return <Loading />;

  if (
    provinceData.isError ||
    cityData.isError ||
    districtData.isError ||
    purchasableProductsData.isError ||
    vendorData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Vendor"
      pageTitle={`Edit Vendor - ${state.oldName}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-col w-full space-y-6">
            {/* Vendor Name */}
            <div className="w-full">
              <Input
                label="Vendor Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.VENDOR_NAME
                    ? "error"
                    : "active"
                }
                errorMessage="Please input a vendor name!"
                value={state.vendorName}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_VENDOR_NAME,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
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
                  }}
                />
              </div>
            </div>
            {/* District & Plus Code */}
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
              {/* Plus Code */}
              <div className="flex-1 w-full">
                <Input
                  label="Google Maps Plus Code *"
                  className="w-full"
                  state={
                    state.errorType === ERROR_TYPE.PLUS_CODE
                      ? "error"
                      : "active"
                  }
                  errorMessage="Please input a google maps plus code!"
                  value={state.plusCode}
                  onChange={(e) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_PLUS_CODE,
                      payload: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          {/* SKU Category */}
          <div className="w-full">
            <Dropdown
              label="SKU Category *"
              value={state.purchasableProducts}
              options={purchasableProductsOptions}
              isMulti={true}
              state={
                state.errorType === ERROR_TYPE.PURCHASABLE_PRODUCTS
                  ? "error"
                  : "active"
              }
              errorMessage="Please select the vendor's purchasable products!"
              onChange={(item: IDropdownItem<TProductItemResponse>[]) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_PURCHASABLE_PRODUCTS,
                  payload: item,
                });
              }}
            />
          </div>
          {/* PO Price */}
          <div className="w-full">
            <Dropdown
              label="PO Price *"
              value={state.priceBasis}
              options={priceBasisOptions}
              state={
                state.errorType === ERROR_TYPE.PRICE_BASIS ? "error" : "active"
              }
              errorMessage="Please select the vendor's price basis!"
              onChange={(item: IDropdownItem<string>) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_PRICE_BASIS,
                  payload: item,
                });
              }}
            />
          </div>
          {/* Status */}
          <div className="w-full">
            <Dropdown
              label="Status *"
              value={state.status}
              state={state.errorType === ERROR_TYPE.STATUS ? "error" : "active"}
              errorMessage="Please select the vendor's status!"
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
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={editVendor.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            dispatch({
              type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
              payload: true,
            });
          }}
          title="Edit Vendor"
        />
      </div>

      <Modal
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
            payload: false,
          });
        }}
        footer={
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              type="outline"
              title="Cancel"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });
              }}
            />
            <Button
              title="Yes"
              size="xs"
              onClick={() => {
                dispatch({
                  type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE,
                  payload: false,
                });

                editVendor.mutate();
              }}
            />
          </div>
        }
        title="Confirmation Edit Vendor"
        isVisible={state.confirmationModalVisible}
        content="Are you sure you want to edit this vendor?"
      />
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
