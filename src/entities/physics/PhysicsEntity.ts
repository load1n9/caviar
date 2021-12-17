import { Entity, Vector, PhysicsScene } from "../../../mod.ts";

export type PhysicsConfig = {
    dx: number,
    dy: number,
    mass: number,
}


export abstract class PhysicsEntity extends Entity {
    public dx: number;
    public dy: number;
    public angle = 0;
    public mass: number;
    public width: number;
    public height: number;
    constructor(public scene: PhysicsScene, public sprite: Entity, config: Partial<PhysicsConfig> = {}) {
        super(sprite.x, sprite.y);
        this.width = sprite.width;
        this.height = sprite.height;
        this.dx = config.dx || 0;
        this.dy = config.dy || 0;
        this.mass = config.mass || 1;
    }    

    public getBounds(obj: any) {
        obj.x = this.x;
        obj.y = this.y;
        obj.width = this.width;
        obj.height = this.height;
        return obj;
    }
}