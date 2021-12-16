import { Entity, PhysicsEntity, Scene, World, Rectangle, Collider, Vector } from "../../../mod.ts";
import type { MouseDownEvent, MouseMotionEvent, KeyEvent } from "../../types.ts";
import { CustomSet, RTree } from "../../utils/mod.ts";

export class PhysicsScene extends Scene {
  public entities: Array<PhysicsEntity> = [];
  public colliders: Array<Collider> = [];
  public gravity = new Vector(0, 0);
  public bounds: Rectangle;
  public checkCollision = {
    up: true,
    down: true,
    left: true,
    right: true
  }
  private _elapsed = 0;
  public stepsLastFrame = 0;
  public timeScale = 1;
  public OVERLAP_BIAS = 4;
  public TILE_BIAS = 16;
  public forceX = false;
  public isPaused = false;
  private _total = 0;
  public maxEntries = 16;
  public useTree = true;
  public tree = new RTree(this.maxEntries);
  public staticTree = new RTree(this.maxEntries);
  public treeMinMax = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  constructor( world: World ) { 
    super(world)
    this.bounds = new Rectangle(0, 0, world.params.width, world.params.height)
  }

  public setBounds(x: number, y: number, width: number, height: number): void {
    this.bounds = new Rectangle(x, y, width, height);
  }

  public addCollider(
    e1: PhysicsEntity,
    e2: PhysicsEntity,
    collideCallback: any = null,
    callbackContext: any = this
  ): void {
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