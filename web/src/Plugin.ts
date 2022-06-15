import { World } from "./World.ts";

export abstract class Plugin {
  name = "";
  description = "";
  version = "";
  author = "";
  constructor(_world: World) {}
  onStart(): void {}
  static onUpdate(): void {}
}
