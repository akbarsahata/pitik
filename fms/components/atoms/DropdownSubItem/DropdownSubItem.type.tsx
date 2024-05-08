import { MouseEventHandler } from "react";

export type TDropdownSubItem = {
  text: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};
