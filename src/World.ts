import { Plugin, Renderer, Scene } from "../mod.ts";
import type {
  KeyEvent,
  MouseDownEvent,
  MouseMotionEvent,
  WorldOptions,
} from "./types.ts";

export class World {
  public FPS = 500;
  public params: WorldOptions;
  public scenes: Array<typeof Scene>;
  public currentScene: Scene;
  public renderer: Renderer;
  public plugins: any = {};
  constructor(params: WorldOptions, scenes: Array<typeof Scene>) {
    this.params = params;
    this.scenes = scenes;
    this.currentScene = new this.scenes[0](this);
    this.renderer = new Renderer(this);
  }

  public async start() {
    this.setup();
    await this.renderer.start();
    setInterval(this._draw, 50);
  }
  public _draw() {
    // this._fps()();
    // this.renderer.updateEvents();
    // this.renderer.swapBuffers();
    // this.renderer.ctx?.clearColor(255,255,255,1);
    if (this.currentScene.entities.length > 0) {
      for (const entity of this.currentScene.entities) {
        this.renderer.render(entity);
      }
    }
    this.draw();
    // this.present();
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
    if (typeof scene === "string") {
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
  public _mouseDown(e: MouseDownEvent) {
    this.currentScene._mouseDown(e);
  }
  public _mouseMotion(e: MouseMotionEvent) {
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
