import { PhysicsScene, Vector, Rectangle } from "../../../mod.ts";

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
    public worldBounce = null;
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
    public angle = 0;
    public speed = 0;
    public facing = null;
    public immovable = false;
    public pushable = true;
    public moves = true;
    public preRotation = 0;
    public customSeparateX = false;
    public customSeparateY = false;
    public prev: Vector;
    private _dx = 0;
    private _dy = 0;
    private _tx = 0;
    private _ty = 0;
    private _bounds = new Rectangle(0, 0, 0, 0);
    constructor(scene: PhysicsScene, entity: PhysicsEntity) {
        this.width = entity.width;
        this.halfWidth = Math.round(Math.abs(this.width / 2));
        this.height = entity.height;
        this.halfHeight = Math.round(Math.abs(this.height / 2));
        this.scene = scene;
        this.entity = entity;
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
        let sprite = this.entity;
        let transform = this.transform;

        transform.x = sprite.x;
        transform.y = sprite.y;
        transform.rotation = 0;

        let recalc = false;

        if (sprite.syncBounds) {
            let b = sprite.getBounds(this._bounds);
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

    public update(delta: number): void {
        this.prev.x = this.position.x;
        this.prev.y = this.position.y;

        if (this.moves) {
            let vx = this.velocity.x;
            let vy = this.velocity.y;

            this.newVelocity.set(vx * delta, vy * delta);
            this.position.add(this.newVelocity);
            this.updateCenter();
            this.angle = Math.atan2(vy, vx);
            this.speed = Math.sqrt(vx * vx + vy * vy);
        }
        this._dx = this.position.x - this.prev.x;
        this._dy = this.position.y - this.prev.y;
    }
    public postUpdate(): void {
        let dx = this.position.x - this.prevFrame.x;
        let dy = this.position.y - this.prevFrame.y;

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
    public deltaAbsX() {
        return (this._dx > 0) ? this._dx : -this._dx;
    }
    public deltaAbsY() {
        return (this._dy > 0) ? this._dy : -this._dy;
    }
    public deltaX(){
        return this._dx;
    }
    public deltaY(){
        return this._dy;
    }
}