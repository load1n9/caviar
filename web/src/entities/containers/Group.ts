import { Entity, Scene } from "../../../mod.ts";

export class Group extends Entity {
  children: Array<Entity> = [];
  scene: Scene;

  constructor(scene: Scene, x: number, y: number) {
    super(x, y);
    this.scene = scene;
  }

  addChild(childOrChildren: Entity | Entity[]) {
    if (childOrChildren instanceof Array) {
      for (const child of childOrChildren) {
        this.addChild(child);
      }
    } else {
    this.children.push(childOrChildren);
    }
  }

  killChild(childOrChildren: Entity) {
    if (childOrChildren instanceof Array) {
      for (const child of childOrChildren) {
        this.killChild(child);
      }
    } else {
    this.children.splice(this.children.indexOf(child), 1);
    }
  }

  killAllChildren() {
    this.children = [];
  }
}
