import { Rectangle, Sprite, AtlasSprite, Image } from '../../mod.ts';
type CollisionObject = Rectangle | Sprite | AtlasSprite | Image;
export const isColliding = (a:  CollisionObject, b:  CollisionObject): boolean => {
    if (a instanceof Rectangle && b instanceof Rectangle) {
        return isCollidingRectangleRectangle(a, b);
    } else if (a instanceof Sprite && b instanceof Sprite) {
        return isCollidingRectangleRectangle(a, b);
    } else if (a instanceof AtlasSprite && b instanceof AtlasSprite) {
        return isCollidingAtlasSpriteAtlasSprite(a, b);
    } else if (a instanceof Image && b instanceof Image) {
        return isCollidingRectangleRectangle(a, b);
    } else {
        throw new Error(`Unsupported collision object type: ${a.constructor.name} and ${b.constructor.name}`);
    }
}

export const isCollidingRectangleRectangle = (a: Rectangle | Sprite | Image, b: Rectangle | Sprite | Image): boolean => {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
export const isCollidingAtlasSpriteAtlasSprite = (a: AtlasSprite, b: AtlasSprite): boolean => {
    return a.x < b.x + b.frame.width &&
        a.x + a.frame.width > b.x &&
        a.y < b.y + b.frame.height &&
        a.y + a.frame.height > b.y;
}