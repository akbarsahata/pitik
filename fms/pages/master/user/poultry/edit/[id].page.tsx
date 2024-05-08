import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import { getUser, getUsers, putEditUser } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { getRawFormatPhone } from "@services/utils/phone";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TGetByIdResponse,
  TGetManyResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { AsYouType } from "libphonenumber-js";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, ROLE_TYPES, store } from "./edit.constants";
import {
  checkRequired,
  setErrorText,
  setPoultryInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const userId = decodeString(router.query.id as string);

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((status: boolean) => {
    statusOptions.push({
      label: status ? "Active" : "Inactive",
      value: status,
    });
  });

  let userTypeOptions: IDropdownItem<string>[] = [];
  ROLE_TYPES.map((item) =>
    userTypeOptions.push({
      value: item,
      label: item.toUpperCase(),
    })
  );

  let ownerOptions: IDropdownItem<TUserResponse>[] = [];
  state.ownerData.map((owner: TUserResponse) => {
    ownerOptions.push({
      label: `(${owner.userCode}) ${owner.fullName}`,
      value: owner,
    });
  });

  const poultryData: UseQueryResult<
    { data: TGetByIdResponse<TUserResponse> },
    AxiosError
  > = useQuery(["poultryData"], async () => await getUser(userId), {
    refetchOnWindowFocus: false,
    enabled: !!state.ownerData.length,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setPoultryInitialData({
        dispatch,
        data: data.data,
        state,
      });
    },
  });

  const editPoultry = useMutation(
    ["userData"],
    async () =>
      await putEditUser(
        {
          userType: state.userType?.value || "",
          userCode: state.userCode,
          fullName: state.fullName,
          email: state.email,
          phoneNumber: getRawFormatPhone(state.phoneNumber),
          waNumber: getRawFormatPhone(state.waNumber),
          status: state.status ? state.status.value : true,
          ownerId: state.owner?.value.id,
          password: state.password,
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

  const ownerData: UseQueryResult<
    { data: TGetManyResponse<TUserResponse[]> },
    AxiosError
  > = useQuery(
    ["ownerData"],
    async () =>
      await getUsers({
        page: 1,
        limit: 0,
        userType: USER_TYPE.OWN.full,
        status: true,
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

  if (
    poultryData.isLoading ||
    poultryData.isFetching ||
    ownerData.isLoading ||
    ownerData.isFetching ||
    editPoultry.isLoading ||
    editPoultry.isSuccess
  )
    return <Loading />;
  if (poultryData.isError || ownerData.isLoading)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Poultry"
      pageTitle={"Edit Poultry - " + state.oldName}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="w-full">
            <Dropdown
              label="Owner *"
              state={state.errorType === ERROR_TYPE.OWNER ? "error" : "active"}
              isSearchable={true}
              errorMessage="Please select an owner!"
              value={state.owner}
              options={ownerOptions}
              onChange={(item: IDropdownItem<TUserResponse>) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_OWNER,
                  payload: item,
                });
              }}
            />
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Dropdown
                label="Role *"
                state={
                  state.errorType === ERROR_TYPE.USER_TYPE ? "error" : "active"
                }
                errorMessage="Please select a role!"
                value={state.userType}
                options={userTypeOptions}
                onChange={(item: IDropdownItem<string>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_USER_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="User Code *"
                className="w-full"
                state="disabled"
                value={state.userCode}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
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
            <div className="flex-1 w-full">
              <Input
                label="Email"
                type="email"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.EMAIL ? "error" : "active"
                }
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
          state={editPoultry.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={editPoultry.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            editPoultry.mutate();
          }}
          title="Edit Poultry"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
