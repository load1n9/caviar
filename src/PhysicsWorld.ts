import { World } from "../mod.ts";
import type { WorldOptions, WorldPhysicsOptions } from "../mod.ts";

export abstract class PhysicsWorld extends World {
    constructor(config: WorldOptions, physics: WorldPhysicsOptions) {
        super(config)
    }

    public updateCollision():void {

    }
}