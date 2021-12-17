import { Entity, World, Scene } from "../../mod.ts";
import { Matter } from "../../deps.ts";


export class PhysicsScene extends Scene {
  public MatterWorld: any;
  public MatterEngine: any;
  public MatterRunner: any;
  public start: number;
  constructor(world: World) {
    super(world);
    this.start = Date.now();
    this.MatterWorld = Matter.World.create();
    this.MatterEngine = Matter.Engine.create({ world: this.MatterWorld });
    this.MatterRunner = Matter.Runner.create();
  }
  public tick() {
    Matter.Runner.tick(this.MatterRunner, this.MatterEngine, Date.now() - this.start);
  }
}