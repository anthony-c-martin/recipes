import { useEffect, useState } from "react";

type colorMode = "dark" | "light";

export function getColorMode(): colorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}