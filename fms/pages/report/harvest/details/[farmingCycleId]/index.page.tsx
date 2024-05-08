import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import {
  deleteHarvestRealizationItem,
  getFarmingCycleHarvestDetail,
  getFarmingCycleHarvestRealizations,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString, encodeString } from "@services/utils/encode";
import {
  TGetManyResponse,
  THarvestDetailResponse,
  TRealizationInFarmingCycleItem,
  TRealizationsInFarmingCycleResponse,
} from "@type/response.type";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import DetailsAccordion from "./details.accordion";
import { ACTIONS, initialState } from "./details.constants";
import { reducer } from "./details.reducer";

import DeleteIcon from "@icons/DeleteIcon.svg";
import EditIcon from "@icons/EditIcon.svg";
import FileListIcon from "@icons/FileListIcon.svg";
import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import { columns } from "./details.columns";
import { AxiosError } from "axios";
import { FARMING_STATUS_HARVEST, REALIZATION_STATUS } from "@constants/index";
import { setErrorText } from "./details.functions";
import DeleteModal from "./details.delete";

const Details: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const farmingCycleId = decodeString(router.query.farmingCycleId as string);

  const [state, dispatch] = useReducer(reducer, initialState);
  const detailsData: UseQueryResult<
    { data: TGetManyResponse<THarvestDetailResponse> },
    AxiosError
  > = useQuery(
    ["detailsData"],
    async () => await getFarmingCycleHarvestDetail(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const details: THarvestDetailResponse = data.data;
        dispatch({
          type: ACTIONS.SET_DETAILS_DATA,
          payload: { data: details },
        });
      },
    }
  );

  const realizationData: UseQueryResult<
    { data: TGetManyResponse<TRealizationsInFarmingCycleResponse> },
    AxiosError
  > = useQuery(
    ["realizationData"],
    async () => await getFarmingCycleHarvestRealizations(farmingCycleId),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        dispatch({
          type: ACTIONS.SET_REALIZATIONS_DATA,
          payload: { data: data.data.realizations },
        });
      },
    }
  );

  const deleteRealizationItem: any = useMutation(
    ["deleteHarvestRealizationItem"],
    async () =>
      await deleteHarvestRealizationItem(
        farmingCycleId,
        state.deletedHarvestItem
      ),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        dispatch({
          type: ACTIONS.SET_IS_DELETE_MODAL_VISIBLE,
          payload: { data: false },
        });
        queryClient.invalidateQueries("detailsData");
        queryClient.invalidateQueries("realizationData");
      },
    }
  );

  if (
    detailsData.isLoading ||
    detailsData.isFetching ||
    realizationData.isLoading ||
    realizationData.isFetching
  )
    return <Loading />;
  if (detailsData.isError || realizationData.isError)
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Harvest Details"
      pageTitle={
        detailsData.data
          ? `Harvest Details - ${detailsData.data?.data.data.coop.name}`
          : "Harvest Details"
      }
      button={true}
      onButtonClick={() =>
        router.push(`/report/harvest/${encodeString(farmingCycleId)}/create`)
      }
      buttonTitle="Add Realization"
      buttonState={
        detailsData.data?.data.data.status ===
        FARMING_STATUS_HARVEST.IN_PROGRESS
          ? "active"
          : "disabled"
      }
    >
      <DeleteModal
        deleteRealization={deleteRealizationItem}
        state={state}
        dispatch={dispatch}
        onClickOk={() => {
          deleteRealizationItem.mutate();
        }}
      />
      <DetailsAccordion data={state.detailsData} />
      <div className="mt-6">
        <Table
          scrollX={1500}
          tableData={realizationData.data?.data.data.realizations.map(
            (item, index, data) => {
              const newItem = { ...item };
              newItem.harvestNo = data.length - index;
              return newItem;
            }
          )}
          columns={[
            {
              title: "Action",
              fixed: "left",
              width: 120,
              key: "action",
              render: (record: TRealizationInFarmingCycleItem) => (
                <div className="flex flex-row items-center justify-start mb-2">
                  <div className="w-12 pl-1 flex items-center justify-start">
                    {record.status === REALIZATION_STATUS.DELETED ? (
                      <button className="flex flex-row items-center justify-between border cursor-not-allowed bg-white border-gray-400 text-gray-400 p-2.5 rounded-lg">
                        <div className="flex-1 flex flex-row justify-start items-center">
                          <EditIcon />
                        </div>
                      </button>
                    ) : (
                      <Button
                        type="icon-outline"
                        title="Edit"
                        size="sm"
                        icon={
                          record.status === REALIZATION_STATUS.FINAL ? (
                            <FileListIcon />
                          ) : (
                            <EditIcon />
                          )
                        }
                        isAnchor={true}
                        href={
                          "/report/harvest/details/" +
                          encodeString(farmingCycleId) +
                          "/edit/" +
                          encodeString(record.id)
                        }
                        state={
                          record.status === REALIZATION_STATUS.FINAL ||
                          record.status === REALIZATION_STATUS.DRAFT
                            ? "active"
                            : "disabled"
                        }
                      />
                    )}
                  </div>
                  <div className="w-12 pl-1 flex items-center justify-start">
                    {record.status === REALIZATION_STATUS.DELETED ||
                    record.status === REALIZATION_STATUS.FINAL ? (
                      <button className="flex flex-row items-center justify-between border cursor-not-allowed bg-white border-gray-400 text-gray-400 p-2.5 rounded-lg">
                        <div className="flex-1 flex flex-row justify-start items-center">
                          <DeleteIcon />
                        </div>
                      </button>
                    ) : (
                      <Button
                        type="icon-outline"
                        title="Delete"
                        size="sm"
                        icon={
                          <DeleteIcon
                            className={`${
                              record.status === REALIZATION_STATUS.DRAFT
                                ? "group-hover:text-white"
                                : "group-hover:none"
                            }   text-red-500`}
                          />
                        }
                        className={`${
                          record.status === REALIZATION_STATUS.DRAFT
                            ? "hover:!bg-red-500 group"
                            : "hover:!none"
                        }   !border-red-500`}
                        state={
                          record.status === REALIZATION_STATUS.DRAFT
                            ? "active"
                            : "disabled"
                        }
                        onClick={() => {
                          dispatch({
                            type: ACTIONS.SET_DELETED_HARVEST_ITEM,
                            payload: { data: record.id },
                          });
                          dispatch({
                            type: ACTIONS.SET_IS_DELETE_MODAL_VISIBLE,
                            payload: { data: true },
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              ),
            },
            ...columns,
          ]}
          isPagination={false}
          onClickNext={undefined}
          onClickPrevious={undefined}
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Details;
