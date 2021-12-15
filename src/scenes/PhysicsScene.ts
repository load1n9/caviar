import { Entity, PhysicsEntity, Scene, World, Rectangle, Collider } from "../../../mod.ts";
import type { MouseDownEvent, MouseMotionEvent, KeyEvent } from "../../types.ts";

export class PhysicsScene extends Scene {
  public entities: Array<PhysicsEntity> = [];
  public colliders: Array<Colliders> = [];
  public bounds = new Rectangle(0, 0, this.world.params.width, this.world.params.height);

  constructor(
    public world: World
  ) { }

  public setBounds(x, y, width, height): void {
    this.bounds = new Rectangle(x, y, width, height);
  }

  public addCollider(
    e1: PhysicsEntity,
    e2: PhysicsEntity,
    collideCallback: (e1: PhysicsEntity, e2: PhysicsEntity) => void | null,
    callbackContext: any = this
  ): void {
    if (collideCallback === undefined) collideCallback = null;
    if (callbackContext === undefined) callbackContext = collideCallback;
    this.colliders.push(new Collider(this, false, e1, e2, this.collideCallback, callbackContext));
  }
  public addOverlap(
    e1: PhysicsEntity,
    e2: PhysicsEntity,
    collideCallback: (e1: PhysicsEntity, e2: PhysicsEntity) => void | null,
    callbackContext: any = this
  ): void {
    if (collideCallback === undefined) collideCallback = null;
    if (callbackContext === undefined) callbackContext = collideCallback;
    this.colliders.push(new Collider(this, true, e1, e2, this.collideCallback, callbackContext));
  }
  public killCollider(collider: Collider): void {
    const index = this.colliders.indexOf(collider);
    if (index > -1) {
      this.colliders.splice(index, 1);
    }
  }
  public collideObjects(    
    e1: PhysicsEntity,
    e2: PhysicsEntity,
    collideCallback: (e1: PhysicsEntity, e2: PhysicsEntity) => void | null,
    callbackContext: any = this,
    overlapOnly: boolean = false
  ) {
      this.collideSpriteSprite(e1, e2, collideCallback, callbackContext, overlapOnly);
  }
  public collideSpriteSprite(    
    e1: PhysicsEntity,
    e2: PhysicsEntity,
    collideCallback: (e1: PhysicsEntity, e2: PhysicsEntity) => void | null,
    callbackContext: any = this,
    overlapOnly: boolean = false
  ) {
    
  }
}