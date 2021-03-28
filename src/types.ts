import React, { ClassAttributes, DOMAttributes } from "react";

export type BaseTheme = { [key: string]: any };

export type CharmantProps<T> = {
  children?: React.ReactNode;
} & ClassAttributes<T> &
  DOMAttributes<T>;
