import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import { getParents, getRoles, getUser, putEditUser } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { getRawFormatPhone } from "@services/utils/phone";
import { isEmptyString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TGetByIdResponse,
  TGetManyResponse,
  TParentResponse,
  TRoleResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { AsYouType } from "libphonenumber-js";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { UseQueryResult, useMutation, useQuery } from "react-query";
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
        state,
        data: data.data,
      });
    },
  });

  const roleData: UseQueryResult<
    { data: TGetManyResponse<TRoleResponse[]> },
    AxiosError
  > = useQuery(["roleData"], async () => await getRoles({ limit: 100 }), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
    },
    onSuccess: ({ data }) => {
      const roleDataList: TRoleResponse[] = data.data || [];
      const removeCL = roleDataList.filter(
        (data) => data.name !== USER_TYPE.CL.full
      );
      const downstreamRole = removeCL.filter(
        (data) => data.roleRanks && data.roleRanks.context === "downstream"
      );
      const upstreamRole = removeCL.filter(
        (data) => data.roleRanks && data.roleRanks.context === "internal"
      );
      dispatch({
        type: ACTION_TYPE.SET_UPSTREAM_ROLE_DATA,
        payload: upstreamRole,
      });
      dispatch({
        type: ACTION_TYPE.SET_DOWNSTREAM_ROLE_DATA,
        payload: downstreamRole,
      });
    },
  });

  const parentData: UseQueryResult<
    { data: TGetManyResponse<TParentResponse[]> },
    AxiosError
  > = useQuery(
    ["parentData", state.upstreamRole],
    async () =>
      await getParents({
        limit: 999,
        rank: state.upstreamRole?.value.roleRanks.rank as number,
        lte: true,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!state.upstreamRole,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const parentDataList: TParentResponse[] = data.data || [];
        const parent =
          parentDataList[
            parentDataList.findIndex(
              (parent) => parent.id === state.temp.parentId
            )
          ];
        dispatch({
          type: ACTION_TYPE.SET_PARENT,
          payload: parent ? { label: parent.name, value: parent } : null,
        });
        dispatch({
          type: ACTION_TYPE.SET_PARENT_DATA,
          payload: parentDataList,
        });
      },
    }
  );

  const editUser = useMutation(
    ["userData"],
    async () =>
      await putEditUser(
        {
          userCode: state.userCode,
          fullName: state.fullName,
          email: state.email,
          phoneNumber: getRawFormatPhone(state.phoneNumber),
          waNumber: getRawFormatPhone(state.waNumber),
          status: state.status?.value as boolean,
          password: isEmptyString(state.password) ? undefined : state.password,
          parentId:
            state.parent && !isEmptyString(state.parent?.value.id)
              ? state.parent?.value.id
              : undefined,
          roleIds: [
            state.upstreamRole?.value.id,
            state.downstreamRole?.value.id,
          ].filter((item) => item),
        },
        userId
      ),
    {
      onError: (error: AxiosError) => {
        console.log(error.response?.data);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.replace("/master/user/internal");
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

  let upstreamRoleOptions: IDropdownItem<TRoleResponse>[] = [];
  state.upstreamRoleData.map((role: TRoleResponse) => {
    upstreamRoleOptions.push({
      label: role.name.toUpperCase(),
      value: role,
    });
  });

  let downstreamRoleOptions: IDropdownItem<TRoleResponse>[] = [];
  state.downstreamRoleData.map((role: TRoleResponse) => {
    downstreamRoleOptions.push({
      label: role.name.toUpperCase(),
      value: role,
    });
  });

  let parentOptions: IDropdownItem<TParentResponse>[] = [];
  state.parentData?.map((parent: TParentResponse) => {
    parentOptions.push({
      label: `${
        parent.role === USER_TYPE.GM.full
          ? USER_TYPE.GM.short + " - "
          : parent.role === USER_TYPE.AM.full
          ? USER_TYPE.AM.short + " - "
          : parent.role === USER_TYPE.MM.full || parent.role === "MITRA_MANAGER"
          ? USER_TYPE.MM.short + " - "
          : parent.role.toLowerCase() === USER_TYPE.PPL.full
          ? USER_TYPE.PPL.short + " - "
          : parent.role === USER_TYPE.BU.full
          ? USER_TYPE.BU.short + " - "
          : parent.role === USER_TYPE.ADM.full
          ? USER_TYPE.ADM.short + " - "
          : parent.role === USER_TYPE.KK.full ||
            parent.role === "POULTRY_LEADER"
          ? USER_TYPE.KK.short + " - "
          : parent.role === USER_TYPE.AK.full
          ? USER_TYPE.AK.short + " - "
          : parent.role === USER_TYPE.VP.full
          ? USER_TYPE.VP.short + " - "
          : parent.role === USER_TYPE.CL.full
          ? USER_TYPE.CL.full.toUpperCase() + " - "
          : parent.role + " - "
      } ${parent.name || "-"}`,
      value: parent,
    });
  });

  if (
    userData.isLoading ||
    userData.isFetching ||
    roleData.isLoading ||
    editUser.isLoading ||
    editUser.isSuccess
  )
    return <Loading />;
  if (userData.isError || roleData.isError || parentData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Internal User"
      pageTitle={"Edit Internal User - " + state.oldName}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Upstream Role"
                state={
                  state.errorType === ERROR_TYPE.USER_TYPE ? "error" : "active"
                }
                isSearchable={true}
                isLoading={roleData.isLoading ? true : false}
                errorMessage="Please select a role!"
                value={state.upstreamRole}
                options={upstreamRoleOptions}
                onChange={(item: IDropdownItem<TRoleResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_PARENT,
                    payload: null,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_UPSTREAM_ROLE,
                    payload: item,
                  });
                }}
              />
            </div>
            {(state.upstreamRole?.value.name === USER_TYPE.GM.full ||
              state.upstreamRole?.value.name === USER_TYPE.AM.full ||
              state.upstreamRole?.value.name === USER_TYPE.MM.full ||
              state.upstreamRole?.value.name === USER_TYPE.PPL.full ||
              state.upstreamRole?.value.name === USER_TYPE.BU.full) && (
              <div className="w-full">
                <Dropdown
                  label="Upstream Supervisor *"
                  state={
                    state.errorType === ERROR_TYPE.PARENT_ID
                      ? "error"
                      : "active"
                  }
                  isLoading={parentData.isLoading ? true : false}
                  isSearchable={true}
                  errorMessage="Please select a supervisor!"
                  value={state.parent}
                  options={parentOptions}
                  onChange={(item: IDropdownItem<TParentResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_PARENT,
                      payload: item,
                    });
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="User Code *"
                className="w-full"
                state="disabled"
                value={state.userCode}
              />
            </div>
            {/* {(state.role?.value.name === USER_TYPE.GM.full ||
              state.role?.value.name === USER_TYPE.AM.full ||
              state.role?.value.name === USER_TYPE.MM.full ||
              state.role?.value.name === USER_TYPE.PPL.full ||
              state.role?.value.name === USER_TYPE.BU.full) && (
              <div className="w-full">
                <Dropdown
                  label="Upstream Supervisor *"
                  state={
                    state.errorType === ERROR_TYPE.PARENT_ID
                      ? "error"
                      : "active"
                  }
                  isLoading={parentData.isLoading ? true : false}
                  isSearchable={true}
                  errorMessage="Please select a supervisor!"
                  value={state.parent}
                  options={parentOptions}
                  onChange={(item: IDropdownItem<TParentResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_PARENT,
                      payload: item,
                    });
                  }}
                />
              </div>
            )} */}
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label="User Code *"
                className="w-full"
                state="disabled"
                value={state.userCode}
              />
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
          </div>
          <div className="w-full">
            <Input
              label="Email *"
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
            {/* status */}
            <Dropdown
              label="User Status *"
              state={state.errorType === ERROR_TYPE.STATUS ? "error" : "active"}
              errorMessage="Please select user's status!"
              value={state.status}
              options={userStatusOptions}
              onChange={(item: IDropdownItem<boolean>) => {
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
          state={editUser.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={editUser.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;
            editUser.mutate();
          }}
          title="Edit User"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
