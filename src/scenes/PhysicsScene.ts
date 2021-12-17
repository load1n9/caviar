import { Entity, PhysicsEntity, Scene, World, Rectangle, Vector, TransformMatrix } from "../../../mod.ts";
import type { MouseDownEvent, MouseMotionEvent, KeyEvent } from "../../types.ts";
import { RTree } from "../../utils/mod.ts";

export class PhysicsScene extends Scene {
  constructor(world: World) {
    super(world);
  }
}