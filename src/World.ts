import { Canvas } from "../deps.ts";
import { Scene, Renderer, Entity } from "../mod.ts"
import type { KeyEvent, MouseDownEvent, WorldOptions } from "./types.ts";

export class World extends Canvas {
  public FPS = 100;
  public params: WorldOptions;
  public scenes: Array<typeof Scene>;
  public currentScene: Scene;
  public renderer: Renderer;
  constructor(params: WorldOptions, scenes: Array<typeof Scene>) {
    super(params);
    this.params = params;
    this.scenes = scenes;
    this.currentScene = new this.scenes[0](this);
    this.renderer = new Renderer(this);
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
      this.renderer.render(entity);
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
