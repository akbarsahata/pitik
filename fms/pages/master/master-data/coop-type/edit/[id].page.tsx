import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import WarningIcon from "@icons/WarningIcon.svg";
import { getCoopType, putEditCoopType } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import { TCoopTypeResponse, TGetByIdResponse } from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  setCoopTypeInitialData,
  setErrorText,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const ctId = decodeString(router.query.id as string);
  const coopTypeData: UseQueryResult<
    { data: TGetByIdResponse<TCoopTypeResponse> },
    AxiosError
  > = useQuery(["coopTypeData"], async () => await getCoopType(ctId), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setCoopTypeInitialData({
        dispatch,
        data: data.data,
      });
    },
  });

  const editCoopType = useMutation(
    ["editCoopType"],
    async () =>
      await putEditCoopType(
        {
          coopTypeCode: state.coopTypeCode,
          coopTypeName: state.coopTypeName,
          remarks: state.remarks,
          status: state.status ? state.status.value : true,
        },
        ctId
      ),
    {
      onError: (error: AxiosError) => {
        console.log(error.response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  if (
    coopTypeData.isLoading ||
    coopTypeData.isFetching ||
    editCoopType.isSuccess
  )
    return <Loading />;
  if (coopTypeData.isError) return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Coop Type"
      pageTitle={"Edit Coop Type - " + state.oldName}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="Coop Type Code *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.COOP_TYPE_CODE
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a valid coop type code!"
                value={state.coopTypeCode}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_COOP_TYPE_CODE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="Coop type Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.COOP_TYPE_NAME
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a valid coop type name!"
                value={state.coopTypeName}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_COOP_TYPE_NAME,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
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
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="w-full h-full">
            <Input
              label="Remarks"
              type="textarea"
              className="w-full h-full"
              value={state.remarks}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
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
          state={coopTypeData.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={coopTypeData.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            editCoopType.mutate();
          }}
          title="Edit Coop"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
