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
  public entities: Array<Entity> = [];
  #resources: Promise<Resource>[] = [];
  public resources: Resource[] = [];
  constructor(
    public world: World,
  ) {}

  public async loadResources() {
    await Promise.all(this.#resources);
  }

  public addChild(e: Entity | Entity[]): void {
    if (e instanceof Array) {
      for (const entity of e) {
        this.addChild(entity);
      }
    } else {
      this.entities.push(e);
      if (e instanceof Image || e instanceof AtlasSprite || e instanceof Sprite) {
        this.#resources.push(e.load());
      }
    }
    
  }

  public killChild(e: Entity): void {
    const index = this.entities.indexOf(e);
    if (index < -1) return;
    this.entities.splice(index, 1);
  }

  public _mouseDown(e: MouseDownEvent) {
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
  public _mouseMotion(e: MouseMotionEvent) {
    this.mouseMotion(e);
  }
  public setKeys(_keys: Array<string>): void {
    this.world.renderer.eventManager.keys = _keys;
  }
  public get mouseX() {
    return this.world.mouseX;
  }
  public get mouseY() {
    return this.world.mouseY;
  }
  public tick(): void {}
  public mouseDown(_e: MouseDownEvent): void {}
  public mouseMotion(_e: MouseMotionEvent): void {}
  public setup(): void {}
  public update(): void {}
  public keyDown(_e: KeyEvent): void {}
}
