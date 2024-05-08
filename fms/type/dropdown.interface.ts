import { ReactNode } from "react";

export interface IDropdownItem<T> {
  label: ReactNode;
  value: T;
}
