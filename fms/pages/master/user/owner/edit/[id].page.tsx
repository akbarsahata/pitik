import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import { getUser, putEditUser } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { getRawFormatPhone } from "@services/utils/phone";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TGetByIdResponse, TUserResponse } from "@type/response.type";
import { AxiosError } from "axios";
import { AsYouType } from "libphonenumber-js";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./edit.constants";
import {
  checkRequired,
  setErrorText,
  setUserInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const userId = decodeString(router.query.id as string);

  const userData: UseQueryResult<
    { data: TGetByIdResponse<TUserResponse> },
    AxiosError
  > = useQuery(["userData"], async () => await getUser(userId), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setUserInitialData({
        dispatch,
        data: data.data,
      });
    },
  });

  const editUser = useMutation(
    ["userData"],
    async () =>
      await putEditUser(
        {
          userType: USER_TYPE.OWN.full,
          userCode: state.userCode,
          fullName: state.fullName,
          email: isEmptyString(state.email) ? "" : state.email,
          phoneNumber: getRawFormatPhone(state.phoneNumber),
          waNumber: getRawFormatPhone(state.waNumber),
          password: isEmptyString(state.password) ? undefined : state.password,
          status: state.status ? state.status.value : true,
        },
        userId
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

  let userStatusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((status: boolean) => {
    userStatusOptions.push({
      label: status ? "Active" : "Inactive",
      value: status,
    });
  });

  if (
    userData.isLoading ||
    userData.isFetching ||
    editUser.isLoading ||
    editUser.isSuccess
  )
    return <Loading />;
  if (userData.isError) return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Owner"
      pageTitle={"Edit Owner - " + state.oldName}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="User Code *"
                className="w-full"
                state="disabled"
                value={state.userCode}
              />
            </div>
          </div>
          <div className="w-full">
            <Input
              label="Full Name *"
              className="w-full"
              state={
                state.errorType === ERROR_TYPE.FULL_NAME ? "error" : "active"
              }
              errorMessage="Please input a valid name!"
              value={state.fullName}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_FULL_NAME,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full">
            <Input
              label="Email"
              type="email"
              className="w-full"
              state={state.errorType === ERROR_TYPE.EMAIL ? "error" : "active"}
              errorMessage="Please input a valid email address!"
              value={state.email}
              onChange={(e) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_EMAIL,
                  payload: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="Phone Number *"
                type="phone"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.PHONE_NUMBER
                    ? "error"
                    : "active"
                }
                errorMessage="Please input a valid Indonesian phone number!"
                value={new AsYouType("ID").input(state.phoneNumber)}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_PHONE_NUMBER,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Input
                label="WhatsApp Number *"
                type="phone"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.WA_NUMBER ? "error" : "active"
                }
                errorMessage="Please input a valid Indonesian WhatsApp number!"
                value={new AsYouType("ID").input(state.waNumber)}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_WA_NUMBER,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="Password *"
                type="password"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.PASSWORD ||
                  state.errorType === ERROR_TYPE.CONFIRM_PASSWORD
                    ? "error"
                    : "active"
                }
                errorMessage={
                  state.errorType === ERROR_TYPE.CONFIRM_PASSWORD
                    ? "Password did not match"
                    : "Please input a valid password (min. 5)!"
                }
                value={state.password}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_PASSWORD,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Input
                label="Confirm Password *"
                type="password"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.PASSWORD ||
                  state.errorType === ERROR_TYPE.CONFIRM_PASSWORD
                    ? "error"
                    : "active"
                }
                errorMessage={
                  state.errorType === ERROR_TYPE.CONFIRM_PASSWORD
                    ? "Password did not match"
                    : "Please input a valid password (min. 5)!"
                }
                value={state.confirmPassword}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CONFIRM_PASSWORD,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <Dropdown
              label="User Status *"
              state={state.errorType === ERROR_TYPE.STATUS ? "error" : "active"}
              errorMessage="Please select owner's status!"
              value={state.status}
              options={userStatusOptions}
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
          state={userData.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={userData.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            editUser.mutate();
          }}
          title="Edit Owner"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
