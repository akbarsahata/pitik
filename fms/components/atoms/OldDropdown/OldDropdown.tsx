import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import { Dropdown as AntDropdown } from "antd";
import { TDropdown } from "./OldDropdown.type";

const Dropdown = ({
  title,
  leadIcon,
  label,
  size = "md",
  state = "active",
  className,
  menu,
  placement = "bottomLeft",
  errorMessage = "This is an error message",
  noWrap = true,
  type = "click",
  placeholder = "Input here",
  inputValue,
  onInputChange,
  onInputKeyDown,
}: TDropdown) => {
  return (
    <div>
      {label && <p className="text-md mb-1 ml-1 text-gray-500">{label}</p>}
      <AntDropdown
        disabled={state === "disabled" ? true : false}
        overlay={menu}
        trigger={["click"]}
        placement={placement}
      >
        <div
          className={`${
            state === "disabled"
              ? "cursor-not-allowed bg-disabled"
              : "cursor-pointer"
          } bg-white border ${
            state === "error" ? "border-red-500" : "border-gray-300"
          } flex-1 flex flex-row items-center justify-between outline-none text-sm ${
            leadIcon ? "pl-1" : "pl-3"
          } ${
            size === "sm" && type == "click"
              ? "py-2 pr-2"
              : size !== "sm" && type == "click"
              ? "py-3 pr-3"
              : size === "sm" && type != "click"
              ? "pr-2"
              : size !== "sm" && type != "click"
              ? "pr-3"
              : null
          } rounded-lg ${className}`}
        >
          <div className="flex-1 flex flex-row items-center justify-start">
            {leadIcon && (
              <div
                className={`${
                  size === "sm" ? "py-1.5 pl-2 pr-3" : "px-3"
                } rounded-full text-gray-500`}
              >
                {leadIcon}
              </div>
            )}
            {type === "input" ? (
              <input
                type="text"
                placeholder={placeholder}
                disabled={state === "disabled" ? true : false}
                value={inputValue}
                onChange={onInputChange}
                onKeyDown={onInputKeyDown}
                className={`bg-white placeholder:text-black outline-none flex-1 ${
                  size === "sm" ? "my-2 mr-2" : "my-3 mr-3"
                }`}
              />
            ) : (
              <p className={`${noWrap ? "whitespace-nowrap" : ""}`}>{title}</p>
            )}
          </div>
          <ChevronDownIcon className="ml-4" />
        </div>
      </AntDropdown>
      {state === "error" ? (
        <p className="text-md mb-1 ml-1 text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default Dropdown;
