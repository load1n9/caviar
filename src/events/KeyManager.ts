import { WindowKeyboardEvent } from "../../deps.ts";
import { World } from "../World.ts";

export class KeyManager {
  listeners: Array<string> = [];
  // deno-lint-ignore no-explicit-any
  keysDown: any = {};
  constructor(public world: World) {}

  setKeys(keys: Array<string>) {
    this.listeners = keys;
    addEventListener("keydown", (e: WindowKeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = true;
      }
    });

    addEventListener("keyup", (e: WindowKeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = false;
      }
    });
  }

  isDown(key: string): boolean {
    return this.keysDown[key];
  }
}
