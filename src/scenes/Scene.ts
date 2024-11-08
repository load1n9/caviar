import {
  AtlasSprite,
  type Entity,
  Image,
  Sprite,
  type World,
} from "../../mod.ts";
import type { MouseDownEvent, MouseMotionEvent, RGBA } from "../types.ts";

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
    this.mouseDown(e);
  }

  _mouseMotion(e: MouseMotionEvent) {
    this.mouseMotion(e);
  }

  setKeys(_keys: Array<string>): void {
    this.world.keyManager.setKeys(_keys);
  }
  setBackground(color: string | RGBA): void {
    this.world.setBackground(color);
  }

  tick(): void {}

  mouseDown(_e: MouseDownEvent): void {}

  mouseMotion(_e: MouseMotionEvent): void {}

  setup(): void {}

  update(): void {}

  onClick(x: number, y: number): void {
    for (const entity of this.entities) {
      if (entity.interactive && entity.collides(x, y)) {
        entity.onClick();
      }
    }
  }

  keyDown(e: string): boolean {
    return this.world.keyManager.isDown(e);
  }
}
