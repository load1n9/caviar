import * as esbuild from "npm:esbuild@0.20.2";
// import * as esbuild from "https://deno.land/x/esbuild@0.20.2/wasm.js";

import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";

const result = await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./mod.ts"],
    outfile: "./web/dist/mod.js",
    bundle: true,
    format: "esm",
});

if (result.errors.length > 0) {
    console.error(result.errors);
    Deno.exit(1);
}

if (result.warnings.length > 0) {
    console.warn(result.warnings);
}

esbuild.stop();
