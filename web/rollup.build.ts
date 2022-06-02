import { rollup } from "https://deno.land/x/drollup@2.58.0+0.20.0/mod.ts";
import { options } from "./rollup.config.ts";
import { bold, green } from "https://deno.land/std@0.110.0/fmt/colors.ts";

const bundle = await rollup(options);
await bundle.write(options.output);
await bundle.close();
console.log(bold(green("🚀 Build complete")));
