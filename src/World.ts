import { Canvas } from "../deps.ts";
import type { KeyEvent, MouseDownEvent, WorldOptions } from "./types.ts";
import {
  Animation,
  AtlasSprite,
  Audio,
  Button,
  Entity,
  Group,
  Image,
  Line,
  Rectangle,
  Sprite,
  Text,
  TextureSprite,
  Scene
} from "../mod.ts";
import { hexToRGBA } from "./utils/mod.ts";

export class World extends Canvas {
  public FPS = 100;
  public params: WorldOptions;
  public scenes: Array<typeof Scene>;
  public currentScene: Scene;
  constructor(params: WorldOptions, scenes: Array<typeof Scene>) {
    super(params);
    this.params = params;
    this.scenes = scenes;
    this.currentScene = new this.scenes[0](this);
  }

  public async start() {
    this.setup();
    for await (const event of this) {
      switch (event.type) {
        case "mouse_button_down":
          this._mouseDown(event);
          break;
        case "draw":
          this._draw();
          break;
        case "quit":
          this.quit();
          break;
        case "key_down":
          this.keyDown(event);
          break;
        default:
          break;
      }
    }
  }
  private _draw() {
    this._fps()();
    this.setDrawColor(0, 0, 0, 255);
    this.clear();
    for (const entity of this.currentScene.entities) {
      this._render(entity);
    }
    this.draw();
    this.present();
    Deno.sleepSync(10);
  }


  public setFPS(fps: number): void {
    this.FPS = fps;
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
    };
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
      this._render(
        new AtlasSprite(
          this.currentScene,
          entity.x,
          entity.y,
          entity.atlas,
          entity.frames[entity.currentFrame],
        ),
      );
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
    } else if (entity instanceof Button) {
      this._render(entity.child);
    } else if (entity instanceof Audio) {
      if (!entity.playing) {
        this.playMusic(entity.src);
        entity.playing = true;
      }
    }
  }
  public keyDown(e: KeyEvent): void {
    this.currentScene.keyDown(e);
  }

  public setScene(scene: number): void {
    this.currentScene = new this.scenes[scene](this);
    this.setup();
  }
  private _mouseDown(e: MouseDownEvent) {
    this.currentScene._mouseDown(e);
  }
  public setup(): void {
    this.currentScene.setup();

  }
  public draw(): void {
    this.currentScene.draw();
  }
}
