import { Entity, Scene } from '../../../mod.ts';

export class Group extends Entity {
    public children: Array<Entity> = [];
    public scene: Scene;

    constructor(scene: Scene, x: number, y: number) {
        super(x,y);
        this.scene = scene;
    }

    public addChild(child: Entity) {
        this.children.push(child);
    }

    public killChild(child: Entity) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    public killAllChildren() {
        this.children = [];
    }
}