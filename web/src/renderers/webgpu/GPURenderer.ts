// deno-lint-ignore-file no-explicit-any
import { Entity } from "../../entities/Entity.ts";
import {
  AtlasSprite,
  Group,
  Image,
  Rectangle,
  TextureSprite,
} from "../../../mod.ts";
import { RGBA } from "../../types.ts";
import { World } from "../../World.ts";
import {
  createBindGroupLayout,
  createRenderPipeline,
  mipMapShader,
  shader2d,
  Textures2D,
  Uniforms2D,
} from "./shader2d.ts";
import {
  EntityBuffers,
  ImageBuffers,
  Layouts,
  RectangleBuffers,
} from "./types.ts";
import { EventManager } from "../../events/EventManager.ts";
import { hexToRGBA } from "../../utils/HexToRGBA.ts";
import { createBuffer, loadTexture } from "./util.ts";

export class GPURenderer {
  #device?: GPUDevice;
  #pipeline?: GPURenderPipeline;
  // @ts-ignore: typescript is weird
  #canvas: HTMLCanvasElement;
  // @ts-ignore: typescript is weird
  #context?: RenderingContext;
  #layouts?: Layouts;
  #sampler?: GPUSampler;
  #emptyBuffer?: GPUBuffer;
  #emptyTexture?: Textures2D;
  #mipMapShaderModule?: GPUShaderModule;

  #buffers: Map<string, EntityBuffers> = new Map();
  #backgroundColor: RGBA = [0.0, 0.0, 0.0, 0.0];

  eventManager: EventManager = new EventManager();

  constructor(public world: World) {
    this.#canvas = this.world.canvas;
  }
  async init() {
    const adapter = await (navigator as any).gpu.requestAdapter() as GPUAdapter;
    const device = await adapter.requestDevice();
    this.#context = this.#canvas.getContext("webgpu") /*as GPUCanvasContext*/;
    const devicePixelRatio = (window as any).devicePixelRatio || 1;
    const _presentationSize = [
      this.#canvas.clientWidth * devicePixelRatio,
      this.#canvas.clientHeight * devicePixelRatio,
    ];

    if (!device) throw new Error(`Could not request device!`);
    this.#device = device;
    // @ts-ignore new feature
    const format = navigator.gpu.getPreferredCanvasFormat(adapter);
    this.#context.configure({
      device: this.#device,
      format: format,
      alphaMode: "opaque",
    });

    this.#layouts = createBindGroupLayout(device);
    const layout = this.#device.createPipelineLayout({
      bindGroupLayouts: [this.#layouts.texture, this.#layouts.uniform],
    });
    const module = this.#device.createShaderModule({ code: shader2d });
    this.#pipeline = createRenderPipeline(this.#device, module, layout, format);
    this.#sampler = device.createSampler({});
    this.#mipMapShaderModule = device.createShaderModule({code: mipMapShader});
    this.#emptyBuffer = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.#emptyTexture = Textures2D.empty(
      device,
      this.#layouts.texture,
      this.#sampler,
    );
  }

  start(entities: Entity[]) {
    for (const entity of entities) {
      if (entity instanceof Rectangle) {
        this.#setupRectangle(entity);
      } else if (entity instanceof Image || entity instanceof AtlasSprite) {
        this.#setupImage(entity);
      } else if (entity instanceof TextureSprite) {
        for (const rect of entity.data) {
          this.#setupRectangle(rect);
        }
      } else if (entity instanceof Group) {
        this.start(entity.children);
      }
    }
  }

  render(entities: Entity[]) {
    const encoder = this.#device!.createCommandEncoder();
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
    renderPass.setPipeline(this.#pipeline!);
    this.#render(entities, renderPass);
    // @ts-ignore  end is being weird
    renderPass.end();
    this.#device!.queue.submit([encoder.finish()]);
  }
  #render(entities: Entity[], renderPass: GPURenderPassEncoder): void {
    try {
      for (const entity of entities) {
        if (entity instanceof Rectangle) {
          this.#renderRectangle(entity, renderPass);
        } else if (entity instanceof Image || entity instanceof AtlasSprite) {
          this.#renderImage(entity, renderPass);
        } else if (entity instanceof TextureSprite) {
          for (const rect of entity.data) {
            this.#renderRectangle(rect, renderPass);
          }
        } else if (entity instanceof Group) {
          this.#render(entity.children, renderPass);
        }
      }
    } catch (_e: unknown) {
      this.start(this.world.currentScene.entities);
    }
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
    const position = createBuffer(this.#device!, new Float32Array(data));
    const uniforms = new Uniforms2D(this.#device!, this.#layouts!.uniform);
    this.#buffers.set(entity.id, { position, uniforms });
  }

  #renderRectangle(entity: Rectangle, renderPass: GPURenderPassEncoder): void {
    const buffers = this.#buffers.get(entity.id) as RectangleBuffers;
    renderPass.setVertexBuffer(0, buffers.position);
    renderPass.setVertexBuffer(1, this.#emptyBuffer!);

    const x = (entity.x / this.#canvas.width) * 2;
    const y = (entity.y / this.#canvas.height) * -2;
    buffers.uniforms.setPosition(this.#device!, x, y);
    buffers.uniforms.setColor(this.#device!, entity.fill);
    renderPass.setBindGroup(0, this.#emptyTexture!.bindGroup);
    renderPass.setBindGroup(1, buffers.uniforms.bindGroup);
    renderPass.draw(4, 1);
  }

  #setupImage(entity: Image | AtlasSprite): void {
    const x = entity instanceof Image ? 0 : entity.frame.x;
    const y = entity instanceof Image ? 0 : entity.frame.y;
    const { width, height } = entity instanceof Image ? entity : entity.frame;

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
    const coords = createBuffer(this.#device!, new Float32Array(data));
    for (let i = 0; i < data.length; i += 2) {
      data[i] = data[i] * entity.width / this.#canvas.width * 2 - 1;
      data[i + 1] = data[i + 1] * entity.height / this.#canvas.height * -2 + 1;
    }
    const position = createBuffer(this.#device!, new Float32Array(data));
    const tex2d = loadTexture(this.#device!, entity.bitmap);
    const uniforms = new Uniforms2D(this.#device!, this.#layouts!.uniform);
    const texture = new Textures2D(
      this.#device!,
      this.#layouts!.texture,
      tex2d,
      this.#sampler!,
    );
    this.#buffers.set(entity.id, { position, texture, coords, uniforms });
  }

  #renderImage(
    entity: Image | AtlasSprite,
    renderPass: GPURenderPassEncoder,
  ): void {
    const buffers = this.#buffers.get(entity.id) as ImageBuffers;
    renderPass.setVertexBuffer(0, buffers.position);
    renderPass.setVertexBuffer(1, buffers.coords);

    const x = entity.x / this.#canvas.width * 2;
    const y = entity.y / this.#canvas.height * -2;

    buffers.uniforms.setUsage(this.#device!, 1);
    buffers.uniforms.setColor(this.#device!, [1, 0, 0, 1]);
    buffers.uniforms.setPosition(this.#device!, x, y);
    renderPass.setBindGroup(0, buffers.texture.bindGroup);
    renderPass.setBindGroup(1, buffers.uniforms.bindGroup);
    renderPass.draw(4, 1);
  }

  setBackground(color: RGBA | string) {
    this.#backgroundColor = typeof color === "string"
      ? hexToRGBA(color)
      : color;
  }
}
