// deno-lint-ignore-file no-explicit-any
import { Entity } from "../entities/Entity.ts";
import { Rectangle } from "../../mod.ts";
import { RGBA } from "../types.ts";
import { World } from "../World.ts";
import {
  bindGroupLayout2d,
  createRenderPipeline,
  shader2d,
  Uniforms2D,
} from "./shader2d.ts";
import { EntityBuffers, RectangleBuffers } from "./types.ts";
import { EventManager } from "../events/EventManager.ts";
import { hexToRGBA } from "../utils/HexToRGBA.ts";

export class GPURenderer {
  #device?: GPUDevice;
  #pipeline?: GPURenderPipeline;
  #canvas: HTMLCanvasElement;
  #context?: RenderingContext;
  #bindGroup: GPUBindGroup;

  #buffers: Map<string, EntityBuffers> = new Map();
  #backgroundColor: RGBA = [0.0, 0.0, 0.0, 1.0];
  #uniforms?: Uniforms2D;

  eventManager: EventManager = new EventManager();

  constructor(public world: World) {
    this.#canvas = this.world.canvas;
  }
  async init() {
    const adapter = await (navigator as any).gpu.requestAdapter();
    const device = await adapter.requestDevice();
    this.#context = this.#canvas.getContext("webgpu") /*as GPUCanvasContext*/;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const presentationSize = [
      this.#canvas.clientWidth * devicePixelRatio,
      this.#canvas.clientHeight * devicePixelRatio,
    ];

    if (!device) throw new Error(`Could not request device!`);
    this.#device = device;

    const presentationFormat = (this.#context as any).getPreferredFormat(
      adapter,
    );
    (this.#context as any).configure({
      device: this.#device,
      format: presentationFormat,
      size: presentationSize,
    });

    this.#uniforms = new Uniforms2D(device);
    const bindGroupLayout = this.#device.createBindGroupLayout(
      bindGroupLayout2d,
    );
    const pipeLineLayout = this.#device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });
    const module = this.#device.createShaderModule({ code: shader2d });
    this.#pipeline = createRenderPipeline(
      this.#device,
      module,
      pipeLineLayout,
      presentationFormat,
    );
    this.#bindGroup = this.#device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: this.#uniforms.buffer } }],
    });
  }

  start(entities: Entity[]) {
    for (const entity of entities) {
      if (entity instanceof Rectangle) {
        this.#setupRectangle(entity);
      }
    }
  }

  render(entities: Entity[]) {
    const encoder = this.#device.createCommandEncoder();
    const textureView = (this.#context as any).getCurrentTexture().createView();
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          storeOp: "store",
          // @ts-ignore clear not recognized or something
          loadOp: "clear",
          clearValue: this.#backgroundColor,
        },
      ],
    });
    renderPass.setPipeline(this.#pipeline);
    renderPass.setBindGroup(0, this.#bindGroup);
    for (const entity of entities) {
      if (entity instanceof Rectangle) {
        this.#renderRectangle(entity, renderPass);
      }
    }
    // @ts-ignore  end is being weird
    renderPass.end();
    this.#device.queue.submit([encoder.finish()]);
  }

  #setupRectangle(entity: Rectangle): void {
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
      data[i] = (data[i] / this.#canvas.width) * 2 - 1;
      data[i + 1] = (data[i + 1] / this.#canvas.height) * -2 + 1;
    }
    const position = this.#device.createBuffer({
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      size: 32,
    });
    this.#device.queue.writeBuffer(position, 0, new Float32Array(data));
    this.#buffers.set(entity.id, { position });
  }

  #renderRectangle(entity: Rectangle, renderPass: GPURenderPassEncoder): void {
    const buffers = this.#buffers.get(entity.id) as RectangleBuffers;
    // `buffers.position` refers to the rectangle corners
    renderPass.setVertexBuffer(0, buffers.position);
    const x = (entity.x / this.#canvas.width) * 2;
    const y = (entity.y / this.#canvas.height) * -2;
    this.#uniforms.setPosition(this.#device, x, y);
    this.#uniforms.setColor(this.#device, entity.fill);
    renderPass.draw(4, 1);
  }

  setBackground(color: RGBA | string) {
    this.#backgroundColor = typeof color === "string"
      ? hexToRGBA(color)
      : color;
  }
}
