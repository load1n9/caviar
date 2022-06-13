import {
  Confirm,
  Input,
  Number,
} from "https://deno.land/x/cliffy@v0.20.1/prompt/mod.ts";
import { createScene } from "./structs/Scene.ts";
import { createWorld } from "./structs/World.ts";
import { HTML } from "./structs/html.ts";
import { VERSION } from "./version.ts";

export const genScene = async () => {
  const name: string = await Input.prompt({
    message: "Scene name: ",
  });
  const web: boolean = await Confirm.prompt({
    message: "Web Project? ",
  });
  const content = createScene(name, web);
  await Deno.writeTextFile(
    `./src/plugins/${name}.${web ? "js" : "ts"}`,
    content,
  );
};

export const genHelp = () => {
  console.log(`
    Caviar v${VERSION}
    Usage: caviar [command] [options]
    
    Commands:
        generate [type] 
        help
    
    Options:
        project   generates a new project 
        plugin    generates a new plugin
        scene    generates a new scene
`);
};

export const genPlugin = async () => {
  const name: string = await Input.prompt({
    message: "Plugin name: ",
  });
  const web: boolean = await Confirm.prompt({
    message: "Web Project? ",
  });
  const content = `import { World, Plugin } from  ${
    web
      ? `"https://deno.land/x/caviar@${VERSION}/web/dist/mod.js"`
      : `"https://deno.land/x/caviar@${VERSION}/mod.ts"`
  };
  export class ${name} extends Plugin {
      constructor(world${web ? "" : ": World"}) {
          super(world);
      }
  }`;
  try {
    await Deno.mkdir("src/plugins", { recursive: true });
    // deno-lint-ignore no-empty
  } catch {}
  await Deno.writeTextFile(
    `./src/plugins/${name}.${web ? "js" : "ts"}`,
    content,
  );
};

export const genProject = async () => {
  const name: string = await Input.prompt({
    message: "Project name: ",
  });
  const title: string = await Input.prompt({
    message: "Window title: ",
  });
  const width: number = await Number.prompt({
    message: "Window width: ",
  });
  const height: number = await Number.prompt({
    message: "Window height: ",
  });
  const resizable: boolean = await Confirm.prompt({
    message: "Window resizable: ",
  });
  const web: boolean = await Confirm.prompt({
    message: "Web Project? ",
  });
  const boot: string = createScene("Boot", web);
  const content = createWorld(name, title, width, height, resizable, web);
  await Deno.mkdir(`./${name}/src/scenes`, { recursive: true });
  await Deno.writeTextFile(
    `./${name}/src/scenes/Boot.${web ? "js" : "ts"}`,
    boot,
  );
  await Deno.writeTextFile(`./${name}/main.${web ? "js" : "ts"}`, content);
  if (web) {
    await Deno.writeTextFile(`./${name}/index.html`, HTML);
  }
};
