import { ProgramInfo2d, programInfo2d } from "./shader.ts";
import {
  Canvas,
  WebGL2RenderingContext,
  WebGLBuffer,
  WebGLProgram,
} from "../../../deno_gl/mod.ts";
import { fragment2d, vertex2d } from "./shader.ts";
import {
  Entity,
  Group,
  Rectangle,
  RGBA,
  TextureSprite,
} from "../../../mod.ts";
import { createBuffer, initShaderProgram, setBuffer } from "./util.ts";

export class WebGLRenderer2D {
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;
  private location: ProgramInfo2d;
  private buffers: Map<string, WebGLBuffer>;
  // private colors: Map<string, WebGLBuffer>;

  constructor(private canvas: Canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error(`Could not request device!`);
    this.gl = gl;
    this.buffers = new Map();
    this.program = initShaderProgram(gl, vertex2d, fragment2d);
    this.location = programInfo2d(gl, this.program);
  }

  public start(entities: Entity[]) {
    this.gl.useProgram(this.program);
    for (const entity of entities) {
      this._start(entity);
    }
  }
  private _start(entity: Entity) {
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
    }
  }

  public render(entities: Entity[]) {
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    for (const entity of entities) {
      this._render(entity);
    }
  }
  private _render(entity: Entity) {
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
    }
  }

  private setupRectangle(rect: Rectangle) {
    const data = [
      0, 0,                    // top left corner
      rect.width, 0,           // top right corner
      0, rect.height,          // bottom left corner
      rect.width, rect.height, // bottom right corner
    ];
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] / this.canvas.width * 2 - 1;
      data[i + 1] = data[i + 1] / this.canvas.height * -2 + 1;
    }
    const buffer = createBuffer(this.gl, data);
    this.buffers.set(rect.id, buffer);
  }

  private renderRectangle(rect: Rectangle) {
    const position = this.buffers.get(rect.id)!;
    setBuffer(this.gl, position, this.location.position, 2);
    const x = rect.x / this.canvas.width * 2
    const y = rect.y / this.canvas.height * -2
    const color = this.colorNorm(rect.fill)
    this.gl.uniform4fv(this.location.color, new Float32Array(color));
    this.gl.uniform2fv(this.location.transform, new Float32Array([x, y]));
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  private colorNorm(rgba: RGBA) {
    return rgba.map(c => c / 255)
  }
}
