import { MouseEventHandler } from "react";

export type TDeviceCard = {
  type?:
    | "online"
    | "offline"
    | "inactive"
    | "info"
    | "open"
    | "onMaintenance"
    | "resolved"
    | "others";
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  total: number | string;
  text: string;
};
