import SpinnerIcon from "@icons/SpinnerIcon.svg";
import { TButton } from "./Button.type";

const Button = ({
  onClick,
  title = "Button",
  type = "primary",
  size = "md",
  state = "active",
  isAnchor = false,
  href,
  tailIcon,
  leadIcon,
  icon,
  className,
}: TButton) => {
  if (isAnchor) {
    return (
      <a
        href={state !== "active" ? undefined : href}
        onClick={state !== "active" ? () => {} : onClick}
        className={`flex flex-row items-center justify-between border ${className} ${
          type === "primary" && state === "active"
            ? "bg-primary-100 border-primary-100 text-white"
            : type === "primary" && state !== "active"
            ? "cursor-not-allowed bg-primary-100 border-primary-100 opacity-80 text-white"
            : type === "outline" && state === "active"
            ? "bg-white hover:bg-primary-100 border-primary-100 text-primary-100 hover:text-white"
            : type === "outline" && state !== "active"
            ? "cursor-not-allowed bg-white border-primary-100 text-primary-100 opacity-80"
            : type === "icon" && state === "active"
            ? "bg-primary-100 border-primary-100 text-white"
            : type === "icon" && state !== "active"
            ? "cursor-not-allowed bg-primary-100 border-primary-100 opacity-80 text-white"
            : type === "icon-outline" && state === "active"
            ? "bg-white hover:bg-primary-100 border-primary-100 text-primary-100 hover:text-white"
            : type === "icon-outline" && state !== "active"
            ? "cursor-not-allowed bg-white border-primary-100 text-primary-100 opacity-80"
            : null
        } ${
          type !== "icon" && type !== "icon-outline" && size === "xs"
            ? "py-2 px-4 text-xs rounded-md"
            : type !== "icon" && type !== "icon-outline" && size === "sm"
            ? "py-2.5 px-6 rounded-lg"
            : type !== "icon" && type !== "icon-outline" && size === "md"
            ? "py-3 px-8 rounded-lg"
            : type !== "icon" && type !== "icon-outline" && size === "lg"
            ? "py-3 px-10 text-base rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "xs"
            ? "p-2 text-xs rounded-md"
            : (type === "icon" || type === "icon-outline") && size === "sm"
            ? "p-2.5 rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "md"
            ? "p-3 rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "lg"
            ? "p-3 text-base rounded-lg"
            : null
        }`}
      >
        <div className="flex-1 flex flex-row justify-start items-center">
          {leadIcon && (
            <div className={`mr-3 ${size === "lg" ? "text-lg" : ""}`}>
              {leadIcon}
            </div>
          )}
          {(type === "icon" || type === "icon-outline") &&
          state !== "loading" ? (
            <div className={`${size === "lg" ? "text-lg" : ""}`}>{icon}</div>
          ) : (type === "icon" || type === "icon-outline") &&
            state === "loading" ? (
            <div>
              <SpinnerIcon
                className={`${
                  type === "icon-outline" ? "fill-primary-100" : "fill-white"
                } animate-spin text-transparent w-4 h-4 ${
                  size === "lg" ? "text-lg" : ""
                }`}
              />
            </div>
          ) : (
            <p className="mx-auto">{title}</p>
          )}
        </div>
        {type !== "icon" && type !== "icon-outline" && state === "loading" ? (
          <div className="ml-3">
            <SpinnerIcon
              className={`${
                type === "outline" ? "fill-primary-100" : "fill-white"
              } animate-spin text-transparent w-4 h-4 ${
                size === "lg" ? "text-lg" : ""
              }`}
            />
          </div>
        ) : (
          tailIcon && (
            <div className={`ml-3 ${size === "lg" ? "text-lg" : ""}`}>
              {tailIcon}
            </div>
          )
        )}
      </a>
    );
  } else {
    return (
      <button
        onClick={state !== "active" ? () => {} : onClick}
        className={`flex flex-row items-center justify-between border ${className} ${
          type === "primary" && state === "active"
            ? "bg-primary-100 border-primary-100 text-white"
            : type === "primary" && state !== "active"
            ? "cursor-not-allowed bg-primary-100 border-primary-100 opacity-80 text-white"
            : type === "outline" && state === "active"
            ? "bg-white hover:bg-primary-100 border-primary-100 text-primary-100 hover:text-white"
            : type === "outline" && state !== "active"
            ? "cursor-not-allowed bg-white border-primary-100 text-primary-100 opacity-80"
            : type === "icon" && state === "active"
            ? "bg-primary-100 border-primary-100 text-white"
            : type === "icon" && state !== "active"
            ? "cursor-not-allowed bg-primary-100 border-primary-100 opacity-80 text-white"
            : type === "icon-outline" && state === "active"
            ? "bg-white hover:bg-primary-100 border-primary-100 text-primary-100 hover:text-white"
            : type === "icon-outline" && state !== "active"
            ? "cursor-not-allowed bg-white border-primary-100 text-primary-100 opacity-80"
            : null
        } ${
          type !== "icon" && type !== "icon-outline" && size === "xs"
            ? "py-2 px-4 text-xs rounded-md"
            : type !== "icon" && type !== "icon-outline" && size === "sm"
            ? "py-2.5 px-6 rounded-lg"
            : type !== "icon" && type !== "icon-outline" && size === "md"
            ? "py-3 px-8 rounded-lg"
            : type !== "icon" && type !== "icon-outline" && size === "lg"
            ? "py-3 px-10 text-base rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "xs"
            ? "p-2 text-xs rounded-md"
            : (type === "icon" || type === "icon-outline") && size === "sm"
            ? "p-2.5 rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "md"
            ? "p-3 rounded-lg"
            : (type === "icon" || type === "icon-outline") && size === "lg"
            ? "p-3 text-base rounded-lg"
            : null
        }`}
      >
        <div className="flex-1 flex flex-row justify-start items-center">
          {leadIcon && (
            <div className={`mr-3 ${size === "lg" ? "text-lg" : ""}`}>
              {leadIcon}
            </div>
          )}
          {(type === "icon" || type === "icon-outline") &&
          state !== "loading" ? (
            <div className={`${size === "lg" ? "text-lg" : ""}`}>{icon}</div>
          ) : (type === "icon" || type === "icon-outline") &&
            state === "loading" ? (
            <div>
              <SpinnerIcon
                className={`${
                  type === "icon-outline" ? "fill-primary-100" : "fill-white"
                } animate-spin text-transparent w-4 h-4 ${
                  size === "lg" ? "text-lg" : ""
                }`}
              />
            </div>
          ) : (
            <p className="mx-auto">{title}</p>
          )}
        </div>
        {type !== "icon" && type !== "icon-outline" && state === "loading" ? (
          <div className="ml-3">
            <SpinnerIcon
              className={`${
                type === "outline" ? "fill-primary-100" : "fill-white"
              } animate-spin text-transparent w-4 h-4 ${
                size === "lg" ? "text-lg" : ""
              }`}
            />
          </div>
        ) : (
          tailIcon && (
            <div className={`ml-3 ${size === "lg" ? "text-lg" : ""}`}>
              {tailIcon}
            </div>
          )
        )}
      </button>
    );
  }
};

export default Button;
