import Accordion from "@components/atoms/Accordion/Accordion";
import DeviceCard from "@components/atoms/DeviceCard/DeviceCard";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import MainWrapper from "@components/wrappers/Main/Main";
import RemoteControlIcon from "@icons/RemoteControlIcon.svg";
import RemoteIcon from "@icons/RemoteIcon.svg";
import SmartConventronIcon from "@icons/SmartConventronIcon.svg";
import WebcamIcon from "@icons/WebcamIcon.svg";
import { getDevicesSensor } from "@services/api";
import { isAuthenticate } from "@services/utils/authenticate";
import { TDevicesSensorResponse, TGetManyResponse } from "@type/response.type";
import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Dispatch, ReactNode, useReducer } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { ACTIONS, ACTION_TYPE, store, TStore } from "./dashboard.constants";
import DashboardModal from "./dashboard.modal";
import { reducer } from "./dashboard.reducer";

const IotDashboard: NextPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, store);

  const deviceData: UseQueryResult<
    { data: TGetManyResponse<TDevicesSensorResponse[]> },
    AxiosError
  > = useQuery(
    ["areaData"],
    async () => await getDevicesSensor({ page: 1, limit: 0 }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_DATA,
          payload: deviceList,
        });
      },
    }
  );

  if (deviceData.isLoading || deviceData.isFetching) return <Loading />;
  if (deviceData.isError) return <Error router={router} />;

  return (
    <MainWrapper headTitle="FW IoT Dashboard" pageTitle="FW IoT Dashboard">
      <DashboardModal
        modalTitle={state.modalTitle}
        state={state}
        dispatch={dispatch}
      />
      <IotDashboardAccordion
        icon={<RemoteControlIcon className="text-lg mr-2" />}
        title="Smart Monitoring"
        deviceType="SMART_MONITORING"
        state={state}
        dispatch={dispatch}
        defaultOpen={true}
      />
      <IotDashboardAccordion
        icon={<RemoteIcon className="text-lg mr-2" />}
        title="Smart Controller"
        deviceType="SMART_CONTROLLER"
        state={state}
        dispatch={dispatch}
        defaultOpen={false}
      />
      <IotDashboardAccordion
        icon={<WebcamIcon className="text-lg mr-2" />}
        title="Smart Camera"
        deviceType="SMART_CAMERA"
        state={state}
        dispatch={dispatch}
        defaultOpen={false}
      />
      <IotDashboardAccordion
        icon={<SmartConventronIcon className="text-lg mr-2" />}
        title="Smart Conventron"
        deviceType="SMART_CONVENTRON"
        state={state}
        dispatch={dispatch}
        defaultOpen={false}
      />
    </MainWrapper>
  );
};

const IotDashboardAccordion = ({
  title,
  icon,
  deviceType,
  state,
  dispatch,
  defaultOpen = true,
}: {
  title: string;
  icon: ReactNode;
  deviceType: string;
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
  defaultOpen?: boolean;
}) => {
  return (
    <div className="w-full mx-auto">
      <Accordion
        title={
          <div className="flex flex-row items-center justify-start">
            {icon}
            <span>{title}</span>
          </div>
        }
        defaultOpen={defaultOpen}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-y-4 md:space-y-0 md:gap-4 lg:space-y-0 ">
          <DeviceCard
            text="Devices"
            type="online"
            total={
              state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType &&
                  device.isOnline === true &&
                  device.status === true
              ).length
            }
            onClick={() => {
              const onlineDevice = state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType &&
                  device.isOnline === true &&
                  device.status === true
              );
              dispatch({
                type: ACTION_TYPE.SET_FILTERED_DEVICE_DATA,
                payload: onlineDevice,
              });
              dispatch({
                type: ACTION_TYPE.SET_MODAL_TITLE,
                payload: `Device List - ${deviceType.replace(/_/g, " ")}`,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE,
                payload: true,
              });
            }}
          />
          <DeviceCard
            text="Devices"
            type="offline"
            total={
              state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType &&
                  device.isOnline === false &&
                  device.status === true
              ).length
            }
            onClick={() => {
              const offlineDevice = state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType &&
                  device.isOnline === false &&
                  device.status === true
              );
              dispatch({
                type: ACTION_TYPE.SET_MODAL_TITLE,
                payload: `Device List - ${deviceType.replace(/_/g, " ")}`,
              });
              dispatch({
                type: ACTION_TYPE.SET_FILTERED_DEVICE_DATA,
                payload: offlineDevice,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE,
                payload: true,
              });
            }}
          />
          <DeviceCard
            text="Devices"
            type="inactive"
            total={
              state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType && device.status === false
              ).length
            }
            onClick={() => {
              const inactiveDevice = state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType && device.status === false
              );
              dispatch({
                type: ACTION_TYPE.SET_MODAL_TITLE,
                payload: `Device List - ${deviceType.replace(/_/g, " ")}`,
              });
              dispatch({
                type: ACTION_TYPE.SET_FILTERED_DEVICE_DATA,
                payload: inactiveDevice,
              });
              dispatch({
                type: ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE,
                payload: true,
              });
            }}
          />
          <DeviceCard
            text="Total Device Registered"
            type="info"
            total={
              state.deviceData.filter(
                (device: TDevicesSensorResponse) =>
                  device.deviceType === deviceType
              ).length
            }
          />
        </div>
      </Accordion>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default IotDashboard;
