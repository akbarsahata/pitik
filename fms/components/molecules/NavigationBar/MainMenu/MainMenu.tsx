import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import DashboardIcon from "@icons/DashboardIcon.svg";
import Link from "next/link";
import { useState } from "react";
import {
  DownstreamOptions,
  DownstreamOptionsContent,
} from "./Options/Downstream";
import {
  FarmOperationOptions,
  FarmOperationOptionsContent,
} from "./Options/FarmOperation";
import { IotOptions, IotOptionsContent } from "./Options/Iot";
import { MasterOptions, MasterOptionsContent } from "./Options/Master";
import { ReportOptions, ReportOptionsContent } from "./Options/Report";

export const MobileMainMenu = () => {
  const [menuShown, setMenuShown] = useState<
    "master" | "transaction" | "report" | "iot" | "downstream" | ""
  >("");

  return (
    <div className="bg-gray-000 space-y-4 flex-1 py-4 pb-6 px-6 sm:px-8 lg:px-10 shadow-md">
      {/* Dashboard */}
      <DropdownItem leadIcon={<DashboardIcon />} title="Dashboard" href="/" />
      {/* Master */}
      <DropdownItem
        title="Master"
        tailIcon={<ChevronDownIcon />}
        onClick={() =>
          menuShown === "master" ? setMenuShown("") : setMenuShown("master")
        }
      />
      <div className={`${menuShown === "master" ? "block" : "hidden"} px-4`}>
        <MasterOptionsContent className="space-y-2" />
      </div>
      {/* Farm Operation */}
      <DropdownItem
        title="Farm Operation"
        tailIcon={<ChevronDownIcon />}
        onClick={() =>
          menuShown === "transaction"
            ? setMenuShown("")
            : setMenuShown("transaction")
        }
      />
      <div
        className={`${menuShown === "transaction" ? "block" : "hidden"} px-4`}
      >
        <FarmOperationOptionsContent className="space-y-2" />
      </div>
      {/* Report */}
      <DropdownItem
        title="Report"
        tailIcon={<ChevronDownIcon />}
        onClick={() =>
          menuShown === "report" ? setMenuShown("") : setMenuShown("report")
        }
      />
      <div className={`${menuShown === "report" ? "block" : "hidden"} px-4`}>
        <ReportOptionsContent className="space-y-2" />
      </div>
      {/* FW IoT */}
      <DropdownItem
        title="FW IoT Devices"
        tailIcon={<ChevronDownIcon />}
        onClick={() =>
          menuShown === "iot" ? setMenuShown("") : setMenuShown("iot")
        }
      />
      <div className={`${menuShown === "iot" ? "block" : "hidden"} px-4`}>
        <IotOptionsContent className="space-y-2" />
      </div>
      {/* Downstream */}
      <DropdownItem
        title="Downstream"
        tailIcon={<ChevronDownIcon />}
        onClick={() =>
          menuShown === "downstream"
            ? setMenuShown("")
            : setMenuShown("downstream")
        }
      />
      <div
        className={`${menuShown === "downstream" ? "block" : "hidden"} px-4`}
      >
        <DownstreamOptionsContent className="space-y-2" />
      </div>
    </div>
  );
};

export const DesktopMainMenu = () => {
  return (
    <div className="flex flex-row items-center justify-evenly space-x-6">
      <Link href="/">
        <div className="flex flex-row items-center justify-start cursor-pointer">
          <DashboardIcon className="text-primary-100" />
          <p className="ml-2 font-normal hover:text-primary-100">Dashboard</p>
        </div>
      </Link>
      <MasterOptions />
      <FarmOperationOptions />
      <ReportOptions />
      <IotOptions />
      <DownstreamOptions />
    </div>
  );
};
