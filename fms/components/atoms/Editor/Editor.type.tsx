import { EventHandler } from "react";

export type TEditor = {
  className?: string | undefined;
  onChange: EventHandler<any> | undefined;
  uploadFolder: string;
  label?: string | undefined;
  initialValue?: string | undefined;
};
