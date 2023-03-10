import { VERSION } from "../version.ts";

export const createWorld = (
  name: string,
  title: string,
  width: number,
  height: number,
  resizable: boolean,
  web = false,
) =>
  `import { World } from ${
    web
      ? `"https://deno.land/x/caviar@${VERSION}/web/dist/mod.js"`
      : `"https://deno.land/x/caviar@${VERSION}/mod.ts"`
  };
import { Boot } from "./src/scenes/Boot.${web ? "js" : "ts"}";

const ${name} = new World({
  title: "${title}",
  width: ${width},
  height: ${height},
  resizable: ${resizable},
}, [Boot]);

await ${name}.start();`;
