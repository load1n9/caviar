import type { World } from "./World.ts";

export abstract class Plugin {
  name = "";
  description = "";
  version = "";
  author = "";
  constructor(_world: World) {}
  onStart(): void {}
  onUpdate?(): void {}
}
