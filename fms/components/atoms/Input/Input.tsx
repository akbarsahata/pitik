import { useState } from "react";
import { TInput } from "./Input.type";

const Input = ({
  placeholder = "Input here",
  state = "active",
  type = "text",
  leadIcon,
  tailIcon,
  value,
  onChange,
  className,
  label,
  errorMessage = "This is an error message",
  size = "md",
  onKeyDown,
  accept,
  min,
  max,
  step,
  id,
  multiple,
  hintMessage,
}: TInput) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  return (
    <div
      className={`${
        type == "textarea" ? "h-full" : ""
      } flex flex-col items-start justify-start`}
    >
      {label && <p className="text-md mb-1 ml-1 text-gray-500">{label}</p>}
      <div
        className={`${className} ${
          type == "textarea" ? "h-full" : ""
        } flex-1 flex flex-row items-center justify-between rounded-lg border ${
          state === "error" ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div
          className={`${
            type == "textarea" ? "h-full" : ""
          } w-full flex flex-1 flex-row items-center justify-start`}
        >
          {leadIcon && (
            <div
              className={`${
                size === "sm" ? "py-2 pl-3 pr-2" : "p-3"
              } rounded-full text-gray-500`}
            >
              {leadIcon}
            </div>
          )}
          {type === "textarea" ? (
            <textarea
              className={`${className} ${
                state === "disabled"
                  ? "!cursor-not-allowed text-gray-500"
                  : null
              } flex-1 outline-none text-sm ${leadIcon ? "pl-1" : "pl-3"} ${
                tailIcon ? "" : "pr-3"
              } ${size === "sm" ? "pt-2 -pb-2" : "pt-3 -pb-3"} rounded-lg`}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              maxLength={max as number}
              disabled={
                state === "disabled" || state === "disabled-error"
                  ? true
                  : false
              }
            />
          ) : (
            <input
              className={`${className} ${
                state === "disabled"
                  ? "cursor-not-allowed bg-disabled text-gray-500"
                  : "cursor-pointer"
              } ${state === "disabled" ? "!cursor-not-allowed" : null} ${
                type === "file" || type === "date"
                  ? "bg-white cursor-pointer placeholder:text-gray-500"
                  : "cursor-text"
              } flex-1 outline-none text-sm ${leadIcon ? "pl-1" : "pl-3"} ${
                type === "password" || tailIcon ? "" : "pr-3"
              } ${size === "sm" ? "py-2" : "py-3"} rounded-lg`}
              id={id}
              multiple={multiple}
              disabled={
                state === "disabled" || state === "disabled-error"
                  ? true
                  : false
              }
              min={type === "number" && !min ? "0" : min}
              max={max}
              step={step}
              accept={accept}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              type={`${
                type === "text"
                  ? "text"
                  : type === "email"
                  ? "email"
                  : type === "password" && isPasswordHidden
                  ? "password"
                  : type === "password" && !isPasswordHidden
                  ? "text"
                  : type === "phone"
                  ? "tel"
                  : type === "file"
                  ? "file"
                  : type === "date"
                  ? "date"
                  : type === "number"
                  ? "number"
                  : type === "time"
                  ? "time"
                  : "text"
              }`}
            />
          )}
        </div>
        {type === "password" ? (
          <div
            onClick={() => setIsPasswordHidden(!isPasswordHidden)}
            className={`${
              size === "sm" ? "py-2 pr-3 pl-2" : "p-3"
            } cursor-pointer rounded-full ${
              state === "error" ? "text-red-500" : ""
            }`}
          >
            {isPasswordHidden ? <EyeIconOff /> : <EyeIconOn />}
          </div>
        ) : (
          tailIcon && (
            <div
              className={`${
                size === "sm" ? "py-2 pr-3 pl-2" : "p-3"
              } rounded-full`}
            >
              {tailIcon}
            </div>
          )
        )}
      </div>
      {state === "error" || state === "disabled-error" ? (
        <p className="text-md mb-1 ml-1 text-sm font-light text-red-500">
          {errorMessage}
        </p>
      ) : hintMessage ? (
        <p className="text-md mb-1 ml-1 text-sm font-light text-gray-700">
          {hintMessage}
        </p>
      ) : null}
    </div>
  );
};

export default Input;

const EyeIconOn = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="currentColor"
        d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      />
    </svg>
  );
};

const EyeIconOff = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="currentColor"
        d="M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z"
      />
    </svg>
  );
};
