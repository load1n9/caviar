import { Vector } from "../../../mod.ts";
import type { IVectorLike } from "../../../mod.ts";

export interface PhysicsConfig {
    isStatic?: boolean;
    speed?: number;
    angularVelocity?: number;
    friction?: number;
    mass?: number;
    force?: Vector | IVectorLike;
    velocity?: Vector | IVectorLike;
    inertia?: number;
}