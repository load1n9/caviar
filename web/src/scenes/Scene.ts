import { Entity, Image, World /*AtlasSprite, Sprite*/ } from "../../mod.ts";

export type Resource = Image /*| AtlasSprite | Sprite*/;

export class Scene {
  public entities: Array<Entity> = [];
  private _resources: Promise<Resource>[] = [];
  public resources: Resource[] = [];
  constructor(
    public world: World,
  ) {}

  public async loadResources() {
    await Promise.all(this._resources);
  }

  public addChild(e: Entity | Array<Entity>): void {
    if (e instanceof Array) {
      this.entities.push(...e);
      for (const entity of e) {
        if (
          entity instanceof
            Image /*|| e instanceof AtlasSprite || e instanceof Sprite*/
        ) {
          this._resources.push(entity.load());
        }
      }
    } else {
      this.entities.push(e);
      if (
        e instanceof
          Image /*|| e instanceof AtlasSprite || e instanceof Sprite*/
      ) {
        this._resources.push(e.load());
      }
    }
  }

  public killChild(e: Entity): void {
    const index = this.entities.indexOf(e);
    if (index < -1) return;
    this.entities.splice(index, 1);
  }

  // deno-lint-ignore no-explicit-any
  public _mouseDown(e: any) {
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
  public _mouseMotion(e: any) {
    this.mouseMotion(e);
  }
  public tick(): void {}
  // deno-lint-ignore no-explicit-any
  public mouseDown(_e: any): void {}
  // deno-lint-ignore no-explicit-any
  public mouseMotion(_e: any): void {}
  public setup(): void {}
  public update(): void {}
  // deno-lint-ignore no-explicit-any
  public keyDown(_e: any): void {}
}
