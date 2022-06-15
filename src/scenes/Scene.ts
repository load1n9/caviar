import {
  AtlasSprite,
  Button,
  Entity,
  Image,
  Sprite,
  World,
} from "../../mod.ts";
import type { KeyEvent, MouseDownEvent, MouseMotionEvent } from "../types.ts";

export type Resource = Image | AtlasSprite | Sprite;

export class Scene {
  entities: Array<Entity> = [];
  #resources: Promise<Resource>[] = [];
  resources: Resource[] = [];
  constructor(
    public world: World,
  ) {}

  async loadResources() {
    await Promise.all(this.#resources);
  }

  addChild(e: Entity | Entity[]): void {
    if (e instanceof Array) {
      for (const entity of e) {
        this.addChild(entity);
      }
    } else {
      this.entities.push(e);
      if (
        e instanceof Image || e instanceof AtlasSprite || e instanceof Sprite
      ) {
        this.#resources.push(e.load());
      }
    }
  }

  killChild(e: Entity | Entity[]): void {
    if (e instanceof Array) {
      for (const entity of e) {
        this.killChild(entity);
      }
    } else {
      const index = this.entities.indexOf(e);
      if (index < -1) return;
      this.entities.splice(index, 1);
    }
  }
  // deno-lint-ignore no-explicit-any
  loadPlugin(name: string, plugin: any): void {
    this.world.loadPlugin(name, plugin);
  }

  usePlugin(name: string) {
    return this.world.usePlugin(name);
  }

  killAllChildren(): void {
    this.entities = [];
  }

  _mouseDown(e: MouseDownEvent) {
    for (const entity of this.entities) {
      if (entity instanceof Button) {
        if (
          e.x >= entity.x &&
          e.x <= entity.child.x + entity.child.width &&
          e.y >= entity.child.y &&
          e.y <= entity.child.y + entity.child.height
        ) {
          entity.onClick();
        }
      }
    }
    this.mouseDown(e);
  }
  _mouseMotion(e: MouseMotionEvent) {
    this.mouseMotion(e);
  }
  setKeys(_keys: Array<string>): void {
    this.world.renderer.eventManager.keys = _keys;
  }
  get mouseX() {
    return this.world.mouseX;
  }
  get mouseY() {
    return this.world.mouseY;
  }
  tick(): void {}
  mouseDown(_e: MouseDownEvent): void {}
  mouseMotion(_e: MouseMotionEvent): void {}
  setup(): void {}
  update(): void {}
  keyDown(_e: KeyEvent): void {}
}
