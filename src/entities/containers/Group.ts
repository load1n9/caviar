import { Entity, Scene } from '../../../mod.ts';

export class Group extends Entity {
    children: Array<Entity> = [];
    scene: Scene;

    constructor(scene: Scene, x: number, y: number) {
        super(x,y);
        this.scene = scene;
    }

    addChild(child: Entity) {
        this.children.push(child);
    }

    killChild(child: Entity) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    killAllChildren() {
        this.children = [];
    }
}