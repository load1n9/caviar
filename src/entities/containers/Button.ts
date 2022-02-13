import { Entity, Sprite, Rectangle, Image} from '../../../mod.ts';

export class Button extends Entity {
    public child: Sprite | Image | Rectangle;

    constructor(child: Sprite | Image | Rectangle) {
        super(child.x,child.y);
        this.child = child;
    }
    public set x(x: number) {
        this.child.x = x;
    }
    public set y(y: number) {
        this.child.y = y;
    }
    public onClick() {

    }
}