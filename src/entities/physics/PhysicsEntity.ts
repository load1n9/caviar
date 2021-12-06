import { Entity, Vector } from "../../../mod.ts";

export type PhysicsConfig = {
    dx: number,
    dy: number,
    mass: number,
}

export class PhysicsEntity extends Entity {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;

    public mass: number;

    public forces: Array<Vector> = [];

    constructor( public sprite: Entity, config: Partial<PhysicsConfig> = {}) {
        super(sprite.x, sprite.y)
        this.x = sprite.x
        this.y = sprite.y
        this.dx = config.dx || 0
        this.dy = config.dy || 0
        this.mass = config.mass || 0
    }    
}