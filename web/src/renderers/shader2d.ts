import { RGBA } from "../types.ts";
import { Usage } from "./types.ts";

export const shader2d = `
struct Uniforms {
    position: vec2<f32>,
    usage: f32,
    color: vec4<f32>,
};

struct Output {
    @builtin(position) position: vec4<f32>,
    @location(1) coords: vec2<f32>,
};

@group(0) @binding(0)
var uTexture: texture_2d<f32>;
@group(0) @binding(1)
var uSampler: sampler;

@group(1) @binding(0)
var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(
    @location(0) position: vec2<f32>,
    @location(1) coords: vec2<f32>,
) -> Output {
    var out: Output;
    out.position = vec4(position + uniforms.position, 0.0, 1.0);
    out.coords = coords;
    return out;
}

@fragment
fn fs_main(out: Output) -> @location(0) vec4<f32> {
    if (uniforms.usage == 0.0) {
        return uniforms.color;
    } else {
        return textureSample(uTexture, uSampler, out.coords);
    }
}
`;

export const mipMapShader = `
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texCoord : vec2<f32>,
};

var<private> pos : array<vec2<f32>, 4> = array<vec2<f32>, 4>(
  vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, 1.0),
  vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0));
  
@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
  var output : VertexOutput;
  output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  return output;
}

@binding(0) @group(0)
var imgSampler : sampler;
@binding(1) @group(0)
var img : texture_2d<f32>;

@fragment
fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(img, imgSampler, texCoord);
}
`;

export const bindGroupUniform2d: GPUBindGroupLayoutDescriptor = {
  entries: [
    {
      binding: 0, // all uniforms
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: {
        type: "uniform",
        minBindingSize: 32,
      },
    },
  ],
};

export const bindGroupTexture2d: GPUBindGroupLayoutDescriptor = {
  entries: [
    {
      binding: 0, // texture
      visibility: GPUShaderStage.FRAGMENT,
      texture: {},
    },
    {
      binding: 1, // sampler
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      sampler: {},
    },
  ],
};

export function createBindGroupLayout(device: GPUDevice) {
  return {
    uniform: device.createBindGroupLayout(bindGroupUniform2d),
    texture: device.createBindGroupLayout(bindGroupTexture2d),
  };
}

// https://github.com/denoland/webgpu-examples/blob/main/boids/mod.ts

export function createRenderPipeline(
  device: GPUDevice,
  module: GPUShaderModule,
  layout: GPUPipelineLayout,
  presentationFormat: GPUTextureFormat,
) {
  const vertexBuffers: GPUVertexBufferLayout[] = [
    {
      arrayStride: 2 * 4,
      attributes: [
        {
          format: "float32x2",
          offset: 0,
          shaderLocation: 0,
        },
      ],
    },
    {
      arrayStride: 2 * 4,
      attributes: [
        {
          format: "float32x2",
          offset: 0,
          shaderLocation: 1,
        },
      ],
    },
  ];
  const pipeline = device.createRenderPipeline({
    layout,
    vertex: {
      module,
      entryPoint: "vs_main",
      buffers: vertexBuffers,
    },
    fragment: {
      module,
      entryPoint: "fs_main",
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: "triangle-strip",
    },
  });
  return pipeline;
}

export class Uniforms2D {
  buffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  constructor(device: GPUDevice, layout: GPUBindGroupLayout) {
    this.buffer = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.bindGroup = device.createBindGroup({
      layout,
      entries: [{ binding: 0, resource: { buffer: this.buffer } }],
    });
  }

  setUsage(device: GPUDevice, usage: Usage) {
    const buffer = new Float32Array([usage]);
    device.queue.writeBuffer(this.buffer, 8, buffer);
  }

  setPosition(device: GPUDevice, x: number, y: number) {
    const buffer = new Float32Array([x, y]);
    device.queue.writeBuffer(this.buffer, 0, buffer);
  }

  setColor(device: GPUDevice, color: [number, number, number, number]) {
    const buffer = new Float32Array(color);
    device.queue.writeBuffer(this.buffer, 16, buffer);
  }

  colorNorm(rgba: RGBA): RGBA {
    return rgba.map((c) => c / 255) as RGBA;
  }
}

export class Textures2D {
  sampler: GPUSampler;
  texture: GPUTexture;
  bindGroup: GPUBindGroup;
  constructor(
    device: GPUDevice,
    layout: GPUBindGroupLayout,
    texture: GPUTexture,
    sampler: GPUSampler,
  ) {
    this.texture = texture;
    this.sampler = sampler;
    this.bindGroup = device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: this.texture.createView() },
        { binding: 1, resource: this.sampler },
      ],
    });
  }

  static empty(
    device: GPUDevice,
    layout: GPUBindGroupLayout,
    sampler: GPUSampler,
  ) {
    const size = { width: 1, height: 1 };
    const texture = device.createTexture({
      size,
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.writeTexture({ texture }, new Uint8Array(4), {}, size);
    return new Textures2D(device, layout, texture, sampler);
  }
}
