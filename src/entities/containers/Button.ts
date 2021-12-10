import { Entity, Sprite, Rectangle, Image, Scene } from '../../../mod.ts';

export class Button extends Entity {
    public child: Sprite | Image | Rectangle;
    public scene: Scene;

    constructor(scene: Scene, child: Sprite | Image | Rectangle) {
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