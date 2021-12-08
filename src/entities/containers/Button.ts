import { Entity, Sprite, World } from '../../../mod.ts';

export class Button extends Entity {
    public child: Sprite;
    public world: World;

    constructor(world: World, child: Sprite) {
        super(child.x,child.y);
        this.child = child;
        this.world = world;
    }

    public setX(x: number) {
        this.child.x = x;
    }
    public setY(y: number) {
        this.child.y = y;
    }
    public onClick() {

    }
}