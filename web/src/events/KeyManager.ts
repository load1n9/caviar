import { World } from "../World.ts";

export class KeyManager {
  listeners: Array<string> = [];
  keysDown: any = {};
  constructor(public world: World) {}
  setKeys(keys: Array<string>) {
    this.listeners = keys;
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = true;
      }
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (this.listeners.includes(e.key)) {
        this.keysDown[e.key] = false;
      }
    });
  }
  isDown(key: string): boolean {
    return this.keysDown[key];
  }
  
}
