import { genHelp, genPlugin, genProject, genScene } from "./commands.ts";

switch (Deno.args[0]) {
  case "generate": {
    switch (Deno.args[1]) {
      case "plugin": {
        await genPlugin();
        break;
      }
      case "scene": {
        await genScene();
        break;
      }
      default: {
        await genProject();
        break;
      }
    }
    break;
  }
  default: {
    genHelp();
    break;
  }
}
