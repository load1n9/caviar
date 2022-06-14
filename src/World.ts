import { Canvas, requestAnimationFrame } from "../deps.ts";
import { Scene } from "../mod.ts";
import { WebGLRenderer2D } from "./renderers/webgl/2d.ts";
import type { MouseMotionEvent, WorldOptions } from "./types.ts";

export class World extends Canvas {
  FPS = 500;
  params: WorldOptions;
  scenes: Array<typeof Scene>;
  currentScene: Scene;
  renderer: WebGLRenderer2D;
  // deno-lint-ignore no-explicit-any
  plugins: any = {};
  constructor(params: WorldOptions, scenes: Array<typeof Scene>) {
    super(params);
    this.params = params;
    this.scenes = scenes;
    this.currentScene = new this.scenes[0](this);
    this.renderer = new WebGLRenderer2D(this);
  }

  async start(): Promise<void> {
    this.setup();
    await this.currentScene.loadResources();
    this.renderer.start(this.currentScene.entities);
    requestAnimationFrame(this._draw.bind(this));
    this.renderer.eventManager.on(
      "keyDown",
      // deno-lint-ignore no-explicit-any
      (event: any) => this.keyDown(event),
    );
    this.renderer.eventManager.on(
      "mouseDown",
      // deno-lint-ignore no-explicit-any
      (event: any) => this._mouseDown(event),
    );
  }

  _draw(): void {
    this._fps()();
    // this.renderer.updateEvents();
    // this.renderer.swapBuffers();
    if (this.shouldClose()) return;
    this.updateEvents();
    this.swapBuffers();
    this.updateProgramLifeCycle();
    this.renderer.render(this.currentScene.entities);
    requestAnimationFrame(this._draw.bind(this));
  }

  setFPS(fps: number): void {
    this.FPS = fps;
  }
  _fps(): () => void {
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
  // deno-lint-ignore no-explicit-any
  keyDown(e: any): void {
    this.currentScene.keyDown(e);
  }

  setScene(scene: number | string): void {
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
  // deno-lint-ignore no-explicit-any
  loadPlugin(name: string, plugin: any): void {
    this.plugins[name] = plugin;
  }
  // deno-lint-ignore no-explicit-any
  usePlugin(name: string): any {
    const plug = new this.plugins[name](this);
    plug.onStart();
    return plug;
  }
  // deno-lint-ignore no-explicit-any
  _mouseDown(e: any): void {
    this.currentScene._mouseDown(e);
  }
  _mouseMotion(e: MouseMotionEvent): void {
    this.currentScene._mouseMotion(e);
  }
  setup(): void {
    this.currentScene.setup();
  }
  updateProgramLifeCycle(): void {
    this.currentScene.tick();
    this.currentScene.update();
  }
  get mouseX(): number {
    return this.renderer.canvas.getCurrentState().cursorX;
  }
  get mouseY(): number {
    return this.renderer.canvas.getCurrentState().cursorY;
  }
}
