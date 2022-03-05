import { build, Plugin, PluginBuild } from "https://deno.land/x/esbuild@v0.14.25/mod.js"

class ResolveDeps implements Plugin {
    name = "Resolve Deps";
    setup(build: PluginBuild) {
        build.onResolve({ filter: /deps.ts/ }, _args => {
            const path = `${Deno.cwd()}/web/polyfill.js`
            return { path }
        })
    }
}

const resolveDeps = new ResolveDeps()

await build({
    outfile: "./web/caviar.js",
    entryPoints: ["./mod.ts"],
    bundle: true,
    plugins: [resolveDeps]
})

const file = Deno.readFileSync("./web/caviar.js")
const encoded = new TextEncoder().encode(`// deno-lint-ignore-file\n`)
const output = new Uint8Array(file.length + encoded.length)
output.set(encoded, 0)
output.set(file, encoded.length)
Deno.writeFileSync("./web/caviar.js", output)

Deno.exit()