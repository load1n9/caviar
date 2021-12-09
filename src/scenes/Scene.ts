import { Entity, World, Button } from "../../mod.ts";
import type { MouseDownEvent, KeyEvent } from "../types.ts";
export class Scene {
    public entities: Array<Entity> = [];

    constructor(
        public world: World
    ) {}

    public addChild(e: Entity) {
        this.entities.push(e);
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
    public mouseDown(_e: MouseDownEvent): void {}
    public setup(): void {}
    public draw(): void {}
    public keyDown(_e: KeyEvent): void {}
}