import { colors } from "./client_deps.ts";
import type { Plugin, ThemeConfiguration } from "./client_deps.ts";

export const theme: ThemeConfiguration = {
  "extend": {
    "colors": {
      colors,
      "dark": {
        "background": "#fcfcfc",
        "navy": "#fcfcfc",
      },
      "light": {
        "background": "#fcfcfc",
      },
    },
    "minHeight": {
      "96": "24rem",
    },
  },
} as const;

export const plugins: Record<string, Plugin | undefined> = {
  "grow": { "flex-grow": "1" },
  "snap": {
    "start": { "scroll-snap-align": "start" },
    "end": { "scroll-snap-align": "end" },
    "center": { "scroll-snap-align": "center" },
    "align-none": { "scroll-snap-align": "none" },

    "normal": { "scroll-snap-stop": "normal" },
    "always": { "scroll-snap-stop": "always" },

    "none": { "scroll-snap-type": "none" },
    "x": {
      "@defaults scroll-snap-type": {},
      "scroll-snap-type": "x var(--tw-scroll-snap-strictness)",
    },
    "y": {
      "@defaults scroll-snap-type": {},
      "scroll-snap-type": "y var(--tw-scroll-snap-strictness)",
    },
    "both": {
      "@defaults scroll-snap-type": {},
      "scroll-snap-type": "both var(--tw-scroll-snap-strictness)",
    },
    "mandatory": { "--tw-scroll-snap-strictness": "mandatory" },
    "proximity": { "--tw-scroll-snap-strictness": "proximity" },
  },
} as const;