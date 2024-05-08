import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { INLET_POSITION } from "@constants/index";
import DeleteIcon from "@icons/DeleteIcon.svg";
import EditIcon from "@icons/EditIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getBuildings,
  getControllerTypes,
  getCoops,
  getFloorTypes,
  getHeaterTypes,
  getRoomTypes,
  postCreateRoom,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TControllerTypeResponse,
  TCoopResponse,
  TFanResponse,
  TFloorTypeResponse,
  TGetManyResponse,
  THeaterTypeResponse,
  TRoomTypeResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { THeaterInRoomsBody } from "../room.constants";
import { ACTION_TYPE, ERROR_TYPE, store } from "./create.constants";
import FanModal from "./create.fan";
import { checkRequired, setErrorText } from "./create.functions";
import HeaterModal from "./create.heater";
import { reducer } from "./create.reducer";

const Create: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  let coopOptions: IDropdownItem<TCoopResponse>[] = [];
  state.coopData.map((item: TCoopResponse) =>
    coopOptions.push({
      value: item,
      label: `(${item.coopCode}) ${item.coopName}`,
    })
  );

  let buildingOptions: IDropdownItem<TBuildingResponse>[] = [];
  state.buildingData.map((item: TBuildingResponse) =>
    buildingOptions.push({
      value: item,
      label: `(${item.buildingType.name}) ${item.name}`,
    })
  );

  let roomTypeOptions: IDropdownItem<TRoomTypeResponse>[] = [];
  state.roomTypeData.map((item: TRoomTypeResponse) =>
    roomTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let floorTypeOptions: IDropdownItem<TFloorTypeResponse>[] = [];
  state.floorTypeData.map((item: TFloorTypeResponse) =>
    floorTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let coolingPadOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item: boolean) =>
    coolingPadOptions.push({
      value: item,
      label: item ? "Exist" : "Not Exist",
    })
  );

  let inletPositionOptions: IDropdownItem<string>[] = [];
  INLET_POSITION.map((item: string) =>
    inletPositionOptions.push({
      value: item,
      label: item === "LETTER_U" ? "LETTER U" : item,
    })
  );

  let controllerTypeOptions: IDropdownItem<TControllerTypeResponse>[] = [];
  state.controllerTypeData.map((item: TControllerTypeResponse) =>
    controllerTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item: boolean) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
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
    ["buildingData"],
    async () =>
      await getBuildings({
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
        const buildingList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING_DATA,
          payload: buildingList,
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

  const controllerTypeData: UseQueryResult<
    { data: TGetManyResponse<TControllerTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["controllerTypeData"],
    async () =>
      await getControllerTypes({
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
        const controllerTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_CONTROLLER_TYPE_DATA,
          payload: controllerTypeList,
        });
      },
    }
  );

  const heaterTypeData: UseQueryResult<
    { data: TGetManyResponse<THeaterTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["heaterTypeData"],
    async () =>
      await getHeaterTypes({
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
        const heaterTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
          payload: heaterTypeList,
        });
      },
    }
  );

  const createRoom = useMutation(
    ["createRoom"],
    async () => {
      const heaterPayload: {
        heaterTypeId: string;
        quantity: number;
      }[] = [];
      state.heaterInRooms.length &&
        state.heaterInRooms.map((item: THeaterInRoomsBody) =>
          heaterPayload.push({
            quantity: item.quantity || 0,
            heaterTypeId: item.heaterType ? item.heaterType.value.id : "",
          })
        );

      const fanPayload: {
        size: number;
        capacity: number;
      }[] = [];
      state.fans.length &&
        state.fans.map((item: TFanResponse) =>
          fanPayload.push({
            size: item.size || 0,
            capacity: item.capacity || 0,
          })
        );
      await postCreateRoom({
        population: state.population || 0,
        inletWidth: state.inletWidth,
        inletLength: state.inletLength,
        inletPosition: state.inletPosition
          ? state.inletPosition.value
          : undefined,
        status: state.status ? state.status.value : true,
        isCoolingPadExist: state.coolingPad ? state.coolingPad.value : false,
        buildingId: state.building ? state.building.value.id : "",
        roomTypeId: state.roomType ? state.roomType.value.id : "",
        floorTypeId: state.floorType ? state.floorType.value.id : "",
        controllerTypeId: state.controllerType
          ? state.controllerType.value?.id
          : undefined,
        coopId: state.coop ? state.coop.value.id : "",
        heaterInRooms: heaterPayload,
        fans: fanPayload,
      });
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  if (
    coopData.isLoading ||
    buildingData.isLoading ||
    roomTypeData.isLoading ||
    floorTypeData.isLoading ||
    controllerTypeData.isLoading ||
    heaterTypeData.isLoading ||
    createRoom.isLoading ||
    createRoom.isSuccess
  )
    return <Loading />;
  if (
    coopData.isError ||
    buildingData.isError ||
    roomTypeData.isError ||
    floorTypeData.isError ||
    controllerTypeData.isError ||
    heaterTypeData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper headTitle="Create New Room" pageTitle="New Room">
      <FanModal state={state} dispatch={dispatch} />
      <HeaterModal state={state} dispatch={dispatch} />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex-1 w-full">
            <Dropdown
              label="Coop *"
              state={state.errorType === ERROR_TYPE.COOP ? "error" : "active"}
              errorMessage="Please select a coop!"
              value={state.coop}
              isSearchable={true}
              options={coopOptions}
              onChange={(item: IDropdownItem<TCoopResponse>) => {
                dispatch({
                  type: ACTION_TYPE.SET_ERROR_TYPE,
                  payload: ERROR_TYPE.NONE,
                });
                dispatch({
                  type: ACTION_TYPE.SET_COOP,
                  payload: item,
                });
              }}
            />
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Building *"
                value={state.building}
                options={buildingOptions}
                state={
                  state.errorType === ERROR_TYPE.BUILDING ? "error" : "active"
                }
                errorMessage="Please select a building!"
                isSearchable={true}
                onChange={(item: IDropdownItem<TBuildingResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_BUILDING,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Room Type *"
                value={state.roomType}
                options={roomTypeOptions}
                state={
                  state.errorType === ERROR_TYPE.ROOM_TYPE ? "error" : "active"
                }
                errorMessage="Please select a room type!"
                onChange={(item: IDropdownItem<TRoomTypeResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_ROOM_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Floor Type *"
                value={state.floorType}
                options={floorTypeOptions}
                state={
                  state.errorType === ERROR_TYPE.FLOOR_TYPE ? "error" : "active"
                }
                errorMessage="Please select a floor type!"
                onChange={(item: IDropdownItem<TFloorTypeResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_FLOOR_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Input
                label="Population *"
                type="number"
                min="0"
                className="w-full"
                value={state.population}
                state={
                  state.errorType === ERROR_TYPE.POPULATION ? "error" : "active"
                }
                errorMessage="Please set the room's population!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_POPULATION,
                    payload: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <p className="text-lg font-semibold">List of Heaters</p>
              <div
                className={`mt-4 ${
                  state.heaterInRooms.length === 0 ? "" : "hidden"
                }`}
              >
                <Button
                  size="xs"
                  state={"active"}
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
                      payload: true,
                    });
                  }}
                  className="mt-2"
                  title="Add New Heater"
                />
              </div>
              <div
                className={`mt-4 ${
                  state.heaterInRooms.length !== 0 ? "" : "hidden"
                }`}
              >
                <div>
                  <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                    <div className="w-24">
                      <p className="text-center">Actions</p>
                    </div>
                    <div className="flex-1">
                      <p>Heater Type</p>
                    </div>
                    <div className="flex-1">
                      <p>Quantity</p>
                    </div>
                  </div>
                  {state.heaterInRooms.map((heater: THeaterInRoomsBody) => (
                    <div
                      key={heater.id}
                      className="flex flex-row items-center justify-start mb-2"
                    >
                      <div className="w-12 pl-1 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            const filteredData = state.heaterInRooms.filter(
                              (e: THeaterInRoomsBody) => e.id !== heater.id
                            );
                            dispatch({
                              type: ACTION_TYPE.SET_HEATER_IN_ROOMS,
                              payload: filteredData,
                            });
                          }}
                        />
                      </div>
                      <div className="w-12 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<EditIcon />}
                          onClick={() => {
                            dispatch({
                              type: ACTION_TYPE.SET_INPUT_HEATER,
                              payload:
                                state.heaterInRooms[
                                  state.heaterInRooms.findIndex(
                                    (data) => data.id === heater.id
                                  )
                                ],
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
                              payload: true,
                            });
                          }}
                        />
                      </div>
                      <div className="flex-1 ml-4">
                        <p>{heater.heaterType?.value.name || "-"}</p>
                      </div>
                      <div className="flex-1 ml-4">
                        <p>{heater.quantity || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center mt-2 space-x-1">
                  <Button
                    title="Add"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE,
                        payload: true,
                      });
                    }}
                  />
                  <Button
                    title="Remove All"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_HEATER_IN_ROOMS,
                        payload: [],
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start space-y-6">
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Cooling Pad *"
                value={state.coolingPad}
                options={coolingPadOptions}
                state={
                  state.errorType === ERROR_TYPE.IS_COOLING_PAD_EXIST
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the cooling pad's existance!"
                onChange={(item: IDropdownItem<boolean>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_COOLING_PAD,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label={`Inlet Position ${
                  state.building &&
                  (state.building.value?.buildingType?.name === "Close" ||
                    state.building.value?.buildingType?.name === "Semi")
                    ? "*"
                    : ""
                }`}
                value={state.inletPosition}
                options={inletPositionOptions}
                state={
                  state.errorType === ERROR_TYPE.INLET_POSITION
                    ? "error"
                    : "active"
                }
                errorMessage="Please select the inlet's position!"
                onChange={(item: IDropdownItem<string>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_INLET_POSITION,
                    payload: item,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Input
                label={`Inlet Width (m) ${
                  state.building &&
                  (state.building.value?.buildingType?.name === "Close" ||
                    state.building.value?.buildingType?.name === "Semi")
                    ? "*"
                    : ""
                }`}
                type="number"
                min="1"
                className="w-full"
                value={state.inletWidth}
                state={
                  state.errorType === ERROR_TYPE.INLET_WIDTH
                    ? "error"
                    : "active"
                }
                errorMessage="Please set the inlet's width (min: 1)!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_INLET_WIDTH,
                    payload: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Input
                label={`Inlet Length (m) ${
                  state.building &&
                  (state.building.value?.buildingType?.name === "Close" ||
                    state.building.value?.buildingType?.name === "Semi")
                    ? "*"
                    : ""
                }`}
                type="number"
                min="1"
                className="w-full"
                value={state.inletLength}
                state={
                  state.errorType === ERROR_TYPE.INLET_LENGTH
                    ? "error"
                    : "active"
                }
                errorMessage="Please set the inlet's length (min: 1)!"
                onChange={(e) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_INLET_LENGTH,
                    payload: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <Dropdown
                label="Controller Type"
                value={state.controllerType}
                options={controllerTypeOptions}
                onChange={(item: IDropdownItem<TControllerTypeResponse>) => {
                  dispatch({
                    type: ACTION_TYPE.SET_ERROR_TYPE,
                    payload: ERROR_TYPE.NONE,
                  });
                  dispatch({
                    type: ACTION_TYPE.SET_CONTROLLER_TYPE,
                    payload: item,
                  });
                }}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Status *"
                value={state.status}
                options={statusOptions}
                state={
                  state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                }
                errorMessage="Please select the status!"
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
          <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
            <div className="w-full">
              <p className="text-lg font-semibold">List of Fans</p>
              <div
                className={`mt-4 ${state.fans.length === 0 ? "" : "hidden"}`}
              >
                <Button
                  size="xs"
                  state={"active"}
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
                      payload: true,
                    });
                  }}
                  className="mt-2"
                  title="Add New Fan"
                />
              </div>
              <div
                className={`mt-4 ${state.fans.length !== 0 ? "" : "hidden"}`}
              >
                <div>
                  <div className="flex flex-row w-full space-x-2 mb-4 font-medium text-gray-500">
                    <div className="w-24">
                      <p className="text-center">Actions</p>
                    </div>
                    <div className="flex-1">
                      <p>Size (inch)</p>
                    </div>
                    <div className="flex-1">
                      <p>Capacity (CFM)</p>
                    </div>
                  </div>
                  {state.fans.map((fan: TFanResponse) => (
                    <div
                      key={fan.id}
                      className="flex flex-row items-center justify-start mb-2"
                    >
                      <div className="w-12 pl-1 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            const filteredData = state.fans.filter(
                              (e) => e.id !== fan.id
                            );
                            dispatch({
                              type: ACTION_TYPE.SET_FANS,
                              payload: filteredData,
                            });
                          }}
                        />
                      </div>
                      <div className="w-12 flex items-center justify-start">
                        <Button
                          type="icon-outline"
                          size="sm"
                          icon={<EditIcon />}
                          onClick={() => {
                            dispatch({
                              type: ACTION_TYPE.SET_INPUT_FAN,
                              payload:
                                state.fans[
                                  state.fans.findIndex(
                                    (data) => data.id === fan.id
                                  )
                                ],
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
                              payload: true,
                            });
                          }}
                        />
                      </div>
                      <div className="flex-1 ml-4">
                        <p>{fan.size}</p>
                      </div>
                      <div className="flex-1 ml-4">
                        <p>{fan.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center mt-2 space-x-1">
                  <Button
                    title="Add"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE,
                        payload: true,
                      });
                    }}
                  />
                  <Button
                    title="Remove All"
                    size="xs"
                    onClick={() => {
                      dispatch({
                        type: ACTION_TYPE.SET_FANS,
                        payload: [],
                      });
                    }}
                  />
                </div>
              </div>
            </div>
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
          state={createRoom.isLoading ? "disabled" : "active"}
          type="outline"
          onClick={() => router.back()}
          title="Cancel"
        />
        <Button
          size="xs"
          state={createRoom.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            createRoom.mutate();
          }}
          title="Create Room"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Create;
