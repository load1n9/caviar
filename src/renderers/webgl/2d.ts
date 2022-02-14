import { ProgramInfo2d, programInfo2d } from "./shader.ts";
import {
  Canvas,
  WebGL2RenderingContext,
  WebGLProgram,
} from "../../../deps.ts";
import { fragment2d, vertex2d } from "./shader.ts";
import {
  AtlasSprite,
  Entity,
  Group,
  Image,
  Rectangle,
  RGBA,
  Sprite,
  TextureSprite,
  EventManager
} from "../../../mod.ts";
import {
  createBuffer,
  initShaderProgram,
  loadTexture,
  setBuffer,
} from "./util.ts";
import { EntityBuffers, ImageBuffers, RectangleBuffers } from "./types.ts";
export class WebGLRenderer2D {
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;
  private location: ProgramInfo2d;
  private buffers: Map<string, EntityBuffers>;
  public eventManager: EventManager = new EventManager();
  private backgroundColor: RGBA = [0.0, 0.0, 0.0, 1.0];
  constructor(public canvas: Canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error(`Could not request device!`);
    this.gl = gl;
    this.buffers = new Map();
    this.program = initShaderProgram(gl, vertex2d, fragment2d);
    this.location = programInfo2d(gl, this.program);
  }

  public start(entities: Entity[]): void {
    this.gl.useProgram(this.program);
    for (const entity of entities) {
      this._start(entity);
    }
  }

  private _start(entity: Entity): void {
    if (entity instanceof Rectangle) {
      this.setupRectangle(entity);
    } else if (entity instanceof TextureSprite) {
      for (const rect of entity.data) {
        this.setupRectangle(rect);
      }
    } else if (entity instanceof Group) {
      for (const child of entity.children) {
        this._start(child);
      }
    } else if (
      entity instanceof Image || entity instanceof AtlasSprite ||
      entity instanceof Sprite
    ) {
      this.setupImage(entity);
    }
  }

  public render(entities: Entity[]): void {
    this.gl.clearColor.apply(null, this.backgroundColor);
    if (this.canvas.getCurrentState().mouseButtonLeft){
      this.eventManager.emit('mouseDown', { x: this.canvas.getCurrentState().cursorX, y: this.canvas.getCurrentState().cursorY });
    }
    this.eventManager.keys.forEach((key) => {
      // deno-lint-ignore no-explicit-any
      if ((this.canvas.getCurrentState() as any)[`key${key.toUpperCase()}`]) {
        this.eventManager.emit('keyDown', key);
      }
    });
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of entities) {
      this._render(entity);
    }
  }

  private _render(entity: Entity): void {
    if (entity instanceof Rectangle) {
      this.renderRectangle(entity);
    } else if (entity instanceof TextureSprite) {
      for (const rect of entity.data) {
        this.renderRectangle(rect);
      }
    } else if (entity instanceof Group) {
      for (const child of entity.children) {
        this._render(child);
      }
    } else if (
      entity instanceof Image || entity instanceof AtlasSprite ||
      entity instanceof Sprite
    ) {
      this.renderImage(entity);
    }
  }

  private setupRectangle(entity: Rectangle): void {
    const data = [
      0,
      0, // top left corner
      entity.width,
      0, // top right corner
      0,
      entity.height, // bottom left corner
      entity.width,
      entity.height, // bottom right corner
    ];
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] / this.canvas.width * 2 - 1;
      data[i + 1] = data[i + 1] / this.canvas.height * -2 + 1;
    }
    const position = createBuffer(this.gl, data);
    this.buffers.set(entity.id, { position });
  }

  private renderRectangle(entity: Rectangle): void {
    const buffers = this.buffers.get(entity.id) as RectangleBuffers;
    setBuffer(this.gl, buffers.position, this.location.position, 2);

    const x = entity.x / this.canvas.width * 2;
    const y = entity.y / this.canvas.height * -2;
    const color = this.colorNorm(entity.fill);

    this.gl.uniform1f(this.location.usage, 0);
    this.gl.uniform4fv(this.location.color, new Float32Array(color));
    this.gl.uniform2fv(this.location.transform, new Float32Array([x, y]));
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  private setupImage(entity: Image | AtlasSprite): void {
    const { x, y, width, height } = entity instanceof Image
      ? { x: 0, y: 0, width: entity.width, height: entity.height }
      : entity.frame;
    const data = [
      x,
      y,
      x + width,
      y,
      x,
      y + height,
      x + width,
      y + height,
    ];
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] / entity.width;
      data[i + 1] = data[i + 1] / entity.height;
    }
    const coords = createBuffer(this.gl, data);
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] * entity.width / this.canvas.width * 2 - 1;
      data[i + 1] = data[i + 1] * entity.height / this.canvas.height * -2 + 1;
    }
    const position = createBuffer(this.gl, data);
    // deno-lint-ignore no-explicit-any
    const texture = loadTexture(this.gl, (entity as any).image)!;
    this.buffers.set(entity.id, { position, texture, coords });
  }

  private renderImage(entity: Image | AtlasSprite | Sprite): void {
    const buffers = this.buffers.get(entity.id) as ImageBuffers;
    setBuffer(this.gl, buffers.position, this.location.position, 2);
    setBuffer(this.gl, buffers.coords, this.location.texture, 2);

    const x = entity.x / this.canvas.width * 2;
    const y = entity.y / this.canvas.height * -2;

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, buffers.texture);
    this.gl.uniform1i(this.location.sampler, 0);
    this.gl.uniform2fv(this.location.transform, new Float32Array([x, y]));
    this.gl.uniform1f(this.location.usage, 1);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  public setBackground(color: RGBA): void {
    this.backgroundColor = this.colorNorm(color);
  }
  private colorNorm(rgba: RGBA): RGBA {
    return rgba.map((c) => c / 255) as RGBA;
  }
}
