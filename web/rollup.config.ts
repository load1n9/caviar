import { dirname } from "https://deno.land/std@0.110.0/path/mod.ts";

export const options = {
  input: new URL("./mod.ts", `${dirname(import.meta.url)}/`).href,
  output: {
    dir: "./dist",
    format: "es" as const,
    sourcemap: true,
  },
  watch: {
    include: "./**",
    clearScreen: true,
  },
  onwarn: () => {},
};
