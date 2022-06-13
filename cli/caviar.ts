import { genHelp, genPlugin, genProject, genScene } from "./commands.ts";

switch (Deno.args[0]) {
  case "generate": {
    if (Deno.args[1] === "plugin") {
      await genPlugin();
    } else if (Deno.args[1] === "scene") {
      await genScene();
    } else {
      await genProject();
    }
    break;
  }
  default: {
    genHelp();
    break;
  }
}
