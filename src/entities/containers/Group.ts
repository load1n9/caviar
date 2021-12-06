import { Entity, World } from '../../../mod.ts';

export class Group extends Entity {
    public children: Array<Entity> = [];
    public world: World;

    constructor(world: World, x: number, y: number) {
        super(x,y);
        this.world = world;
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