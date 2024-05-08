import Button from "@components/atoms/Button/Button";
import Dropdown from "@components/atoms/Dropdown/Dropdown";
import Input from "@components/atoms/Input/Input";
import Modal from "@components/atoms/Modal/Modal";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import { DEVICE_TYPE, SENSOR_POSITIONS, SENSOR_TYPES } from "@constants/index";
import DeleteIcon from "@icons/DeleteIcon.svg";
import InformationIcon from "@icons/InformationIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import {
  getBuildings,
  getControllerTypes,
  getCoops,
  getDeviceSensor,
  getDeviceTypes,
  getFarms,
  getRooms,
  putEditDevice,
} from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { decodeString } from "@services/utils/encode";
import { randomHexString } from "@services/utils/string";
import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TControllerTypeResponse,
  TCoopResponse,
  TDeviceTypeResponse,
  TDevicesSensorResponse,
  TFarmResponse,
  TGetByIdResponse,
  TGetManyResponse,
  THeaterInRoomsResponse,
  TRoomResponse,
  TSensorResponse,
} from "@type/response.type";
import { Image, Tabs } from "antd";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { UseQueryResult, useMutation, useQuery } from "react-query";
import { TSensorPayload } from "../create/create.constants";
import {
  ACTION_TYPE,
  ERROR_TYPE,
  SENSOR_TYPES_OBJECT,
  store,
} from "./edit.constants";
import {
  checkRequired,
  setDeviceInitialData,
  setErrorText,
} from "./edit.functions";
import { reducer } from "./edit.reducer";

