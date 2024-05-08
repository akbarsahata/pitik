import { MouseEventHandler, ReactNode } from "react";

type ButtonIcon = {
  onClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> | undefined;
  isAnchor?: false;
  title?: string;
  type?: "icon" | "icon-outline";
  size?: "xs" | "sm" | "md" | "lg";
  state?: "active" | "disabled" | "loading";
  tailIcon?: ReactNode;
  leadIcon?: ReactNode;
  href?: string | undefined;
  icon: ReactNode;
  className?: string | undefined;
};

type ButtonNormal = {
  onClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> | undefined;
  isAnchor?: false;
  title: string;
  type?: "primary" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  state?: "active" | "disabled" | "loading";
  tailIcon?: ReactNode;
  leadIcon?: ReactNode;
  href?: string | undefined;
  icon?: ReactNode;
  className?: string | undefined;
};

type AnchorIcon = {
  onClick?:
    | MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    | undefined;
  isAnchor?: true;
  title?: string;
  type?: "icon" | "icon-outline";
  size?: "xs" | "sm" | "md" | "lg";
  state?: "active" | "disabled" | "loading";
  tailIcon?: ReactNode;
  leadIcon?: ReactNode;
  href: string | undefined;
  icon: ReactNode;
  className?: string | undefined;
};

type AnchorNormal = {
  onClick?:
    | MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    | undefined;
  isAnchor?: true;
  title: string;
  type?: "primary" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  state?: "active" | "disabled" | "loading";
  tailIcon?: ReactNode;
  leadIcon?: ReactNode;
  href: string | undefined;
  icon?: ReactNode;
  className?: string | undefined;
};

export type TButton = ButtonIcon | ButtonNormal | AnchorIcon | AnchorNormal;
