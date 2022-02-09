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
  hexToRGBA,
  Rectangle,
  RGBA,
  TextureSprite,
  Group
} from "../../../mod.ts";
import { createBuffer, initShaderProgram, setBuffer } from "./util.ts";
import { Matrix4 } from "../../../deps.ts";

export class WebGLRenderer2D {
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;
  private location: ProgramInfo2d;
  private buffers: Map<string, WebGLBuffer>;
  private colors: Map<string, WebGLBuffer>;

  constructor(private canvas: Canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error(`Could not request device!`);
    this.gl = gl;
    this.buffers = new Map();
    this.colors = new Map();
    this.program = initShaderProgram(gl, vertex2d, fragment2d);
    this.location = programInfo2d(gl, this.program);
  }

  public start(entities: Entity[]) {
    for (const entity of entities) {
      this._start(entity);
    }
  }
  private _start(entity: Entity) {
    if (entity instanceof Rectangle) {
      this.setupRectangle(entity);
    } else if (entity instanceof TextureSprite) {
      this.setupTextureSprite(entity);
    } else if (entity instanceof Group) {
      for (const child of entity.children) {
        this._start(child);
      }
    }
  }

  public render(entities: Entity[]) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.program);

    for (const entity of entities) {
      this._render(entity);
    }
  }
  private _render(entity: Entity) {
    if (entity instanceof Rectangle) {
      this.renderRectangle(entity);
    } else if (entity instanceof TextureSprite) {
      this.renderTextureSprite(entity);
    } else if (entity instanceof Group) {
      for (const child of entity.children) {
        this._render(child);
      }
    }
  }

  private setupColor(color: RGBA, vertices: number) {
    if (this.buffers.has(color.toString())) return;
    const data = [];
    for (let i = 0; i < vertices; i++) {
      data.push(...color.map((c) => c / 255));
    }
    const buffer = createBuffer(this.gl, data);
    this.colors.set(color.toString(), buffer);
  }

  private setupRectangle(rect: Rectangle) {
    const data = [
      rect.left,
      rect.up, // top left corner
      rect.right,
      rect.up, // top right corner
      rect.left,
      rect.down, // bottom left corner
      rect.right,
      rect.down, // bottom right corner
    ];
    //TODO: use gmath
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] / this.canvas.width;
      data[i + 1] = data[i + 1] / this.canvas.height;
    }
    const buffer = createBuffer(this.gl, data);
    this.buffers.set(rect.id, buffer);
    this.setupColor(rect.fill, 4);
  }

  private setupTextureSprite(entity: TextureSprite) {
    for (let y = 0; y < entity.data.length; y++) {
      const row = entity.data[y];
      for (let x = 0; x < row.length; x++) {
        const d: string = row[x];
        if (d !== "." && d !== " ") {
          this.setupRectangle(
            new Rectangle(
              // x position
              (x * entity.pixelWidth) + entity.x,
              // y position
              (y * entity.pixelHeight) + entity.y,
              // width
              entity.pixelWidth,
              // height
              entity.pixelHeight,
              // fill color
              hexToRGBA(entity.palette[parseInt("0x" + d.toUpperCase())]),
            ),
          );
        }
      }
    }
  }
  private renderRectangle(rect: Rectangle) {
    const position = this.buffers.get(rect.id)!;
    const color = this.colors.get(rect.fill.toString())!;
    setBuffer(this.gl, position, this.location.position, 2);
    setBuffer(this.gl, color, this.location.color, 4);
    const x = rect.x / this.canvas.width;
    const y = rect.y / this.canvas.width;
    this.gl.uniform4fv(
      this.location.transform,
      new Float32Array([x, y, 0, 0]),
    );
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  private renderTextureSprite(entity: TextureSprite) {
    for (let y = 0; y < entity.data.length; y++) {
      const row = entity.data[y];
      for (let x = 0; x < row.length; x++) {
        const d: string = row[x];
        if (d !== "." && d !== " ") {
          this.renderRectangle(
            new Rectangle(
              // x position
              (x * entity.pixelWidth) + entity.x,
              // y position
              (y * entity.pixelHeight) + entity.y,
              // width
              entity.pixelWidth,
              // height
              entity.pixelHeight,
              // fill color
              hexToRGBA(entity.palette[parseInt("0x" + d.toUpperCase())]),
            ),
          );
        }
      }
    }
  }
}
