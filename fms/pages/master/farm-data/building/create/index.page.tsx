import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import WarningIcon from "@icons/WarningIcon.svg";
import { getBuildingTypes, getFarms, postCreateBuilding } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingTypeResponse,
  TFarmResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./create.constants";
import { checkRequired, setErrorText } from "./create.functions";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item: TFarmResponse) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

  let buildingTypeOptions: IDropdownItem<TBuildingTypeResponse>[] = [];
  state.buildingTypeData.map((item: TBuildingTypeResponse) =>
    buildingTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
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

  const buildingTypeData: UseQueryResult<
    { data: TGetManyResponse<TBuildingTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["buildingTypeData"],
    async () =>
      await getBuildingTypes({
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
        const buildingTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING_TYPE_DATA,
          payload: buildingTypeList,
        });
      },
    }
  );

  const createBuilding = useMutation(
    ["createBuilding"],
    async () =>
      await postCreateBuilding({
        farmId: state.farm ? state.farm.value.id : "",
        name: state.buildingName,
        buildingTypeId: state.buildingType ? state.buildingType.value.id : "",
        status: state.status ? state.status.value : true,
        length: state.lengthData || 0,
        width: state.width || 0,
        height: state.height || 0,
      }),
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

  if (createBuilding.isLoading || createBuilding.isSuccess) return <Loading />;
  if (buildingTypeData.isError || farmData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Create New Building" pageTitle="New Building">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex-1 w-full">
            <Dropdown
              label="Farm *"
              value={state.farm}
              state={state.errorType === ERROR_TYPE.FARM ? "error" : "active"}
              errorMessage="Please select the farm!"
              options={farmOptions}
              isSearchable={true}
              onChange={(item: IDropdownItem<TFarmResponse>) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_FARM,
                  payload: item,
                });
              }}
            />
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="Building Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.BUILDING_NAME
                    ? "error"
                    : "active"
                }
                errorMessage="Please input a building name!"
                value={state.buildingName}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_BUILDING_NAME,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Building Type *"
                value={state.buildingType}
                state={
                  state.errorType === ERROR_TYPE.BUILDING_TYPE
                    ? "error"
                    : "active"
                }
                errorMessage="Please select a building type!"
                options={buildingTypeOptions}
                isSearchable={true}
                onChange={(item: IDropdownItem<TBuildingTypeResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_BUILDING_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col xl:flex-row items-start justify-start space-y-4 xl:space-y-0 space-x-0 xl:space-x-4">
            <div className="flex-1 w-full">
              <Input
                type="number"
                min="1"
                label="Height (m) *"
                className="w-full"
                value={state.height}
                state={
                  state.errorType === ERROR_TYPE.HEIGHT ? "error" : "active"
                }
                errorMessage="Please set a height (min: 1)!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_HEIGHT,
                    payload: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                type="number"
                min="1"
                label="Length (m) *"
                className="w-full"
                value={state.lengthData}
                state={
                  state.errorType === ERROR_TYPE.LENGTH_DATA
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a length (min: 1)!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_LENGTH_DATA,
                    payload: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                type="number"
                min="1"
                label="Width (m) *"
                className="w-full"
                value={state.width}
                state={
                  state.errorType === ERROR_TYPE.WIDTH ? "error" : "active"
                }
                errorMessage="Please set a width (min: 1)!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_WIDTH,
                    payload: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col xl:flex-row items-start justify-start space-y-4 xl:space-y-0 space-x-0 xl:space-x-4">
            <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
              <div className="w-full">
                <Dropdown
                  label="Status *"
                  state={
                    state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                  }
                  errorMessage="Please select a status!"
                  value={state.status}
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
          state={createBuilding.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={createBuilding.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            createBuilding.mutate();
          }}
          title="Create Building"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
