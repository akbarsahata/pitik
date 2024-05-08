import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import DropdownSubItem from "@components/atoms/DropdownSubItem/DropdownSubItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import CpuIcon from "@icons/CpuIcon.svg";
import DashboardIcon from "@icons/DashboardIcon.svg";
import SurveyIcon from "@icons/SurveyIcon.svg";
import { Dropdown } from "antd";
import { useState } from "react";
import { TIotOptionsContent } from "./Iot.type";
import FileListIcon from "@icons/FileListIcon.svg";

export const IotOptionsContent = ({ className }: TIotOptionsContent) => {
  const [subMenuShown, setSubMenuShown] = useState<
    "dashboard" | "device management" | "report" | ""
  >("");
  return (
    <div className={className}>
      {/* Dashboard */}
      <DropdownItem
        leadIcon={<DashboardIcon />}
        title="FW IoT Dashboard"
        href={"/iot"}
      />
      {/* Device & Firmware Management */}
      <DropdownItem
        leadIcon={<CpuIcon />}
        title="Device Management"
        href={"/iot/climate-monitoring"}
      />
      <DropdownItem
        leadIcon={<SurveyIcon />}
        title="Task Ticketing"
        href={"/iot/task-ticketing"}
      />

      {/* Report */}
      <DropdownItem
        leadIcon={<FileListIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "report" ? "rotate-180" : ""}`}
          />
        }
        title="Report"
        onClick={() =>
          subMenuShown === "report"
            ? setSubMenuShown("")
            : setSubMenuShown("report")
        }
      />

      <div
        className={`${
          subMenuShown === "report" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem
          href="/iot/report/device-offline-tracker"
          text="Device Offline Tracker"
        />
        <DropdownSubItem
          href="/iot/report/historical-data"
          text="Historical Data"
        />
      </div>
    </div>
  );
};

const DesktopIotOptions = () => (
  <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
    <div className="w-48 space-y-2">
      <IotOptionsContent />
    </div>
  </div>
);

export const IotOptions = () => {
  return (
    <Dropdown
      overlay={DesktopIotOptions}
      trigger={["click"]}
      placement="bottom"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-start cursor-pointer"
      >
        <p className="font-normal hover:text-primary-100">FW IoT Devices</p>
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
