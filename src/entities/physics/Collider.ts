import { PhysicsEntity, PhysicsScene } from "../../../mod.ts";

export class Collider extends Entity {
    constructor(
        public scene: PhysicsScene,
        public overlapOnly: boolean = false,
        public e1: PhysicsEntity,
        public e2: PhysicsEntity,
        public collideCallback: (e1: PhysicsEntity, e2: PhysicsEntity) => void,
        public callbackContext: any = this,
    ) {
        super(0, 0);
    }

    update() {
        this.scene.collideObjects(
            this.e1,
            this.e2,
            this.collideCallback,
            this.callbackContext,
            this.overlapOnly,
        )
    }
}
