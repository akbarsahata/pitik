import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { USER_TYPE } from "@constants/index";
import EditIcon from "@icons/EditIcon.svg";
import {
  getBuildings,
  getBuildingTypes,
  getCoops,
  getFarms,
  getFloorTypes,
  getRooms,
  getRoomTypes,
  getUsers,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { encodeString } from "@services/utils/encode";
import { isEmptyString } from "@services/utils/string";
import {
  TBuildingResponse,
  TBuildingTypeResponse,
  TCoopResponse,
  TFarmResponse,
  TFloorTypeResponse,
  TGetManyResponse,
  TRoomTypeResponse,
  TTaskPresetResponse,
  TUserResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { columns } from "./room.columns";
import { ACTION_TYPE, search, store } from "./room.constants";
import { reducer } from "./room.reducer";
import AdvanceSearch from "./room.search";

const Room: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TTaskPresetResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getRooms({
        page: state.tablePage,
        limit: 10,
        buildingId:
          state.search.building === null ||
          isEmptyString(state.search.building.value.id)
            ? undefined
            : state.search.building.value.id,
        farmId:
          state.search.farm === null ||
          isEmptyString(state.search.farm.value.id)
            ? undefined
            : state.search.farm.value.id,
        ownerId:
          state.search.owner === null ||
          isEmptyString(state.search.owner.value.id)
            ? undefined
            : state.search.owner.value.id,
        coopId:
          state.search.coop === null ||
          isEmptyString(state.search.coop.value.id)
            ? undefined
            : state.search.coop.value.id,
        buildingTypeId:
          state.search.buildingType === null ||
          isEmptyString(state.search.buildingType.value.id)
            ? undefined
            : state.search.buildingType.value.id,
        roomTypeId:
          state.search.roomType === null ||
          isEmptyString(state.search.roomType.value.id)
            ? undefined
            : state.search.roomType.value.id,
        floorTypeId:
          state.search.floorType === null ||
          isEmptyString(state.search.floorType.value.id)
            ? undefined
            : state.search.floorType.value.id,
        status: state.search.status ? state.search.status.value : undefined,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const onPage = Math.ceil(data.count / 10);
        if (onPage === state.tablePage) {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage,
          });
        }
      },
    }
  );

  const farmData: UseQueryResult<
    { data: TGetManyResponse<TFarmResponse[]> },
    AxiosError
  > = useQuery(
    ["farmData"],
    async () =>
      await getFarms({
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
        const farmList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FARM_DATA,
          payload: farmList,
        });
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
        status: true,
        userType: USER_TYPE.OWN.full,
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

  const coopData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["coopData"],
    async () =>
      await getCoops({
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
        const coopList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_DATA,
          payload: coopList,
        });
      },
    }
  );

  const buildingData: UseQueryResult<
    { data: TGetManyResponse<TBuildingResponse[]> },
    AxiosError
  > = useQuery(
    ["buildingData", state.inputSearch.farm],
    async () =>
      await getBuildings({
        page: 1,
        limit: 0,
        status: true,
        farmId: state.inputSearch.farm?.value.id,
      }),
    {
      enabled: !!state.inputSearch.farm,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const buildingList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING_DATA,
          payload: buildingList,
        });
      },
    }
  );

  const buildingTypeData: UseQueryResult<
    { data: TGetManyResponse<TBuildingTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["buildingTypeData"],
    async () =>
      await getBuildingTypes({
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
        const buildingTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING_TYPE_DATA,
          payload: buildingTypeList,
        });
      },
    }
  );

  const roomTypeData: UseQueryResult<
    { data: TGetManyResponse<TRoomTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["roomTypeData"],
    async () =>
      await getRoomTypes({
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
        const roomTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_ROOM_TYPE_DATA,
          payload: roomTypeList,
        });
      },
    }
  );

  const floorTypeData: UseQueryResult<
    { data: TGetManyResponse<TFloorTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["floorTypeData"],
    async () =>
      await getFloorTypes({
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
        const floorTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_FLOOR_TYPE_DATA,
          payload: floorTypeList,
        });
      },
    }
  );

  if (tableData.isLoading) return <Loading />;
  if (
    tableData.isError ||
    farmData.isError ||
    ownerData.isError ||
    coopData.isError ||
    buildingData.isError ||
    buildingTypeData.isError ||
    roomTypeData.isError ||
    floorTypeData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Room" pageTitle="Room">
      <TableBar
        isResetAllButtonVisible={state.search === search ? false : true}
        onClickResetSearch={() => {
          dispatch({ type: ACTION_TYPE.RESET_SEARCH, payload: null });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_BUILDING_DATA,
            payload: [],
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: true,
          })
        }
        addNewButtonTitle="Add New Room"
        onClickAddNew={() => router.push("/master/farm-data/room/create")}
      />
      <Table
        scrollX={2700}
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 68,
            key: "action",
            render: (record: { id: string }) => (
              <Button
                type="icon-outline"
                title="Edit"
                size="sm"
                icon={<EditIcon />}
                isAnchor={true}
                href={"/master/farm-data/room/edit/" + encodeString(record.id)}
              />
            ),
          },
          ...columns,
        ]}
        tablePage={state.tablePage}
        isLastPage={state.isLastPage}
        onClickNext={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage + 1,
          })
        }
        onClickPrevious={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage - 1,
          })
        }
      />

      <AdvanceSearch
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: 1,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH,
            payload: state.inputSearch,
          });
        }}
      />
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Room;
