import Button from "@components/atoms/Button/Button";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getDailyPerformanceDetails,
  getDailyPerformanceSummary,
  getFeedbrands,
  putEditDailyPerformance,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { randomHexString } from "@services/utils/string";
import {
  TDailyPerformanceDetailsResponse,
  TDailyPerformanceSummaryResponse,
  TFeedBrandResponse,
  TGetByIdResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import TableColumns from "./edit.columns";
import {
  ACTION_TYPE,
  ERROR_TYPE,
  store,
  TDailyPerformancePayload,
} from "./edit.constants";
import { setErrorText } from "./edit.functions";
import EditModal from "./edit.modal";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const farmingCycleId = decodeString(router.query.id as string);
  const [state, dispatch] = useReducer(reducer, store);

  const summaryData: UseQueryResult<
    { data: TGetByIdResponse<TDailyPerformanceSummaryResponse> },
    AxiosError
  > = useQuery(
    ["summaryData"],
    async () => await getDailyPerformanceSummary(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const summary = data.data;
        dispatch({
          type: ACTION_TYPE.SET_SUMMARY_DATA,
          payload: summary,
        });
      },
    }
  );

  const detailsData: UseQueryResult<
    { data: TGetManyResponse<TDailyPerformanceDetailsResponse[]> },
    AxiosError
  > = useQuery(
    ["detailsData"],
    async () => await getDailyPerformanceDetails(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        let uniqueData: TDailyPerformanceDetailsResponse[] = [];
        data.data.map((data: TDailyPerformanceDetailsResponse) =>
          uniqueData.push({
            id: randomHexString(),
            ...data,
            treatment: data.treatment || [],
          })
        );
        dispatch({
          type: ACTION_TYPE.SET_DETAILS_DATA,
          payload: uniqueData,
        });
      },
    }
  );

  const feedBrandsData: UseQueryResult<
    { data: TGetManyResponse<TFeedBrandResponse[]> },
    AxiosError
  > = useQuery(
    ["feedBrandsData"],
    async () =>
      await getFeedbrands({
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
        const feedbrandList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FEEDBRAND_DATA,
          payload: feedbrandList,
        });
      },
    }
  );

  const editDailyPerformance = useMutation(
    ["createAlertPreset"],
    async () => {
      let finalArray: TDailyPerformancePayload[] = [];
      state.detailsData.map((item: TDailyPerformanceDetailsResponse) =>
        finalArray.push({
          taskTicketId: item.taskTicketId || "",
          dailyPerformanceId: item.dailyPerformanceId || "",
          bw: item.bw.actual || 0,
          feed: item.feed || 0,
          dead: item.dead || 0,
          culled: item.culled || 0,
          yellowCardImages: item.yellowCardImages || [],
          summary: item.summary,
          issues: {
            infrastructure: item.issues.infrastructure,
            management: item.issues.management,
            farmInput: item.issues.farmInput,
            diseases: item.issues.diseases,
            forceMajeure: item.issues.forceMajeure,
            others: item.issues.others || null,
          },
          treatment: item.treatment,
        })
      );
      await putEditDailyPerformance(finalArray, farmingCycleId);
    },
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

  if (
    summaryData.isLoading ||
    detailsData.isLoading ||
    detailsData.isFetching ||
    feedBrandsData.isLoading ||
    editDailyPerformance.isLoading ||
    editDailyPerformance.isSuccess
  )
    return <Loading />;
  if (summaryData.isError || detailsData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Farming Cycle Details"
      pageTitle={`Farming Cycle Details ${
        state.summaryData.farm.coop.name &&
        " - " + state.summaryData.farm.coop.name
      }`}
    >
      <EditModal dispatch={dispatch} state={state} />
      <div className="mt-6">
        <TableColumns dispatch={dispatch} state={state} />
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
          state={"active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={"active"}
          onClick={() => editDailyPerformance.mutate()}
          title="Save"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
