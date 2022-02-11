import { Entity, World, /*Button, */ Image, AtlasSprite, Sprite } from "../../mod.ts";
import type { MouseDownEvent, MouseMotionEvent, KeyEvent } from "../types.ts";

export type Resource = Image | AtlasSprite | Sprite;

export class Scene {
  public entities: Array<Entity> = [];
  private _resources: Promise<Resource>[] = []
  public resources: Resource[] = []

  constructor(
    public world: World
  ) { }

  public async loadResources() {
    await Promise.all(this._resources);
  }

  public addChild(e: Entity) {
    this.entities.push(e);
    if (e instanceof Image  || e instanceof AtlasSprite || e instanceof Sprite) {
      this._resources.push(e.load())
    }
  }

  public killChild(e: Entity): void {
    const index = this.entities.indexOf(e);
    if (index < -1) return;
    this.entities.splice(index, 1);
  }

  public _mouseDown(e: MouseDownEvent) {
    for (const _entity of this.entities) {
      // if (entity instanceof Button) {
      //   if (
      //     e.x >= entity.x &&
      //     e.x <= entity.child.x + entity.child.width &&
      //     e.y >= entity.child.y &&
      //     e.y <= entity.child.y + entity.child.height
      //   ) {
      //     entity.onClick();
      //   }
      // }
    }
    this.mouseDown(e);
  }
  public _mouseMotion(e: MouseMotionEvent) {
    this.mouseMotion(e)
  }
  public tick(): void { }
  public mouseDown(_e: MouseDownEvent): void { }
  public mouseMotion(_e: MouseMotionEvent): void { }
  public setup(): void { }
  public update(): void { }
  public keyDown(_e: KeyEvent): void { }
}