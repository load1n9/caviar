import { PhysicsEntity } from "../entities/physics/PhysicsSprite.ts";

export interface Force {
    update(dt: number): number
    // force(): void
}

export class GravityForce implements Force {
    constructor(
        public entity: PhysicsEntity,
        public a: number
    ) {}
    
    public update(_dt: number): number {
        // F = m * a
        return this.entity.mass * this.a
    }
}

// https://www.toppr.com/guides/physics-formulas/normal-force-formula/
export class NormalForce implements Force {
    constructor(
        public entity: PhysicsEntity,
        public g: number
    ) {}
    
    public update(_dt: number): number {
        if (this.entity.dx === 0) {
            return 0;
        }
    }
}
