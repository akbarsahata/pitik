import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import CycleIcon from "@icons/CycleIcon.svg";
import { Dropdown } from "antd";
import { TFarmOperationOptionsContent } from "./FarmOperation.type";

export const FarmOperationOptionsContent = ({
  className,
}: TFarmOperationOptionsContent) => {
  return (
    <div className={className}>
      {/* Farming Cycle */}
      <DropdownItem
        leadIcon={<CycleIcon />}
        title="Farming Cycle"
        href={"/farm-operation/farming-cycle"}
      />
      {/* TODO: Uncomment these lines of code to activate the page, and delete this comment to mark it done */}
      {/* <DropdownItem
        leadIcon={<HarvestIcon />}
        title="Harvest"
        href={"/farm-operation/harvest"}
      />
      <DropdownItem
        leadIcon={<IssueIcon />}
        title="Issue"
        href={"/farm-operation/issue"}
      /> */}
    </div>
  );
};

const DesktopFarmOperationOptions = () => (
  <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
    <div className="w-48 space-y-2">
      <FarmOperationOptionsContent />
    </div>
  </div>
);

export const FarmOperationOptions = () => {
  return (
    <Dropdown
      overlay={DesktopFarmOperationOptions}
      trigger={["click"]}
      placement="bottom"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-start cursor-pointer"
      >
        <p className="font-normal hover:text-primary-100">Farm Operation</p>
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
