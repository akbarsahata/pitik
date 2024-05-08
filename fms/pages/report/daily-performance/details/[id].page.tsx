import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import {
  getDailyPerformanceDetails,
  getDailyPerformanceSummary,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import {
  TDailyPerformanceDetailsResponse,
  TDailyPerformanceSummaryResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import DetailsAccordion from "./details.accordion";
import TableColumns from "./details.columns";
import { ACTION_TYPE, store } from "./details.constants";
import { reducer } from "./details.reducer";

const Details: NextPage = () => {
  const router = useRouter();
  const farmingCycleId = decodeString(router.query.id as string);
  const [state, dispatch] = useReducer(reducer, store);

  const summaryData: UseQueryResult<
    { data: TGetManyResponse<TDailyPerformanceSummaryResponse> },
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
        const details = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DETAILS_DATA,
          payload: details,
        });
      },
    }
  );

  if (summaryData.isLoading || summaryData.isFetching || detailsData.isLoading)
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
      button={true}
      onButtonClick={() =>
        router.push("/report/daily-performance/edit/" + router.query.id)
      }
      buttonTitle="Daily Input"
    >
      <DetailsAccordion data={state.summaryData} />
      <div className="mt-6">
        <TableColumns
          tableData={state.detailsData}
          contractType={state.summaryData.farm.coop.contractType}
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Details;
