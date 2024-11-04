import type { World } from "../World.ts";

export class KeyManager {
  listeners: Array<string> = [];
  // deno-lint-ignore no-explicit-any
  keysDown: any = {};
  constructor(public world: World) {}
  setKeys(keys: Array<string>) {
    this.listeners = keys;
    // @ts-ignore: typescript is weird
    globalThis.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = true;
      }
    });
    // @ts-ignore: typescript is weird
    globalThis.addEventListener("keyup", (e: KeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = false;
      }
    });
  }
  isDown(key: string): boolean {
    return this.keysDown[key];
  }
}
