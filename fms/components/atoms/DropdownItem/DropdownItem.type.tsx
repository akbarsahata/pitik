import { MouseEventHandler, ReactNode } from "react";

export type TDropdownItem = {
  title: string;
  href?: string;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  className?: string | undefined;
};
