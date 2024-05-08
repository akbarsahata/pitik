import { ChangeEventHandler, KeyboardEventHandler, ReactNode } from "react";

type TFile = {
  type?: "file";
  state?: "active" | "error";
  size?: "sm" | "md";
  placeholder?: string | undefined;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  value?: string | number | readonly string[] | undefined;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  className?: string | undefined;
  label?: string | undefined;
  errorMessage?: string | undefined;
  hintMessage?: string | undefined;
  accept?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  step?: string | undefined;
  onKeyDown?:
    | KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  id?: string | undefined;
  multiple?: boolean;
};

type TOther = {
  type?:
    | "text"
    | "password"
    | "email"
    | "phone"
    | "textarea"
    | "date"
    | "number"
    | "time";
  state?: "active" | "error";
  size?: "sm" | "md";
  placeholder?: string | undefined;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  value: string | number | readonly string[] | undefined;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  className?: string | undefined;
  label?: string | undefined;
  errorMessage?: string | undefined;
  hintMessage?: string | undefined;
  accept?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  step?: string | undefined;
  onKeyDown?:
    | KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  id?: string | undefined;
  multiple?: boolean;
};

type TDisabled = {
  type?:
    | "text"
    | "password"
    | "email"
    | "phone"
    | "textarea"
    | "date"
    | "number"
    | "time";
  state?: "disabled" | "disabled-error";
  size?: "sm" | "md";
  placeholder?: string | undefined;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  value: string | number | readonly string[] | undefined;
  onChange?:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  className?: string | undefined;
  label?: string | undefined;
  errorMessage?: string | undefined;
  hintMessage?: string | undefined;
  accept?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  step?: string | undefined;
  onKeyDown?:
    | KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  id?: string | undefined;
  multiple?: boolean;
};

type TTextarea = {
  type?: "textarea";
  state?: "active" | "error" | "disabled" | "disabled-error";
  size?: "sm" | "md";
  placeholder?: string | undefined;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  value: string | number | readonly string[] | undefined;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  className?: string | undefined;
  label?: string | undefined;
  errorMessage?: string | undefined;
  hintMessage?: string | undefined;
  accept?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: string | undefined;
  onKeyDown?:
    | KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  id?: string | undefined;
  multiple?: boolean;
};

export type TInput = TFile | TOther | TDisabled | TTextarea;
