export * from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import { IS_BROWSER } from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import {
  apply,
  Plugin,
  setup,
  ThemeConfiguration,
  tw,
} from "https://esm.sh/twind@0.16.16";
export { apply, setup, tw };
export type { Plugin, ThemeConfiguration };
export { default as hljs } from "https://jspm.dev/highlight.js@11.0.1";
export * as config from "./tw_config.ts";
export * as colors from "https://cdn.esm.sh/v73/twind@0.16.16/es2021/colors.js";
if (IS_BROWSER) {
  setup({});
}
