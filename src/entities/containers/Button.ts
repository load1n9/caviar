import { Entity, Sprite, Rectangle, Image} from '../../../mod.ts';

export class Button extends Entity {
    child: Sprite | Image | Rectangle;

    constructor(child: Sprite | Image | Rectangle) {
        super(child.x,child.y);
        this.child = child;
    }
    set x(x: number) {
        this.child.x = x;
    }
    set y(y: number) {
        this.child.y = y;
    }
    onClick() {

    }
}