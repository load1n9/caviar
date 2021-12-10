import { Entity, Sprite, Scene } from '../../../mod.ts';

export class Button extends Entity {
    public child: Sprite;
    public scene: Scene;

    constructor(scene: Scene, child: Sprite) {
        super(child.x,child.y);
        this.child = child;
        this.scene = scene;
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