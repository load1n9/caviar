import { Plugin, Scene } from "../mod.ts";
import { EventManager } from "./events/EventManager.ts";
import { KeyManager } from "./events/KeyManager.ts";
import { GPURenderer } from "./renderers/GPURenderer.ts";
import { printBanner } from "./utils/mod.ts";

interface WorldOptions {
  /**
   * The width of the world.
   */
  width: number;
  /**
   * The height of the world.
   */
  height: number;
  /**
   * The parent element of the camvas (the canvas will be appended to this). defaults to document.body.
   */
  // @ts-ignore: typescript is weird
  parent?: HTMLElement;
  /**
   * the id of the canvas.
   */
  id?: string;
}
export class World {
  FPS = 500;
  params: WorldOptions;
  scenes: Array<typeof Scene>;
  currentScene: Scene;
  renderer: GPURenderer;
  // @ts-ignore: typescript is weird
  canvas: HTMLCanvasElement;
  keyManager: KeyManager;
  eventManager: EventManager;
  // deno-lint-ignore no-explicit-any
  plugins: any = {};
  constructor(params: WorldOptions, scenes: Array<typeof Scene>) {
    this.params = params;
    this.scenes = scenes;
    // @ts-ignore: typescript is weird
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.params.width;
    this.canvas.height = this.params.height;
    if (this.params.id) this.canvas.id = this.params.id;
    // @ts-ignore: typescript is weird
    (params.parent || document.body).appendChild(this.canvas);
    // @ts-ignore: typescript is weird
    (params.parent || document.body).style.margin = "0";
    this.currentScene = new this.scenes[0](this);
    this.renderer = new GPURenderer(this);
    this.keyManager = new KeyManager(this);
    this.eventManager = new EventManager();
  }

  async start(): Promise<void> {
    printBanner("2.5.0");
    await this.renderer.init();
    this.setup();
    await this.currentScene.loadResources();
    this.renderer.start(this.currentScene.entities);
    // @ts-ignore: typescript is weird
    requestAnimationFrame(this._draw.bind(this));
  }

  _draw(): void {
    this.updateProgramLifeCycle();
    this.renderer.render(this.currentScene.entities);
    // @ts-ignore: typescript is weird
    requestAnimationFrame(this._draw.bind(this));
  }

  setFPS(fps: number): void {
    this.FPS = fps;
  }
  keyDown = (e: string): boolean => this.currentScene.keyDown(e);
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
  usePlugin(name: string): Plugin {
    const plug = new this.plugins[name](this);
    plug.onStart();
    return plug;
  }
  // deno-lint-ignore no-explicit-any
  _mouseDown(e: any): void {
    this.currentScene._mouseDown(e);
  }
  // deno-lint-ignore no-explicit-any
  _mouseMotion(e: any): void {
    this.currentScene._mouseMotion(e);
  }
  setup(): void {
    this.currentScene.setup();
  }
  updateProgramLifeCycle(): void {
    this.currentScene.tick();
    this.currentScene.update();
  }
}
