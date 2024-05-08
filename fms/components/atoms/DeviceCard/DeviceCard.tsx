import CheckDoubleIcon from "@icons/CheckDoubleIcon.svg";
import CpuIcon from "@icons/CpuIcon.svg";
import ErrorWarningIcon from "@icons/ErrorWarningIcon.svg";
import QuestionIcon from "@icons/QuestionIcon.svg";
import ShutDownIcon from "@icons/ShutDownIcon.svg";
import TimerIcon from "@icons/TimerIcon.svg";
import WifiIcon from "@icons/WifiIcon.svg";
import WifiOfflineIcon from "@icons/WifiOfflineIcon.svg";
import { TDeviceCard } from "./DeviceCard.input";

const DeviceCard = ({ type = "online", onClick, total, text }: TDeviceCard) => {
  return (
    <div
      onClick={onClick}
      className="hover:cursor-pointer border rounded-lg px-4 py-3 flex-col"
    >
      <div className="justify-between flex flex-row">
        <div
          className={`${
            type === "online"
              ? "bg-green-200 text-green-700"
              : type === "offline"
              ? "bg-red-200 text-red-700"
              : type === "inactive"
              ? "bg-zinc-300 text-gray-700"
              : type === "open"
              ? "bg-red-200 text-red-700"
              : type === "onMaintenance"
              ? "bg-orange-200 text-orange-700"
              : type === "resolved"
              ? "bg-green-200 text-green-700"
              : type === "others"
              ? "bg-gray-200 text-gray-700"
              : "bg-primary-20 text-red-400"
          } px-2 py-1 rounded`}
        >
          {type === "online" ? (
            <WifiIcon className="text-green-700 text-lg" />
          ) : type === "offline" ? (
            <WifiOfflineIcon className="text-red-700 text-lg" />
          ) : type === "inactive" ? (
            <ShutDownIcon className="text-zinc-700 text-lg" />
          ) : type === "open" ? (
            <ErrorWarningIcon className="text-red-700 text-lg" />
          ) : type === "onMaintenance" ? (
            <TimerIcon className="text-orange-700 text-lg" />
          ) : type === "resolved" ? (
            <CheckDoubleIcon className="text-green-700 text-lg" />
          ) : type === "others" ? (
            <QuestionIcon className="text-gray-700 text-lg" />
          ) : (
            <CpuIcon className="text-primary-100 text-lg" />
          )}
        </div>
        {type !== "info" && (
          <div
            className={`${
              type === "online"
                ? "bg-green-200 text-green-700"
                : type === "offline"
                ? "bg-red-200 text-red-700"
                : type === "inactive"
                ? "bg-zinc-300 text-zinc-700"
                : type === "open"
                ? "text-red-700"
                : type === "onMaintenance"
                ? "text-orange-700"
                : type === "resolved"
                ? "text-green-700"
                : type === "others"
                ? "text-gray-700"
                : "bg-orange-200 text-orange-700"
            } px-3 py-1 rounded`}
          >
            <p>
              {type === "online"
                ? "Online"
                : type === "offline"
                ? "Offline"
                : type === "inactive"
                ? "Inactive"
                : type === "open"
                ? "Open"
                : type === "onMaintenance"
                ? "On Maintenance"
                : type === "resolved"
                ? "Resolved"
                : type === "others"
                ? "Others"
                : "Info"}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start items-start mt-8">
        <p className="text-gray-400 text-sm">{text}</p>
        <p
          className={`${
            type === "online"
              ? "text-green-500"
              : type === "offline"
              ? "text-red-500"
              : type === "inactive"
              ? "text-zinc-600"
              : type === "open"
              ? "text-red-500"
              : type === "onMaintenance"
              ? "text-orange-500"
              : type === "resolved"
              ? "text-green-500"
              : type === "others"
              ? "text-gray-500"
              : "text-orange-500"
          } text-6xl font-medium`}
        >
          {total || 0}
        </p>
      </div>
    </div>
  );
};

export default DeviceCard;