const Edit: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);
  const currentDeviceId = decodeString(router.query.id as string);

  let farmOptions: IDropdownItem<TFarmResponse>[] = [];
  state.farmData.map((item: TFarmResponse) =>
    farmOptions.push({
      value: item,
      label: `(${item.farmCode}) ${item.farmName}`,
    })
  );

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

  let roomOptions: IDropdownItem<TRoomResponse>[] = [];
  state.roomData.map((item: TRoomResponse) =>
    roomOptions.push({
      value: item,
      label: `(${item.roomCode}) ${item?.roomType.name}`,
    })
  );

  let sensorPositionOptions: IDropdownItem<string>[] = [];
  SENSOR_POSITIONS.map((item) =>
    sensorPositionOptions.push({
      value: item,
      label: item,
    })
  );

  let sensorTypeOptions: IDropdownItem<string>[] = [];
  SENSOR_TYPES.map((item) =>
    sensorTypeOptions.push({
      value: item,
      label: item.replace(/_/g, " "),
    })
  );

  let deviceTypeOptions: IDropdownItem<TDeviceTypeResponse>[] = [];
  state.deviceTypeData.map((item: TDeviceTypeResponse) =>
    deviceTypeOptions.push({
      value: item,
      label: item.text,
    })
  );

  let controllerTypeOptions: IDropdownItem<TControllerTypeResponse>[] = [];
  state.controllerTypeData.map((item: TControllerTypeResponse) =>
    controllerTypeOptions.push({
      value: item,
      label: item.name,
    })
  );

  let coolingPadOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item: boolean) =>
    coolingPadOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    })
  );

  let lampOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item: boolean) =>
    lampOptions.push({
      value: item,
      label: item ? "Yes" : "No",
    })
  );

  let heaterTypeOptions: IDropdownItem<THeaterInRoomsResponse>[] = [];
  state.heaterTypeData.map((item: THeaterInRoomsResponse) =>
    heaterTypeOptions.push({
      value: item,
      label: item.heaterType.name,
    })
  );

  let fanOptions: IDropdownItem<number>[] = [];
  Array.from({ length: 8 }, (_, i) => i + 1).map((item) =>
    fanOptions.push({
      value: item,
      label: item,
    })
  );

  let statusOptions: IDropdownItem<boolean>[] = [];
  [true, false].map((item) =>
    statusOptions.push({
      value: item,
      label: item ? "Active" : "Inactive",
    })
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

  const coopData: UseQueryResult<
    { data: TGetManyResponse<TCoopResponse[]> },
    AxiosError
  > = useQuery(
    ["coopData", state.farm],
    async () =>
      await getCoops({
        page: 1,
        limit: 0,
        farmId: state.farm?.value.id,
      }),
    {
      enabled: !!state.farm || !!state.temp.coopId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const coopNameList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_COOP_DATA,
          payload: coopNameList,
        });
        const coop =
          coopNameList[
            coopNameList.findIndex((item) => item.id === state.temp.coopId)
          ];
        dispatch({
          type: ACTION_TYPE.SET_COOP,
          payload: coop
            ? {
                value: coop,
                label: `(${coop?.coopCode}) ${coop?.coopName}`,
              }
            : null,
        });
      },
    }
  );

  const buildingData: UseQueryResult<
    { data: TGetManyResponse<TBuildingResponse[]> },
    AxiosError
  > = useQuery(
    ["buildingData", state.farm],
    async () =>
      await getBuildings({
        page: 1,
        limit: 0,
        farmId: state.farm?.value.id,
      }),
    {
      enabled: !!state.farm || !!state.temp.buildingId,
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
        const building =
          buildingList[
            buildingList.findIndex((item) => item.id === state.temp.buildingId)
          ];
        dispatch({
          type: ACTION_TYPE.SET_BUILDING,
          payload: building
            ? {
                value: building,
                label: `(${building?.buildingType.name}) ${building?.name}`,
              }
            : null,
        });
      },
    }
  );

  const roomData: UseQueryResult<
    { data: TGetManyResponse<TRoomResponse[]> },
    AxiosError
  > = useQuery(
    ["roomData", state.building],
    async () =>
      await getRooms({
        page: 1,
        limit: 0,
        buildingId: state.building?.value.id,
      }),
    {
      enabled: !!state.building,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const roomList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_ROOM_DATA,
          payload: roomList,
        });
        const room =
          roomList[roomList.findIndex((item) => item.id === state.temp.roomId)];
        dispatch({
          type: ACTION_TYPE.SET_ROOM,
          payload: room
            ? {
                value: room,
                label: `(${room.roomCode}) ${room?.roomType.name}`,
              }
            : null,
        });
        if (state.temp.roomId && room) {
          dispatch({
            type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
            payload: room.heaterInRooms,
          });

          const heater =
            state.temp.heaterId &&
            room.heaterInRooms[
              room.heaterInRooms.findIndex(
                (item) => item.heaterTypeId === state.temp.heaterId
              )
            ];
          dispatch({
            type: ACTION_TYPE.SET_HEATER_ID,
            payload: heater
              ? {
                  value: heater,
                  label: heater.heaterType.name,
                }
              : null,
          });
        }

        let sensorData: TSensorPayload[] = [];
        if (state.building && state.building.value.id === state.oldBuildingId) {
          state.temp.sensors.map((sensor: TSensorResponse) =>
            sensorData.push({
              id: sensor.id,
              sensorType: sensor.sensorType
                ? {
                    label: SENSOR_TYPES[
                      SENSOR_TYPES.findIndex(
                        (item) => item === sensor.sensorType
                      )
                    ].replace(/_/g, " "),
                    value:
                      SENSOR_TYPES[
                        SENSOR_TYPES.findIndex(
                          (item) => item === sensor.sensorType
                        )
                      ],
                  }
                : null,
              sensorCode: sensor.sensorCode,
              position: sensor.position
                ? {
                    label:
                      SENSOR_POSITIONS[
                        SENSOR_POSITIONS.findIndex(
                          (item) => item === sensor.position
                        )
                      ],
                    value:
                      SENSOR_POSITIONS[
                        SENSOR_POSITIONS.findIndex(
                          (item) => item === sensor.position
                        )
                      ],
                  }
                : null,
              room: sensor.roomId
                ? {
                    label: `(${
                      roomList[
                        roomList.findIndex((item) => item.id === sensor.roomId)
                      ].roomCode
                    }) ${
                      roomList[
                        roomList.findIndex((item) => item.id === sensor.roomId)
                      ].roomType.name
                    }`,
                    value:
                      roomList[
                        roomList.findIndex((item) => item.id === sensor.roomId)
                      ],
                  }
                : null,
              ipCamera: sensor.ipCamera,
            })
          );
        } else {
          state.temp.sensors.map((sensor: TSensorResponse) =>
            sensorData.push({
              id: sensor.id,
              sensorType: sensor.sensorType
                ? {
                    label: SENSOR_TYPES[
                      SENSOR_TYPES.findIndex(
                        (item) => item === sensor.sensorType
                      )
                    ].replace(/_/g, " "),
                    value:
                      SENSOR_TYPES[
                        SENSOR_TYPES.findIndex(
                          (item) => item === sensor.sensorType
                        )
                      ],
                  }
                : null,
              sensorCode: sensor.sensorCode,
              position: sensor.position
                ? {
                    label:
                      SENSOR_POSITIONS[
                        SENSOR_POSITIONS.findIndex(
                          (item) => item === sensor.position
                        )
                      ],
                    value:
                      SENSOR_POSITIONS[
                        SENSOR_POSITIONS.findIndex(
                          (item) => item === sensor.position
                        )
                      ],
                  }
                : null,
              room: null,
              ipCamera: sensor.ipCamera,
            })
          );
        }
        dispatch({
          type: ACTION_TYPE.SET_SENSORS,
          payload: sensorData,
        });
      },
    }
  );

  const deviceTypeData: UseQueryResult<
    { data: TGetManyResponse<TDeviceTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["deviceTypeData"],
    async () =>
      await getDeviceTypes({
        page: 1,
        limit: 0,
        text: "",
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE_DATA,
          payload: deviceTypeList,
        });
      },
    }
  );

  const deviceData: UseQueryResult<
    { data: TGetByIdResponse<TDevicesSensorResponse> },
    AxiosError
  > = useQuery(
    ["deviceData"],
    async () => await getDeviceSensor(currentDeviceId),
    {
      refetchOnWindowFocus: false,
      enabled: !!state.farmData.length && !!state.deviceTypeData.length,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        setDeviceInitialData({
          dispatch,
          data: data.data,
          state,
        });
      },
    }
  );

  const editDevice = useMutation(
    ["createDevice"],
    async () => {
      let sensorsData: {
        id: string;
        sensorType: string | null;
        sensorCode: string;
        position: string | null;
        roomId: string | null;
        ipCamera: string;
        status: number;
      }[] = [];
      state.sensors.map((sensor: TSensorPayload) =>
        sensorsData.push({
          id: sensor.id,
          sensorType: sensor.sensorType ? sensor.sensorType.value : null,
          sensorCode: sensor.sensorCode,
          position: sensor.position ? sensor.position.value : null,
          roomId: sensor.room ? sensor.room.value.id : null,
          ipCamera: sensor.ipCamera,
          status: 1,
        })
      );
      await putEditDevice(
        {
          coopCode: state.coop ? state.coopCode : undefined,
          deviceType: state.deviceType ? state.deviceType.value.value : "",
          totalFan: state.totalFan ? state.totalFan.value : undefined,
          heaterId: state.heaterId
            ? state.heaterId.value.heaterTypeId
            : undefined,
          coolingPad: state.coolingPad ? state.coolingPad.value : undefined,
          lamp: state.lamp ? state.lamp.value : undefined,
          deviceId: state.deviceId && state.deviceId,
          controllerTypeId: state.controllerType
            ? state.controllerType.value?.id
            : "",
          mac: state.mac,
          status: state.status ? state.status.value : true,
          farmId: state.farm ? state.farm.value.id : undefined,
          buildingId: state.building ? state.building.value.id : undefined,
          coopId: state.coop ? state.coop.value.id : undefined,
          roomId: state.room ? state.room.value.id : undefined,
          sensors: sensorsData,
        },
        currentDeviceId
      );
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        router.replace("/iot/climate-monitoring");
      },
    }
  );

  if (
    farmData.isLoading ||
    farmData.isFetching ||
    editDevice.isLoading ||
    editDevice.isSuccess ||
    deviceTypeData.isLoading ||
    deviceData.isLoading ||
    deviceData.isFetching ||
    controllerTypeData.isLoading
  )
    return <Loading />;

  if (
    deviceData.isError ||
    farmData.isError ||
    coopData.isError ||
    buildingData.isError ||
    roomData.isError ||
    controllerTypeData.isError ||
    deviceTypeData.isError ||
    roomData.isError
  )
    return <Error router={router} />;

  return (
    <MainWrapper
      headTitle="Edit Device"
      pageTitle={`Edit Device - ${state.oldName}`}
      button={true}
      buttonTitle="Info"
      buttonType="icon-outline"
      isButtonDropdown={false}
      onButtonClick={() => {
        dispatch({
          type: ACTION_TYPE.SET_IS_SENSOR_POSITION_MODAL_VISIBLE,
          payload: true,
        });
      }}
      icon={<InformationIcon className="text-base" />}
    >
      <Modal
        isVisible={state.isSensorPositionModalVisible}
        onCancel={() => {
          dispatch({
            type: ACTION_TYPE.SET_IS_SENSOR_POSITION_MODAL_VISIBLE,
            payload: false,
          });
        }}
        title="Sensor Position Mapping"
        footer={null}
        content={
          <div>
            <Image alt="Sensor Map Position" src="/SensorMapImage.png" />
          </div>
        }
      />
      <Tabs
        defaultActiveKey="device"
        activeKey={state.activeTab}
        className="mt-5"
        onChange={(key) =>
          dispatch({
            type: ACTION_TYPE.SET_ACTIVE_TAB,
            payload: key as "device" | "sensors",
          })
        }
      >
        <Tabs.TabPane tab="Details" key="device">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-start justify-start space-y-6 h-min">
              <p className="text-lg font-semibold">Farm Details</p>
              <div className="flex-1 w-full">
                <Dropdown
                  label="Farm"
                  value={state.farm}
                  isLoading={farmData.isLoading ? true : false}
                  options={farmOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TFarmResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_FARM,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_BUILDING,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ROOM,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ROOM_DATA,
                      payload: [],
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP_CODE,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
                      payload: [],
                    });
                  }}
                />
              </div>
              <div className="flex-1 w-full">
                <Dropdown
                  label={`Coop ${state.farm ? "*" : ""}`}
                  value={state.coop}
                  state={
                    state.errorType === ERROR_TYPE.COOP ? "error" : "active"
                  }
                  isLoading={coopData.isLoading ? true : false}
                  errorMessage="Please select coop name!"
                  options={coopOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TCoopResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOP_CODE,
                      payload: item.value.coopCode,
                    });
                  }}
                />
              </div>
              <div className="flex-1 w-full">
                <Dropdown
                  label={`Building ${state.farm ? "*" : ""}`}
                  value={state.building}
                  state={
                    state.errorType === ERROR_TYPE.BUILDING ? "error" : "active"
                  }
                  isLoading={buildingData.isLoading ? true : false}
                  errorMessage="Please select building name!"
                  options={buildingOptions}
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
                    dispatch({
                      type: ACTION_TYPE.SET_ROOM,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
                      payload: [],
                    });
                  }}
                />
              </div>
              <div className="flex-1 w-full">
                <Dropdown
                  label={`Room ${state.farm ? "*" : ""}`}
                  value={state.room}
                  state={
                    state.errorType === ERROR_TYPE.ROOM ? "error" : "active"
                  }
                  errorMessage="Please select the room where this device is located!"
                  isLoading={roomData.isLoading ? true : false}
                  options={roomOptions}
                  isSearchable={true}
                  onChange={(item: IDropdownItem<TRoomResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_ROOM,
                      payload: item,
                    });
                    if (item) {
                      dispatch({
                        type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
                        payload: item.value.heaterInRooms,
                      });
                    } else {
                      dispatch({
                        type: ACTION_TYPE.SET_HEATER_TYPE_DATA,
                        payload: [],
                      });
                    }
                    dispatch({
                      type: ACTION_TYPE.SET_HEATER_ID,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_CONTROLLER_TYPE,
                      payload: null,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start space-y-6 h-min">
              <p className="text-lg font-semibold">Device Details</p>
              <div className="flex-1 w-full">
                <Dropdown
                  label="Device Type *"
                  value={state.deviceType}
                  isDisabled={true}
                  options={deviceTypeOptions}
                  isSearchable={true}
                  isOptionDisabled={(
                    option: IDropdownItem<TDeviceTypeResponse>
                  ) => {
                    return (
                      option.value.value === DEVICE_TYPE.SMART_ELMON ||
                      option.value.value === DEVICE_TYPE.SMART_SCALE
                    );
                  }}
                  onChange={(item: IDropdownItem<TDeviceTypeResponse>) => {
                    dispatch({
                      type: ACTION_TYPE.SET_ERROR_TYPE,
                      payload: ERROR_TYPE.NONE,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DEVICE_TYPE,
                      payload: item,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_MAC,
                      payload: "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_DEVICE_ID,
                      payload:
                        item.value.value === DEVICE_TYPE.SMART_MONITORING ||
                        item.value.value === DEVICE_TYPE.SMART_CONTROLLER
                          ? "C"
                          : "",
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_TOTAL_FAN,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_HEATER_ID,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_COOLING_PAD,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_LAMP,
                      payload: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SENSORS,
                      payload: [],
                    });
                  }}
                />
              </div>
              {state.deviceType && (
                <div className="flex-1 w-full">
                  <Input
                    label="MAC Address *"
                    className="w-full"
                    state="disabled"
                    value={state.mac}
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPE.SET_ERROR_TYPE,
                        payload: ERROR_TYPE.NONE,
                      });
                      dispatch({
                        type: ACTION_TYPE.SET_MAC,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
              {state.deviceType &&
                state.deviceType.value.value ===
                  DEVICE_TYPE.SMART_CONVENTRON && (
                  <div className="flex-1 w-full">
                    <Dropdown
                      label={`Controller Type ${
                        state.deviceType.value.value ===
                          DEVICE_TYPE.SMART_CONVENTRON && state.room
                          ? "*"
                          : ""
                      }`}
                      value={state.controllerType}
                      options={controllerTypeOptions}
                      isOptionDisabled={(
                        option: IDropdownItem<TControllerTypeResponse>
                      ) => {
                        return (
                          option.value.name === "Punos 313" ||
                          option.value.name === "Punos"
                        );
                      }}
                      className="w-full"
                      onChange={(
                        item: IDropdownItem<TControllerTypeResponse>
                      ) => {
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
                )}
              {state.deviceType &&
                state.deviceType.value.value ===
                  DEVICE_TYPE.SMART_CONTROLLER && (
                  <div className="flex-1 w-full">
                    <Input
                      label="Device ID *"
                      className="w-full"
                      state="disabled"
                      value={state.deviceId}
                      onChange={(e) => {
                        dispatch({
                          type: ACTION_TYPE.SET_ERROR_TYPE,
                          payload: ERROR_TYPE.NONE,
                        });
                        dispatch({
                          type: ACTION_TYPE.SET_DEVICE_ID,
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                )}
              {state.deviceType &&
                (state.deviceType.value.value ===
                  DEVICE_TYPE.SMART_CONTROLLER ||
                  state.deviceType.value.value ===
                    DEVICE_TYPE.SMART_CONVENTRON) && (
                  <div className="flex flex-col w-full space-y-6">
                    <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                      <div className="w-full">
                        <Dropdown
                          label="Fan *"
                          value={state.totalFan}
                          state={
                            state.errorType === ERROR_TYPE.TOTAL_FAN
                              ? "error"
                              : "active"
                          }
                          errorMessage="Please select a fan!"
                          options={fanOptions}
                          isSearchable={true}
                          onChange={(item: IDropdownItem<number>) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_TOTAL_FAN,
                              payload: item,
                            });
                          }}
                        />
                      </div>
                      <div className="w-full">
                        <Dropdown
                          label="Heater Type"
                          value={state.heaterId}
                          options={heaterTypeOptions}
                          onChange={(
                            item: IDropdownItem<THeaterInRoomsResponse>
                          ) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_HEATER_ID,
                              payload: item,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 w-full flex-col lg:flex-row items-start justify-start space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
                      <div className="w-full">
                        <Dropdown
                          label="Cooling Pad *"
                          value={state.coolingPad}
                          options={coolingPadOptions}
                          state={
                            state.errorType === ERROR_TYPE.COOLING_PAD
                              ? "error"
                              : "active"
                          }
                          errorMessage="Please select a cooling pad!"
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
                          label="Lamp *"
                          value={state.lamp}
                          options={lampOptions}
                          state={
                            state.errorType === ERROR_TYPE.LAMP
                              ? "error"
                              : "active"
                          }
                          errorMessage="Please select a lamp!"
                          onChange={(item: IDropdownItem<boolean>) => {
                            dispatch({
                              type: ACTION_TYPE.SET_ERROR_TYPE,
                              payload: ERROR_TYPE.NONE,
                            });
                            dispatch({
                              type: ACTION_TYPE.SET_LAMP,
                              payload: item,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              <div className="flex-1 w-full">
                <Dropdown
                  label="Status *"
                  value={state.status}
                  options={statusOptions}
                  state={
                    state.errorType === ERROR_TYPE.STATUS ? "error" : "active"
                  }
                  errorMessage="Please select a status!"
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Sensors" key="sensors">
          <div className="flex flex-col items-start justify-start space-y-6">
            {/* Sensor Tab */}
            <div className="flex flex-col w-full space-y-6 h-full">
              <p className="font-semibold text-lg">Sensors</p>
              {state.sensors.length === 0 ? (
                <div>
                  <p>There is no sensor in this device</p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-row w-full space-x-4 mb-4 font-medium text-gray-500">
                    <div>
                      <p>Actions</p>
                    </div>
                    <div className="flex-1">
                      <p>Sensor Type *</p>
                    </div>
                    {state.sensors.find(
                      (sensor: TSensorPayload) =>
                        sensor.sensorType?.value === SENSOR_TYPES_OBJECT.CAMERA
                    ) && (
                      <div className="flex-1">
                        <p>IP Camera *</p>
                      </div>
                    )}
                    <div className="flex-1">
                      <p>Sensor Code *</p>
                    </div>
                    <div className="flex-1">
                      <p>Room {state.room !== null ? "*" : ""}</p>
                    </div>
                    <div className="flex-1">
                      <p>Position</p>
                    </div>
                  </div>
                  <div className="mt-6 md:space-y-4">
                    {state.sensors.map((sensor: TSensorPayload) => (
                      <div
                        key={sensor.id}
                        className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0"
                      >
                        <div className="w-12 flex items-start justify-start">
                          <Button
                            type="icon-outline"
                            size="lg"
                            icon={
                              <DeleteIcon
                                className={
                                  "text-red-500 group-hover:text-white"
                                }
                              />
                            }
                            className={
                              "hover:!bg-red-500 group !border-red-500"
                            }
                            onClick={() => {
                              const filteredData = state.sensors.filter(
                                (e) => e.id !== sensor.id
                              );
                              dispatch({
                                type: ACTION_TYPE.SET_SENSORS,
                                payload: filteredData,
                              });
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <Dropdown
                            value={
                              state.sensors[
                                state.sensors.findIndex(
                                  (data: TSensorPayload) =>
                                    data.id === sensor.id
                                )
                              ].sensorType
                            }
                            options={sensorTypeOptions}
                            isOptionDisabled={(
                              option: IDropdownItem<string>
                            ) => {
                              return state.deviceType &&
                                state.deviceType.value.value ===
                                  DEVICE_TYPE.SMART_CAMERA
                                ? option.value !== SENSOR_TYPES_OBJECT.CAMERA
                                : state.deviceType?.value.value ===
                                  DEVICE_TYPE.SMART_CONVENTRON
                                ? option.value !==
                                    SENSOR_TYPES_OBJECT.TEMPERATURE_SENSOR &&
                                  option.value !==
                                    SENSOR_TYPES_OBJECT.HUMIDITY_SENSOR
                                : false;
                            }}
                            isSearchable={true}
                            onChange={(dropdownItem: IDropdownItem<string>) => {
                              state.sensors.map((item: TSensorPayload) => {
                                if (sensor.id === item.id) {
                                  let newArr = [...state.sensors];
                                  newArr[
                                    newArr.findIndex(
                                      (data) => data.id === item.id
                                    )
                                  ].sensorType = dropdownItem;
                                  if (
                                    dropdownItem.value ===
                                    SENSOR_TYPES_OBJECT.XIAOMI_SENSOR
                                  ) {
                                    newArr[
                                      newArr.findIndex(
                                        (data) => data.id === item.id
                                      )
                                    ].sensorCode = "ATC_";
                                  } else if (
                                    dropdownItem.value ===
                                    SENSOR_TYPES_OBJECT.CAMERA
                                  ) {
                                    newArr[
                                      newArr.findIndex(
                                        (data) => data.id === item.id
                                      )
                                    ].sensorCode = "BRD_";
                                  } else {
                                    newArr[
                                      newArr.findIndex(
                                        (data) => data.id === item.id
                                      )
                                    ].sensorCode = "";
                                  }
                                  dispatch({
                                    type: ACTION_TYPE.SET_SENSORS,
                                    payload: newArr,
                                  });
                                }
                              });
                              dispatch({
                                type: ACTION_TYPE.SET_ERROR_TYPE,
                                payload: ERROR_TYPE.NONE,
                              });
                            }}
                          />
                        </div>

                        {sensor.sensorType?.value ===
                          SENSOR_TYPES_OBJECT.CAMERA && (
                          <div className="flex-1 w-full">
                            <Input
                              className="w-full"
                              hintMessage="format: xxx.xxx.xxx.xxx"
                              value={
                                state.sensors[
                                  state.sensors.findIndex(
                                    (data: TSensorPayload) =>
                                      data.id === sensor.id
                                  )
                                ].ipCamera
                              }
                              state={
                                deviceData.data?.data.data.sensors.some(
                                  (item) => item.id === sensor.id
                                )
                                  ? "disabled"
                                  : "active"
                              }
                              errorMessage="Please enter a valid IP Camera!"
                              onChange={(e) => {
                                state.sensors.map((item: TSensorPayload) => {
                                  if (sensor.id === item.id) {
                                    let newArr = [...state.sensors];
                                    newArr[
                                      newArr.findIndex(
                                        (data) => data.id === item.id
                                      )
                                    ].ipCamera = e.target.value.trim();
                                    dispatch({
                                      type: ACTION_TYPE.SET_SENSORS,
                                      payload: newArr,
                                    });
                                  }
                                });
                                dispatch({
                                  type: ACTION_TYPE.SET_ERROR_TYPE,
                                  payload: ERROR_TYPE.NONE,
                                });
                              }}
                            />
                          </div>
                        )}

                        <div className="flex-1 w-full">
                          <Input
                            className="w-full"
                            value={
                              state.sensors[
                                state.sensors.findIndex(
                                  (data: TSensorPayload) =>
                                    data.id === sensor.id
                                )
                              ].sensorCode
                            }
                            onChange={(e) => {
                              state.sensors.map((item: TSensorPayload) => {
                                if (sensor.id === item.id) {
                                  let newArr = [...state.sensors];
                                  newArr[
                                    newArr.findIndex(
                                      (data) => data.id === item.id
                                    )
                                  ].sensorCode = e.target.value
                                    .trim()
                                    .toUpperCase();
                                  dispatch({
                                    type: ACTION_TYPE.SET_SENSORS,
                                    payload: newArr,
                                  });
                                }
                              });
                              dispatch({
                                type: ACTION_TYPE.SET_ERROR_TYPE,
                                payload: ERROR_TYPE.NONE,
                              });
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <Dropdown
                            value={
                              state.sensors[
                                state.sensors.findIndex(
                                  (data: TSensorPayload) =>
                                    data.id === sensor.id
                                )
                              ].room
                            }
                            options={roomOptions}
                            onChange={(
                              dropdownItem: IDropdownItem<TRoomResponse>
                            ) => {
                              state.sensors.map((item: TSensorPayload) => {
                                if (sensor.id === item.id) {
                                  let newArr = [...state.sensors];
                                  newArr[
                                    newArr.findIndex(
                                      (data) => data.id === item.id
                                    )
                                  ].room = dropdownItem;
                                  dispatch({
                                    type: ACTION_TYPE.SET_SENSORS,
                                    payload: newArr,
                                  });
                                }
                              });
                              dispatch({
                                type: ACTION_TYPE.SET_ERROR_TYPE,
                                payload: ERROR_TYPE.NONE,
                              });
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <Dropdown
                            value={
                              state.sensors[
                                state.sensors.findIndex(
                                  (data: TSensorPayload) =>
                                    data.id === sensor.id
                                )
                              ].position
                            }
                            options={sensorPositionOptions}
                            onChange={(dropdownItem: IDropdownItem<string>) => {
                              state.sensors.map((item: TSensorPayload) => {
                                if (sensor.id === item.id) {
                                  let newArr = [...state.sensors];
                                  newArr[
                                    newArr.findIndex(
                                      (data) => data.id === item.id
                                    )
                                  ].position = dropdownItem;
                                  dispatch({
                                    type: ACTION_TYPE.SET_SENSORS,
                                    payload: newArr,
                                  });
                                }
                              });
                              dispatch({
                                type: ACTION_TYPE.SET_ERROR_TYPE,
                                payload: ERROR_TYPE.NONE,
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end items-center mt-8 space-x-1">
                <Button
                  title="Add New Sensor"
                  size="xs"
                  onClick={() => {
                    let newArr = [...state.sensors];
                    newArr.push({
                      id: randomHexString(),
                      sensorType: null,
                      ipCamera: "",
                      sensorCode: "",
                      position: null,
                      room: null,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_SENSORS,
                      payload: newArr,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>

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
        <Button
          size="xs"
          state={editDevice.isLoading ? "loading" : "active"}
          onClick={() => {
            const required = checkRequired({ dispatch, state });
            if (!required) return;

            editDevice.mutate();
          }}
          title="Edit Device"
        />
      </div>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Edit;
