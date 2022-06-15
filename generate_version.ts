const arg = Deno.args[0].match(/^v?(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$/);
if (arg === null) throw new Error("Invalid version format");

const version = `export const VERSION = "${arg[0]}";`

Deno.writeTextFileSync("./web/src/version.ts", version);
Deno.writeTextFileSync("./cli/version.ts", version);