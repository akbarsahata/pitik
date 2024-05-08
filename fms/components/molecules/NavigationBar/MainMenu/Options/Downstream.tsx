import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import DropdownSubItem from "@components/atoms/DropdownSubItem/DropdownSubItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import DatabaseIcon from "@icons/DatabaseIcon.svg";
import { Dropdown } from "antd";
import { useState } from "react";
import { TDownstreamOptionsContent } from "./Downstream.file";

export const DownstreamOptionsContent = ({
  className,
}: TDownstreamOptionsContent) => {
  const [subMenuShown, setSubMenuShown] = useState<"master data" | "">("");
  return (
    <div className={className}>
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
        <DropdownSubItem href="/downstream/master-data/vendor" text="Vendor" />
      </div>
    </div>
  );
};

const DesktopDownstreamOptions = () => (
  <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
    <div className="w-48 space-y-2">
      <DownstreamOptionsContent />
    </div>
  </div>
);

export const DownstreamOptions = () => {
  return (
    <Dropdown
      overlay={DesktopDownstreamOptions}
      trigger={["click"]}
      placement="bottom"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-start cursor-pointer"
      >
        <p className="font-normal hover:text-primary-100">Downstream</p>
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
