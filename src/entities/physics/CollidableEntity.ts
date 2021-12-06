import { Entity, Vector } from "../../../mod.ts";

export type PhysicsConfig = {
}

export class CollidableEntity extends Entity {
    public x: number;
    public y: number;
    public angle = 0;
    public colliding: any//Array<CollidableEntity>;

    public forces: Array<Vector> = new Array();
    

    constructor( public sprite: Entity, config: Partial<PhysicsConfig> = {}) {
        super(sprite.x, sprite.y);
        this.x = sprite.x;
        this.y = sprite.y;
    }
    public collisionDetection(): boolean {
        return false;
    }
}
