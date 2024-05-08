import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import ClockIcon from "@icons/ClockIcon.svg";
import HarvestIcon from "@icons/HarvestIcon.svg";
import { Dropdown } from "antd";
import { TReportOptionsContent } from "./Report.type";

export const ReportOptionsContent = ({ className }: TReportOptionsContent) => {
  return (
    <div className={className}>
      {/* Daily Performance */}
      <DropdownItem
        leadIcon={<ClockIcon />}
        title="Daily Performance"
        href={"/report/daily-performance"}
      />
      <DropdownItem
        leadIcon={<HarvestIcon />}
        title="Harvest"
        href={"/report/harvest"}
      />
      {/* TODO: Uncomment these lines of code to activate the page, import the icons and delete this comment to mark it done */}
      {/* <DropdownItem
        leadIcon={<TaskIcon />}
        title="Task Ticket"
        href={"/report/task-ticket"}
      />
      <DropdownItem
        leadIcon={<AlertIcon />}
        title="Alert Triggered"
        href={"/report/alert-triggered"}
      />
      <DropdownItem
        leadIcon={<HeatmapIcon />}
        title="Heatmap"
        href={"/report/heatmap"}
      />
      
      <DropdownItem
        leadIcon={<IssueIcon />}
        title="Issue"
        href={"/report/issue"}
      />
      <DropdownItem
        leadIcon={<CycleIcon />}
        title="Farming Cycle"
        href={"/report/farming-cycle"}
      />
      <DropdownItem
        leadIcon={<SummaryIcon />}
        title="Summary"
        href={"/report/summary"}
      /> */}
    </div>
  );
};

const DesktopReportOptions = () => (
  <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
    <div className="w-48 space-y-2">
      <ReportOptionsContent />
    </div>
  </div>
);

export const ReportOptions = () => {
  return (
    <Dropdown
      overlay={DesktopReportOptions}
      trigger={["click"]}
      placement="bottom"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center justify-start cursor-pointer"
      >
        <p className="font-normal hover:text-primary-100">Report</p>
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
