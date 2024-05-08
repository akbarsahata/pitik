import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import DropdownSubItem from "@components/atoms/DropdownSubItem/DropdownSubItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import ContractIcon from "@icons/ContractIcon.svg";
import DatabaseIcon from "@icons/DatabaseIcon.svg";
import HomeSmileIcon from "@icons/HomeSmileIcon.svg";
import StackIcon from "@icons/StackIcon.svg";
import TaskIcon from "@icons/TaskIcon.svg";
import UserIcon from "@icons/UserIcon.svg";
import { Dropdown } from "antd";
import { useState } from "react";
import { TMasterOptionsContent } from "./Master.type";

export const MasterOptionsContent = ({ className }: TMasterOptionsContent) => {
  const [subMenuShown, setSubMenuShown] = useState<
    | "user"
    | "master data"
    | "farm data"
    | "library"
    | "preset"
    | "contract library"
    | ""
  >("");
  return (
    <div className={className}>
      {/* User */}
      <DropdownItem
        leadIcon={<UserIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "user" ? "rotate-180" : ""}`}
          />
        }
        title="User"
        onClick={() =>
          subMenuShown === "user"
            ? setSubMenuShown("")
            : setSubMenuShown("user")
        }
      />

      <div
        className={`${
          subMenuShown === "user" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem href="/master/user/internal" text="Internal" />
        <DropdownSubItem href="/master/user/owner" text="Owner" />
        <DropdownSubItem href="/master/user/poultry" text="Poultry" />
      </div>

      {/* Master Data */}
      <DropdownItem
        leadIcon={<DatabaseIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "master data" ? "rotate-180" : ""}`}
          />
        }
        title="Master Data"
        onClick={() =>
          subMenuShown === "master data"
            ? setSubMenuShown("")
            : setSubMenuShown("master data")
        }
      />

      <div
        className={`${
          subMenuShown === "master data" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem
          href="/master/master-data/chicken-strain"
          text="Chicken Strain"
        />
        <DropdownSubItem href="/master/master-data/variable" text="Variable" />
        <DropdownSubItem
          href="/master/master-data/coop-type"
          text="Coop Type"
        />
      </div>

      {/* Contract Library */}
      <DropdownItem
        leadIcon={<ContractIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${
              subMenuShown === "contract library" ? "rotate-180" : ""
            }`}
          />
        }
        title="Contract Library"
        onClick={() =>
          subMenuShown === "contract library"
            ? setSubMenuShown("")
            : setSubMenuShown("contract library")
        }
      />

      <div
        className={`${
          subMenuShown === "contract library" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem
          href="/master/contract-library/contract"
          text="Contract"
        />
      </div>

      {/* Farm Data */}
      <DropdownItem
        leadIcon={<HomeSmileIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "farm data" ? "rotate-180" : ""}`}
          />
        }
        title="Farm Data"
        onClick={() =>
          subMenuShown === "farm data"
            ? setSubMenuShown("")
            : setSubMenuShown("farm data")
        }
      />

      <div
        className={`${
          subMenuShown === "farm data" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem href="/master/farm-data/farm" text="Farm" />
        <DropdownSubItem href="/master/farm-data/building" text="Building" />
        <DropdownSubItem href="/master/farm-data/room" text="Room" />
        <DropdownSubItem href="/master/farm-data/coop" text="Coop" />
      </div>

      {/* Library */}
      <DropdownItem
        leadIcon={<TaskIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "library" ? "rotate-180" : ""}`}
          />
        }
        title="Library"
        onClick={() =>
          subMenuShown === "library"
            ? setSubMenuShown("")
            : setSubMenuShown("library")
        }
      />

      <div
        className={`${
          subMenuShown === "library" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        {/* TODO: Uncomment these lines of code to activate the page, and delete this comment to mark it done */}
        <DropdownSubItem href="/master/library/task" text="Task" />
        {/* <DropdownSubItem href="/master/library/alert" text="Alert" /> */}
        <DropdownSubItem href="/master/library/target" text="Target" />
      </div>

      {/* Preset */}
      <DropdownItem
        leadIcon={<StackIcon />}
        tailIcon={
          <ChevronDownIcon
            className={`${subMenuShown === "preset" ? "rotate-180" : ""}`}
          />
        }
        title="Preset"
        onClick={() =>
          subMenuShown === "preset"
            ? setSubMenuShown("")
            : setSubMenuShown("preset")
        }
      />

      <div
        className={`${
          subMenuShown === "preset" ? "grid" : "hidden"
        } grid-flow-row auto-rows-min`}
      >
        <DropdownSubItem href="/master/preset/task" text="Task" />
        <DropdownSubItem href="/master/preset/alert" text="Alert" />
      </div>
    </div>
  );
};

const DesktopMasterOptions = () => {
  return (
    <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
      <div className="w-48 space-y-2">
        <MasterOptionsContent />
      </div>
    </div>
  );
};

export const MasterOptions = () => {
  return (
    <Dropdown
      overlay={() => <DesktopMasterOptions />}
      trigger={["click"]}
      placement="bottom"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-start cursor-pointer"
      >
        <p className="font-normal hover:text-primary-100">Master</p>
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
