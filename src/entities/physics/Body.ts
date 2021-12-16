import { PhysicsScene, Vector, Rectangle } from "../../../mod.ts";
import { PhysicsEntity } from "./mod.ts";
import { CONST } from "./const.ts";

interface Transform {
    x: number;
    y: number;
    rotation: number;

}
export class Body {
    public scene: PhysicsScene;
    public entity: PhysicsEntity;
    public width: number;
    public halfWidth: number;
    public height: number;
    public halfHeight: number;
    public transform: Transform;
    public enable = true;
    public isCircle = false;
    public radius = 0;
    public angle = 0;
    public facing = CONST.FACING_NONE;
    public position: Vector;
    public allowRotation = false;
    public center: Vector;
    public velocity = new Vector();
    public newVelocity = new Vector();
    public deltaMax = new Vector();
    public acceleration = new Vector();
    public allowDrag = true;
    public collideWorldBounds = true;
    public drag = new Vector();
    public allowGravity = true;
    public gravity = new Vector();
    public bounce = new Vector();
    public worldBounce: any = null;
    public boundsRectangle: Rectangle;
    public onWorldBounds = false;
    public onCollide = false;
    public onOverlap = false;
    public maxVelocity = new Vector(10000, 10000);
    public maxSpeed = -1;
    public friction = new Vector(1, 0);
    public useDamping = false;
    public angularVelocity = 0;
    public angularAcceleration = 0;
    public angularDrag = 0;
    public maxAngular = 1000;
    public mass = 1;
    public rotation: number;
    public preRotation: number;
    public speed = 0;
    public immovable = false;
    public pushable = true;
    public moves = true;
    public customSeparateX = false;
    public customSeparateY = false;
    public overlapX = 0;
    public overlapY = 0;
    public overlapR = 0;
    public embedded = false;
    public checkCollision = {
        none: false,
        up: true,
        down: true,
        left: true,
        right: true
    }
    public touching = {
        none: true,
        up: false,
        down: false,
        left: false,
        right: false
    }
    public wasTouching = {
        none: true,
        up: false,
        down: false,
        left: false,
        right: false
    }
    public blocked = {
        none: true,
        up: false,
        down: false,
        left: false,
        right: false
    }
    public syncBounds = false;
    public physicsType = CONST.DYNAMIC_BODY;
    public prev: Vector;
    public _sx = 1;
    public _sy = 1;
    private _dx = 0;
    private _dy = 0;
    private _tx = 0;
    private _ty = 0;
    private _bounds = new Rectangle(0, 0, 0, 0, "#000000");
    constructor(scene: PhysicsScene, entity: PhysicsEntity) {
        this.width = entity.width;
        this.halfWidth = Math.round(Math.abs(this.width / 2));
        this.height = entity.height;
        this.halfHeight = Math.round(Math.abs(this.height / 2));
        this.scene = scene;
        this.entity = entity;
        this.rotation = this.entity.angle;
        this.preRotation = this.entity.angle;
        this.transform = {
            x: this.entity.x,
            y: this.entity.y,
            rotation: 0,
        };
        this.position = new Vector(this.transform.x, this.transform.y);
        this.rotation = this.transform.rotation;
        this.center = new Vector(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
        this.boundsRectangle = this.scene.bounds;
        this.prev = this.position.clone();


    }

    public updateBounds(): void {
        let entity = this.entity;
        let transform = this.transform;

        transform.x = entity.x;
        transform.y = entity.y;
        transform.rotation = 0;

        let recalc = false;

        if (this.syncBounds) {
            let b = this.getBounds(this._bounds);
            this.width = b.width;
            this.height = b.height;
            recalc = true;
        }
        if (recalc) {
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this.updateCenter();
        }
    }

    public updateCenter(): void {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    }
    public updateFromEntity(): void {
        this.updateBounds();
        let transform = this.transform;
        this.position.x = transform.x;
        this.position.y = transform.y;
        this.updateCenter();
    }
    public preUpdate(willStep: boolean, delta: number): void {
        if (willStep) {
            this.resetFlags();
        }
        this.updateFromEntity();
        this.rotation = this.transform.rotation;
        this.preRotation = this.rotation;
        if (this.moves) {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
        }
        if (willStep) {
            this.update(delta);
        }
    }
    public resetFlags(clear = false): void {
        let wasTouching = this.wasTouching;
        let touching = this.touching;
        let blocked = this.blocked;

        wasTouching.none = clear ? true : wasTouching.none;
        wasTouching.up = clear ? false : wasTouching.up;
        wasTouching.down = clear ? false : wasTouching.down;
        wasTouching.left = clear ? false : wasTouching.left;
        wasTouching.right = clear ? false : wasTouching.right;

        touching.none = true;
        touching.up = false;
        touching.down = false;
        touching.left = false;
        touching.right = false;

        blocked.none = true;
        blocked.up = false;
        blocked.down = false;
        blocked.left = false;
        blocked.right = false;

        this.overlapR = 0;
        this.overlapX = 0;
        this.overlapY = 0;

        this.embedded = false;
    }
    public update(delta: number): void {
        this.prev.x = this.position.x;
        this.prev.y = this.position.y;

        if (this.moves) {
            this.scene.updateMotion(this, delta);
            let vx = this.velocity.x;
            let vy = this.velocity.y;

            this.newVelocity.set(vx * delta, vy * delta);
            this.position.add(this.newVelocity);
            this.updateCenter();
            this.angle = Math.atan2(vy, vx);
            this.speed = Math.sqrt(vx * vx + vy * vy);
            if (this.collideWorldBounds && this.checkWorldBounds() && this.onWorldBounds) {
                // this.scene.emit(Events.WORLD_BOUNDS, this, this.blocked.up, this.blocked.down, this.blocked.left, this.blocked.right);
            }
        }
        this._dx = this.position.x - this.prev.x;
        this._dy = this.position.y - this.prev.y;
    }
    public postUpdate(): void {
        let dx = this.position.x;
        let dy = this.position.y;

        if (this.moves) {
            let mx = this.deltaMax.x;
            let my = this.deltaMax.y;

            if (mx !== 0 && dx !== 0) {
                if (dx < 0 && dx < -mx) {
                    dx = -mx;
                }
                else if (dx > 0 && dx > mx) {
                    dx = mx;
                }
            }

            if (my !== 0 && dy !== 0) {
                if (dy < 0 && dy < -my) {
                    dy = -my;
                }
                else if (dy > 0 && dy > my) {
                    dy = my;
                }
            }

            this.entity.x += dx;
            this.entity.y += dy;
        }

        if (dx < 0) {
            this.facing = CONST.FACING_LEFT;
        }
        else if (dx > 0) {
            this.facing = CONST.FACING_RIGHT;
        }

        if (dy < 0) {
            this.facing = CONST.FACING_UP;
        }
        else if (dy > 0) {
            this.facing = CONST.FACING_DOWN;
        }

        if (this.allowRotation) {
            this.entity.angle += this.deltaZ();
        }

        this._tx = dx;
        this._ty = dy;
    }
    public setBoundsRectangle(bounds: Rectangle): void {
        this.boundsRectangle = (!bounds) ? this.scene.bounds : bounds;
    }
    public checkWorldBounds(): boolean {
        let pos = this.position;
        let bounds = this.boundsRectangle;
        let check = this.scene.checkCollision;

        let bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        let by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        let wasSet = false;

        if (pos.x < bounds.x && check.left) {
            pos.x = bounds.x;
            this.velocity.x *= bx;
            this.blocked.left = true;
            wasSet = true;
        } else if (this.right > bounds.right && check.right) {
            pos.x = bounds.right - this.width;
            this.velocity.x *= bx;
            this.blocked.right = true;
            wasSet = true;
        }

        if (pos.y < bounds.y && check.up) {
            pos.y = bounds.y;
            this.velocity.y *= by;
            this.blocked.up = true;
            wasSet = true;
        } else if (this.bottom > bounds.bottom && check.down) {
            pos.y = bounds.bottom - this.height;
            this.velocity.y *= by;
            this.blocked.down = true;
            wasSet = true;
        }

        if (wasSet) {
            this.blocked.none = false;
            this.updateCenter();
        }
        return wasSet;
    }
    public reset(x: number, y: number): void {
        this.stop();

        let entity = this.entity;

        entity.setPosition(x, y);
        this.position.set(x, y);
        this.prev.copy(this.position);
        this.rotation = entity.angle;
        this.preRotation = entity.angle;
        this.updateBounds();
        this.updateCenter();
        this.resetFlags(true);
    }
    public stop(): void {
        this.velocity.set(0, 0);
        this.acceleration.set(0, 0);
        this.speed = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }
    public getBounds(rect: Rectangle): Rectangle {
        rect.x = this.x;
        rect.y = this.y;

        return rect;
    }
    public onFloor() {
        return this.blocked.down;
    }
    public onCeiling() {
        return this.blocked.up;
    }
    public onWall() {
        return this.blocked.left || this.blocked.right;
    }
    public deltaAbsX() {
        return (this._dx > 0) ? this._dx : -this._dx;
    }
    public deltaAbsY() {
        return (this._dy > 0) ? this._dy : -this._dy;
    }
    public deltaX() {
        return this._dx;
    }
    public deltaY() {
        return this._dy;
    }
    public deltaXFinal() {
        return this._tx;
    }
    public deltaYFinal() {
        return this._ty;
    }
    public destroy() {
        this.scene.killChild(this.entity);
    }
    public deltaZ() {
        return this.rotation - this.preRotation;
    }
    public setCollideWorldBounds(value = true, bounceX?: number, bounceY?: number, onWorldBounds?: boolean): void {
        this.collideWorldBounds = value;

        const setBounceX = (bounceX !== undefined);
        const setBounceY = (bounceY !== undefined);

        if (setBounceX || setBounceY) {
            if (!this.worldBounce) {
                this.worldBounce = new Vector();
            }

            if (setBounceX) {
                this.worldBounce.x = bounceX;
            }

            if (setBounceY) {
                this.worldBounce.y = bounceY;
            }
        }

        if (onWorldBounds !== undefined) {
            this.onWorldBounds = onWorldBounds;
        }
    }
    public setVelocity(x: number, y: number): void {
        this.velocity.set(x, y);

        x = this.velocity.x;
        y = this.velocity.y;

        this.speed = Math.sqrt(x * x + y * y);
    }
    public setVelocityX(value: number): void {
        this.velocity.x = value;

        const x = value;
        const y = this.velocity.y;

        this.speed = Math.sqrt(x * x + y * y);
    }
    public setVelocityY(value: number): void {
        this.velocity.y = value;

        const x = this.velocity.x;
        const y = value;

        this.speed = Math.sqrt(x * x + y * y);
    }
    public setMaxVelocity(x: number, y: number): void {
        this.maxVelocity.set(x, y);
    }
    public setMaxVelocityX(value: number): void {
        this.maxVelocity.x = value;
    }
    public setMaxVelocityY(value: number): void {
        this.maxVelocity.y = value;
    }
    public setMaxSpeed(value: number): void {
        this.maxSpeed = value;
    }
    public setBounce(x: number, y: number): void {
        this.bounce.set(x, y);
    }
    public setBounceX(value: number): void {
        this.bounce.x = value;
    }
    public setBounceY(value: number): void {
        this.bounce.y = value;
    }
    public setAcceleration(x: number, y: number): void {
        this.acceleration.set(x, y);
    }
    public setAccelerationX(value: number): void {
        this.acceleration.x = value;
    }
    public setAccelerationY(value: number): void {
        this.acceleration.y = value;
    }
    public setAllowDrag(value = true): void {
        this.allowDrag = value;
    }
    public setAllowGravity(value = true): void {
        this.allowGravity = value;
    }
    public setAllowRotation(value = true): void {
        this.allowRotation = value;
    }
    public setDrag(x: number, y: number): void {
        this.drag.set(x, y);
    }
    public setDamping(value: boolean): void {
        this.useDamping = value;
    }
    public setDragX(value: number): void {
        this.drag.x = value;
    }
    public setDragY(value: number): void {
        this.drag.y = value;
    }
    public setGravity(x: number, y: number): void {
        this.gravity.set(x, y);
    }
    public setGravityX(value: number): void {
        this.gravity.x = value;
    }
    public setGravityY(value: number): void {
        this.gravity.y = value;
    }
    public setFriction(x: number, y: number): void {
        this.friction.set(x, y);
    }
    public setFrictionX(value: number): void {
        this.friction.x = value;
    }
    public setFrictionY(value: number): void {
        this.friction.y = value;
    }
    public setAngularVelocity(value: number): void {
        this.angularVelocity = value;
    }
    public setAngularAcceleration(value: number): void {
        this.angularAcceleration = value;
    }
    public setAngularDrag(value: number): void {
        this.angularDrag = value;
    }
    public setMass(value: number): void {
        this.mass = value;
    }
    public setImmovable(value = true): void {
        this.immovable = value;
    }
    public setEnable(value = true): void {
        this.enable = value;
    }
    public processX(x: number, vx: number | null, left: boolean, right: boolean): void {
        this.x += x;
        this.updateCenter();
        if (vx !== null) {
            this.velocity.x = vx;
        }
        let blocked = this.blocked;
        if (left) {
            blocked.left = true;
        }
        if (right) {
            blocked.right = true;
        }
    }
    public processY(y: number, vy: number | null, up: boolean, down: boolean): void {
        this.y += y;
        this.updateCenter();
        if (vy !== null) {
            this.velocity.y = vy;
        }
        let blocked = this.blocked;
        if (up) {
            blocked.up = true;
        }
        if (down) {
            blocked.down = true;
        }
    }
    get x(): number {
        return this.position.x;
    }
    set x(value: number) {
        this.position.x = value;
    }
    get y(): number {
        return this.position.y;
    }
    set y(value: number) {
        this.position.y = value;
    }
    get left(): number {
        return this.position.x;
    }
    get right(): number {
        return this.position.x + this.width;
    }
    get top(): number {
        return this.position.y;
    }
    get bottom(): number {
        return this.position.y + this.height;
    }
}