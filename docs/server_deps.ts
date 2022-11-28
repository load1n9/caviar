export * from "https://raw.githubusercontent.com/lucacasonato/fresh/main/server.ts";
export * as gfm from "https://deno.land/x/gfm@0.1.19/mod.ts";
export { virtualSheet } from "https://esm.sh/twind@0.16.16/sheets";
const link =
  `https://raw.githubusercontent.com/highlightjs/highlight.js/main/src/styles/atom-one-dark.css`;
export const css = await fetch(link).then((file) => file.text());
