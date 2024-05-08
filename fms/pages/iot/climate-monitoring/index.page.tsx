import MainWrapper from "@components/wrappers/Main/Main";
import { isAuthenticate } from "@services/utils/authenticate";
import { Tabs } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import Device from "./device/device.tab";
import Firmware from "./firmware/firmware.tab";

const ClimateMonitoring: NextPage = () => {
  return (
    <MainWrapper headTitle="Device Management" pageTitle="Device Management">
      <Tabs defaultActiveKey="1" className="mt-5">
        <Tabs.TabPane tab="Devices" key="1">
          <Device />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Firmware" key="2">
          <Firmware />
        </Tabs.TabPane>
      </Tabs>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default ClimateMonitoring;
