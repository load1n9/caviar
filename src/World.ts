import { Canvas } from "../deps.ts";
import { Scene, Renderer, PhysicsScene, Plugin } from "../mod.ts"
import type { KeyEvent, MouseDownEvent, MouseMotionEvent, WorldOptions } from "./types.ts";

export class World extends Canvas {
  public FPS = 500;
  public params: WorldOptions;
  public scenes: Array<typeof Scene | typeof PhysicsScene>;
  public currentScene: Scene;
  public renderer: Renderer;
  public plugins: any = {};
  constructor(params: WorldOptions, scenes: Array<typeof Scene | typeof PhysicsScene>) {
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
        case "mouse_motion":
          this._mouseMotion(event);
        break;
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
      if (this.currentScene instanceof PhysicsScene) {
        this.renderer.renderPhysics(entity);
      } else {
        this.renderer.render(entity);
      }
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

  public setScene(scene: number | string): void {
    if (typeof scene === 'string') {
      for (const s of this.scenes) {
        if (s.name === scene) {
          this.currentScene = new s(this);
          break;
        }
      }
    } else {
      this.currentScene = new this.scenes[scene](this);
    }
    this.setup();
  }
  public loadPlugin(name: string, plugin: any): void {
    this.plugins[name] = plugin;
  }
  public usePlugin(name: string): Plugin {
    return new this.plugins[name](this);
  }
  private _mouseDown(e: MouseDownEvent) {
    this.currentScene._mouseDown(e);
  }
  private _mouseMotion(e: MouseMotionEvent) {
    this.currentScene._mouseMotion(e);
  }
  public setup(): void {
    this.currentScene.setup();

  }
  public draw(): void {
    this.currentScene.tick();
    this.currentScene.draw();
  }
}
