import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import { getRoles, postCreateUser } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { getRawFormatPhone } from "@services/utils/phone";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import { TGetManyResponse, TRoleResponse } from "@type/response.type";
import { AxiosError } from "axios";
import { AsYouType } from "libphonenumber-js";
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

  let userStatusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((status: boolean) => {
    userStatusOptions.push({
      label: status ? "Active" : "Inactive",
      value: status,
    });
  });

  const roleData: UseQueryResult<
    { data: TGetManyResponse<TRoleResponse[]> },
    AxiosError
  > = useQuery(["roleData"], async () => await getRoles({ limit: 50 }), {
    refetchOnWindowFocus: false,
    onError: (error: AxiosError) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const roleDataList = data.data || [];
      const owner = roleDataList.filter(
        (data) => data.name === USER_TYPE.OWN.full
      );
      dispatch({
        type: ACTION_TYPE.SET_ROLE,
        payload: owner.length
          ? {
              label: owner[0].name.toUpperCase(),
              value: owner[0],
            }
          : null,
      });
    },
  });

  const createUser = useMutation(
    ["userData"],
    async () =>
      await postCreateUser({
        userType: USER_TYPE.OWN.full,
        userCode: state.userCode,
        fullName: state.fullName,
        email: isEmptyString(state.email) ? "" : state.email,
        phoneNumber: getRawFormatPhone(state.phoneNumber),
        waNumber: getRawFormatPhone(state.waNumber),
        password: state.password,
        status: state.status ? state.status.value : true,
        roleId: state.role?.value.id,
      }),
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

  if (createUser.isLoading || createUser.isSuccess) return <Loading />;
  if (roleData.isError) return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Create New Owner"
      pageTitle="New Owner Registration"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="User Code *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.USER_CODE ? "error" : "active"
                }
                errorMessage="Please set a valid user code!"
                value={state.userCode}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_USER_CODE,
                    payload: e.target.value,
                  });
                }}
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
          state={createUser.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={createUser.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            createUser.mutate();
          }}
          title="Create Owner"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
