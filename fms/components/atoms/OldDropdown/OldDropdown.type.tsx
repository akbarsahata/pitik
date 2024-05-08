import {
  ChangeEventHandler,
  JSXElementConstructor,
  KeyboardEventHandler,
  ReactElement,
  ReactNode,
} from "react";

type TInput = {
  menu: ReactElement<any, string | JSXElementConstructor<any>>;
  type?: "input";
  placement?:
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "top"
    | "bottom"
    | undefined;
  state?: "not-selected" | "active" | "error" | "disabled";
  size?: "sm" | "md";
  title?: string | undefined;
  label?: string | undefined;
  leadIcon?: ReactNode;
  className?: string | undefined;
  errorMessage?: string | undefined;
  noWrap?: boolean;
  placeholder: string | undefined;
  inputValue: string | undefined;
  onInputChange: ChangeEventHandler<HTMLInputElement> | undefined;
  onInputKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
};

type TClick = {
  menu: ReactElement<any, string | JSXElementConstructor<any>>;
  type?: "click";
  placement?:
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "top"
    | "bottom"
    | undefined;
  state?: "not-selected" | "active" | "error" | "disabled";
  size?: "sm" | "md";
  title: string | undefined;
  label?: string | undefined;
  leadIcon?: ReactNode;
  className?: string | undefined;
  errorMessage?: string | undefined;
  noWrap?: boolean;
  placeholder?: string;
  inputValue?: string | undefined;
  onInputChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  onInputKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
};

export type TDropdown = TInput | TClick;
