import { Canvas } from "../deps.ts";
import type { KeyEvent, MouseDownEvent, WorldOptions } from "./types.ts";
import {
  AtlasSprite,
  Entity,
  Group,
  Image,
  Line,
  Rectangle,
  Sprite,
  Text,
  TextureSprite,
  Animation,
} from "../mod.ts";
import { hexToRGBA } from "./utils/mod.ts";

export abstract class World extends Canvas {
  public FPS = 100;
  public entities: Array<Entity> = [];
  public params: WorldOptions;
  constructor(params: WorldOptions) {
    super(params);
    this.params = params;
  }

  public async start() {
    this.setup();
    for await (const event of this) {
      switch (event.type) {
        case "draw":
          this._draw();
          break;
        case "quit":
          this.quit();
          break;
        case "key_down":
          this.keyDown(event);
          break;
        case "mouse_button_down":
          this.mouseDown(event);
          break;
        default:
          break;
      }
    }
  }
  public addChild(e: Entity) {
    this.entities.push(e);
  }

  public killChild(e: Entity): void {
    const index = this.entities.indexOf(e);
    if (index < -1) return;
    this.entities.splice(index, 1);
  }
  private _draw() {
    this._fps()();
    this.setDrawColor(0, 0, 0, 255);
    this.clear();
    for (const entity of this.entities) {
      this._render(entity);
    }
    this.draw();
    this.present();
    Deno.sleepSync(10);
  }

  public _fps() {
    let start = performance.now();
    let frames = 0;
    return () => {
      frames++;
      if ((performance.now() - start) >= 1000) {
        start = performance.now();
        frames = 0;
      }
  
      Deno.sleepSync(1 / this.FPS * 1000);
    }
  }
  private _render(entity: Entity) {
    if (entity instanceof Rectangle) {
      this.setDrawColor(
        entity.fill[0],
        entity.fill[1],
        entity.fill[2],
        entity.fill[3],
      );
      this.fillRect(entity.x, entity.y, entity.width, entity.height);
    } else if (entity instanceof Line) {
      this.drawLine(entity.p1, entity.p2);
    } else if (entity instanceof Image) {
      this.copy(
        entity.texture,
        {
          x: 0,
          y: 0,
          width: entity.width,
          height: entity.height,
        },
        {
          x: entity.x,
          y: entity.y,
          width: entity.width,
          height: entity.height,
        },
      );
    } else if (entity instanceof Sprite) {
      this.copy(
        entity.texture,
        {
          x: Math.round(entity.frame.x),
          y: Math.round(entity.frame.y),
          width: Math.round(entity.frame.width),
          height: Math.round(entity.frame.height),
        },
        {
          x: Math.round(entity.x),
          y: Math.round(entity.y),
          width: Math.round(entity.frame.width),
          height: Math.round(entity.frame.height),
        },
      );
    } else if (entity instanceof Text) {
      entity.render(this);
      this.copy(
        entity.texture,
        {
          x: 0,
          y: 0,
          width: entity.width,
          height: entity.height,
        },
        {
          x: entity.x,
          y: entity.y,
          width: entity.width,
          height: entity.height,
        },
      );
    } else if (entity instanceof AtlasSprite) {
      this.copy(
        entity.texture,
        {
          x: Math.round(entity.frame.x),
          y: Math.round(entity.frame.y),
          width: Math.round(entity.frame.width),
          height: Math.round(entity.frame.height),
        },
        {
          x: Math.round(entity.x),
          y: Math.round(entity.y),
          width: Math.round(entity.frame.width),
          height: Math.round(entity.frame.height),
        },
      );
    } else if (entity instanceof Animation) {
        this._render(new AtlasSprite(this, entity.x, entity.y, entity.atlas, entity.frames[entity.currentFrame]));
        entity.currentFrame = (entity.currentFrame + 1) % entity.frames.length;
    } else if (entity instanceof TextureSprite) {
      for (let y = 0; y < entity.data.length; y++) {
        const row = entity.data[y];
        for (let x = 0; x < row.length; x++) {
          const d: string = row[x];
          if (d !== "." && d !== " ") {
            const pixelColor = hexToRGBA(
              entity.palette[parseInt("0x" + d.toUpperCase())],
            );
            this.setDrawColor(
              pixelColor[0],
              pixelColor[1],
              pixelColor[2],
              pixelColor[3],
            );
            this.fillRect(
              (x * entity.pixelWidth) + entity.x,
              (y * entity.pixelHeight) + entity.y,
              entity.pixelWidth,
              entity.pixelHeight,
            );
          }
        }
      }
    } else if (entity instanceof Group) {
      for (const child of entity.children) {
          this._render(child);
      }
    }
  }
  public keyDown(_e: KeyEvent): void {
    return;
  }
  public mouseDown(_e: MouseDownEvent): void {
    return;
  }

  public abstract setup(): void;
  public abstract draw(): void;
}
