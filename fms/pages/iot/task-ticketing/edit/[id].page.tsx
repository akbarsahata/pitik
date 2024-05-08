import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import { Stepper } from "@components/atoms/Stepper";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { STATUS_IOT_TICKET } from "@constants/index";
import WarningIcon from "@icons/WarningIcon.svg";
import { getIotTicket, getUsersMe, patchIotTicket } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { formatDate } from "@services/utils/date";
import { decodeString } from "@services/utils/encode";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TGetByIdResponse,
  TIotTicketDetailsResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { TICKET_STATUS } from "../task-ticketing.constants";
import DetailsAccordion from "./edit.accordion";
import { ACTIONS, ERROR_TYPE, initialState } from "./edit.constants";
import {
  assignPerson,
  checkRequired,
  setErrorText,
  setTaskTicketingInitialData,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const iotTicketId = decodeString(router.query.id as string);

  const iotTicketData: UseQueryResult<
    { data: TGetByIdResponse<TIotTicketDetailsResponse> },
    AxiosError
  > = useQuery(["iotTicketData"], async () => await getIotTicket(iotTicketId), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error.response?.data);
      setErrorText({ dispatch, error });
    },
    onSuccess: ({ data }) => {
      setTaskTicketingInitialData({
        dispatch,
        data: data.data,
      });
    },
  });

  const editIotTicket: any = useMutation(
    ["editIotTicket"],
    async (pic: string) => {
      await patchIotTicket(
        {
          status: state.status.value,
          pic,
          notes: state.notes,
        },
        iotTicketId
      );
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.replace("/iot/task-ticketing");
      },
    }
  );

  const usersMeData: any = useMutation(
    ["usersMeData"],
    async () => await getUsersMe(),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: ({ data }: { data: TGetByIdResponse<TUserResponse> }) => {
        editIotTicket.mutate(data.data.id);
      },
    }
  );

  let statusOptions: IDropdownItem<string>[] = [];
  STATUS_IOT_TICKET.map((item: string) =>
    statusOptions.push({
      value: item,
      label: item.replace(/_/g, " "),
    })
  );

  if (
    editIotTicket.isLoading ||
    editIotTicket.isSuccess ||
    iotTicketData.isLoading ||
    usersMeData.isLoading ||
    usersMeData.isSuccess
  )
    return <Loading />;
  if (iotTicketData.isError) return <Error router={router} />;

  return (
    <MainWrapper headTitle="Ticket Details" pageTitle="Ticket Details">
      <DetailsAccordion
        data={iotTicketData.data?.data.data as TIotTicketDetailsResponse}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="flex flex-row items-end justify-end space-x-4 w-full">
              <div className="flex-1">
                <Input
                  label="PIC *"
                  className="w-full"
                  errorMessage="Please assign a PIC!"
                  value={state.pic}
                  state={
                    state.errorType === ERROR_TYPE.PIC
                      ? "disabled-error"
                      : "disabled"
                  }
                  onChange={() => {}}
                />
              </div>
              {state.pic === "Unassigned" && (
                <Button
                  title="Assign To Me"
                  className={state.errorType === ERROR_TYPE.PIC ? "mb-6" : ""}
                  size="sm"
                  onClick={() => assignPerson({ dispatch, state })}
                />
              )}
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Status *"
                errorMessage="Please select a status! (ON MAINTENANCE or OTHERS)"
                isDisabled={
                  state.status.value === TICKET_STATUS.RESOLVED ? true : false
                }
                state={
                  state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                }
                value={state.status}
                options={statusOptions}
                isOptionDisabled={(option: IDropdownItem<string>) => {
                  return (
                    option.value === TICKET_STATUS.OPEN ||
                    option.value === TICKET_STATUS.RESOLVED
                  );
                }}
                onChange={(item: IDropdownItem<string>) => {
                  dispatch({
                    type: ACTIONS.SET_ERROR_TYPE,
                    payload: { data: ERROR_TYPE.NONE },
                  });
                  dispatch({
                    type: ACTIONS.SET_STATUS,
                    payload: { data: item },
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full h-full flex-1">
              <Input
                label="Notes *"
                type="textarea"
                className="w-full h-full flex-1"
                value={state.notes}
                max={250}
                hintMessage={state.textCount + "/250"}
                state={
                  state.status.value === TICKET_STATUS.RESOLVED
                    ? "disabled"
                    : state.errorType === ERROR_TYPE.NOTES
                    ? "error"
                    : "active"
                }
                errorMessage="Please fill in the notes!"
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.SET_ERROR_TYPE,
                    payload: { data: ERROR_TYPE.NONE },
                  });
                  dispatch({
                    type: ACTIONS.SET_NOTES,
                    payload: { data: e.target.value },
                  });
                  dispatch({
                    type: ACTIONS.SET_TEXT_COUNT,
                    payload: { data: e.target.value.length },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <p className="font-semibold text-lg">Notes History</p>

          <div className="overflow-y-auto w-full h-80">
            <Stepper
              data={
                iotTicketData.data?.data.data.history
                  ? iotTicketData.data?.data.data.history.map((item) => ({
                      heading: `[${item.actionStatus}] ${item.notes}`,
                      subheading: formatDate(item.modifiedDate, true),
                    }))
                  : []
              }
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
        {state.status.value !== TICKET_STATUS.RESOLVED && (
          <Button
            size="xs"
            state={editIotTicket.isLoading ? "loading" : "active"}
            onClick={() => {
              const required = checkRequired({
                dispatch,
                state,
              });
              if (!required) return;

              usersMeData.mutate();
            }}
            title="Edit Ticket"
          />
        )}
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
