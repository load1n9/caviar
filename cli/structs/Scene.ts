import { VERSION } from "../version.ts";

export const createScene = (name: string, web = false) =>
  `import { Scene } from ${
    web
      ? `"https://deno.land/x/caviar@${VERSION}/web/dist/mod.js"`
      : `"https://deno.land/x/caviar@${VERSION}/mod.ts"`
  };

export class ${name} extends Scene {
  setup() {
  }

  update() {
  }
}`;
