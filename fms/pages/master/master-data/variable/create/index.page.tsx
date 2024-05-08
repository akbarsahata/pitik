import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import WarningIcon from "@icons/WarningIcon.svg";
import { postCreateVariable } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { IDropdownItem } from "@type/dropdown.interface";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation } from "react-query";
import { ACTION_TYPE, ERROR_TYPE, store } from "./create.constants";
import { checkRequired, setErrorText } from "./create.functions";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
  );

  const createVariable = useMutation(
    ["createVariable"],
    async () =>
      await postCreateVariable({
        variableCode: state.variableCode,
        variableName: state.variableName,
        variableUOM: state.variableUOM,
        variableType: state.variableType,
        digitComa: state.digitComa,
        remarks: state.remarks,
        status: state.status ? state.status.value : true,
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

  if (createVariable.isLoading || createVariable.isSuccess) return <Loading />;

  return (
    <MainWrapper headTitle="Create New Variable" pageTitle="New Variable">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="Variable Code *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.VARIABLE_CODE
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a valid variable code!"
                value={state.variableCode}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_VARIABLE_CODE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Variable Name *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.VARIABLE_NAME
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a valid variable name!"
                value={state.variableName}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_VARIABLE_NAME,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="Variable UOM *"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.VARIABLE_UOM
                    ? "error"
                    : "active"
                }
                errorMessage="Please set a valid variable UOM!"
                value={state.variableUOM}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_VARIABLE_UOM,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Variable Type *"
                className="w-full"
                state="disabled"
                errorMessage="Please set a valid variable type!"
                value="Simple"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_VARIABLE_TYPE,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex-1 w-full">
              <Input
                label="Digit Coma"
                type="number"
                min="0"
                className="w-full"
                state={
                  state.errorType === ERROR_TYPE.DIGIT_COMA ? "error" : "active"
                }
                errorMessage="Please set a valid digit coma!"
                value={state.digitComa}
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_DIGIT_COMA,
                    payload: parseInt(e.target.value),
                  });
                }}
              />
            </div>
            <div className="flex-1 w-full">
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
          state={createVariable.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={createVariable.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            createVariable.mutate();
          }}
          title="Create Variable"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
