import { Canvas, WebGL2RenderingContext } from "../deps.ts";

import {
  // Animation,
  // AtlasSprite,
  // Audio,
  // Button,
  Entity,
  // Group,
  // Image,
  // Line,
  // Circle,
  // ParticleSystem,
  // PhysicsRectangle,
  Rectangle,
  // Sprite,
  // Polygon,
  // Text,
  // TextureSprite,
  World,
} from "../mod.ts";

// import { hexToRGBA } from "./utils/mod.ts";

export class Renderer extends Canvas {
  public ctx:  WebGL2RenderingContext | null;
  constructor(public world: World)  {
    super(world.params);
    this.ctx = this.getContext('webgl');

  }

  // deno-lint-ignore require-await
  async start() {
    // for await (const event of this) {
    //   switch (event.type) {
    //     case "mouse_motion":
    //       this.world._mouseMotion(event);
    //     break;
    //     case "mouse_button_down":
    //       this.world._mouseDown(event);
    //       break;
    //     case "draw":
    //       this.world._draw();
    //       break;
    //     case "quit":
    //       this.quit();
    //       break;
    //     case "key_down":
    //       this.world.keyDown(event);
    //       break;
    //     default:
    //       break;
    //   }
    // }
  }
  public update() {
    this.updateEvents();
    this.swapBuffers();
    this.ctx?.clearColor(255,255,255,1);
    if (this.shouldClose()) {
      Deno.exit(0);
    }
  } 
  public render(entity: Entity) {
    if (entity instanceof Rectangle) {
      // this.setDrawColor(
      //   entity.fill[0],
      //   entity.fill[1],
      //   entity.fill[2],
      //   entity.fill[3],
      // );
      // this.fillRect(entity.x, entity.y, entity.width, entity.height);
    }
  }
  // public renderPhysics(entity: Entity): void {
  //   if (entity instanceof PhysicsRectangle) {
  //     entity.x = Math.round(entity.body.position.x-(entity.width/2));
  //     entity.y = Math.round(entity.body.position.y-(entity.height/2));
  //     this.setDrawColor(
  //       entity.fill[0],
  //       entity.fill[1],
  //       entity.fill[2],
  //       entity.fill[3],
  //     );
  //     this.fillRect(entity.x, entity.y, entity.width, entity.height);
  //   }
  // }
}