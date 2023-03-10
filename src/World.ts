import {
  CreateWindowOptions,
  WebGLCanvas,
  WindowKeyboardEvent,
} from "../deps.ts";
import { Scene } from "../mod.ts";
import { KeyManager } from "./events/KeyManager.ts";
import { WebGLRenderer2D } from "./renderers/webgl/2d.ts";
import type { MouseMotionEvent, RGBA } from "./types.ts";
import { hexToRGBA, printBanner, sleepSync } from "./utils/mod.ts";
import { VERSION } from "./version.ts";

export class World extends WebGLCanvas {
  FPS = 500;
  params: CreateWindowOptions;
  scenes: Array<typeof Scene>;
  currentScene: Scene;
  renderer: WebGLRenderer2D;
  keyManager: KeyManager;
  // deno-lint-ignore no-explicit-any
  plugins: any = {};
  // deno-lint-ignore no-explicit-any
  loadedPlugins: any = [];
  reRender = false;

  #showBanner = true;

  constructor(params: CreateWindowOptions, scenes: Array<typeof Scene>) {
    super(params);
    this.params = params;
    this.params.glVersion = this.params.glVersion || [3, 3];
    this.scenes = scenes;
    this.currentScene = new this.scenes[0](this);
    this.keyManager = new KeyManager(this);
    this.renderer = new WebGLRenderer2D(this);
  }

  async start(): Promise<void> {
    if (this.#showBanner) printBanner(VERSION);
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

    addEventListener("mousedown", (evt) => {
      this._mouseDown(evt);
    });

    addEventListener("keydown", (evt) => {
      this.keyDown(evt);
    });

    await this.run();
  }

  _draw(): void {
    this._fps()();
    // if (this.shouldClose()) return;
    // this.updateEvents();
    this.updateProgramLifeCycle();
    if (this.reRender) {
      this.renderer.start(this.currentScene.entities);
      this.reRender = false;
    }
    this.renderer.render(this.currentScene.entities);
    if (this.loadedPlugins.length > 0) {
      for (const plug of this.loadedPlugins) {
        if (plug.onUpdate) plug.onUpdate();
      }
    }
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
      sleepSync(1 / this.FPS * 1000);
    };
  }

  keyDown(e: WindowKeyboardEvent): boolean {
    return this.currentScene.keyDown(e.key);
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
    this.loadedPlugins.push(plug);
    return plug;
  }

  // deno-lint-ignore no-explicit-any
  _mouseDown(e: any): void {
    this.currentScene._mouseDown(e);
    this.currentScene.onClick(e.x, e.y);
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

  setBackground(color: string | RGBA): void {
    this.renderer.setBackground(
      typeof color === "string" ? hexToRGBA(color) : color,
    );
  }

  disableBanner() {
    this.#showBanner = false;
  }
}
