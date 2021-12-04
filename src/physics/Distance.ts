import { Rectangle, Sprite, AtlasSprite, Image } from '../../mod.ts';
type PhysicsObject = Rectangle | Sprite | AtlasSprite | Image;

export const distance = (a: PhysicsObject, b: PhysicsObject): number => {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
}