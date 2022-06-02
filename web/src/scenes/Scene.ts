import { Entity, Image, World /*AtlasSprite, Sprite*/ } from "../../mod.ts";
import { RGBA } from "../types.ts";

export type Resource = Image /*| AtlasSprite | Sprite*/;

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
  setKeys(_keys: Array<string>): void {
    this.world.keyManager.setKeys(_keys);
  }
  addChild(e: Entity | Array<Entity>): void {
    if (e instanceof Array) {
      this.entities.push(...e);
      for (const entity of e) {
        if (
          entity instanceof
            Image /*|| e instanceof AtlasSprite || e instanceof Sprite*/
        ) {
          this.#resources.push(entity.load());
        }
      }
    } else {
      this.entities.push(e);
      if (
        e instanceof
          Image /*|| e instanceof AtlasSprite || e instanceof Sprite*/
      ) {
        this.#resources.push(e.load());
      }
    }
  }

  killChild(e: Entity): void {
    const index = this.entities.indexOf(e);
    if (index < -1) return;
    this.entities.splice(index, 1);
  }

  // deno-lint-ignore no-explicit-any
  _mouseDown(e: any) {
    // deno-lint-ignore no-unused-vars
    for (const entity of this.entities) {
      //   if (entity instanceof Button) {
      //     if (
      //       e.x >= entity.x &&
      //       e.x <= entity.child.x + entity.child.width &&
      //       e.y >= entity.child.y &&
      //       e.y <= entity.child.y + entity.child.height
      //     ) {
      //       entity.onClick();
      //     }
      //   }
    }
    this.mouseDown(e);
  }
  // deno-lint-ignore no-explicit-any
  _mouseMotion(e: any) {
    this.mouseMotion(e);
  }
  setBackground(color: string | RGBA): void {
    this.world.renderer.setBackground(color);
  }
  tick(): void {}
  // deno-lint-ignore no-explicit-any
  mouseDown(_e: any): void {}
  // deno-lint-ignore no-explicit-any
  mouseMotion(_e: any): void {}
  setup(): void {}
  update(): void {}
  keyDown(e: string): boolean {
    return this.world.keyManager.isDown(e);
  }
}
