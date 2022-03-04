import { RGBA } from "../types.ts";

export const shader2d = `
struct Uniforms {
    position: vec4<f32>;
    color: vec4<f32>;
};

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

@stage(vertex)
fn vs_main(
    @location(0) position: vec2<f32>,
    @builtin(vertex_index) vertex_index: u32
) -> @builtin(position) vec4<f32> {
    return vec4(position, 0.0, 1.0) + uniforms.position;
}

@stage(fragment)
fn fs_main() -> @location(0) vec4<f32> {
    return uniforms.color;
}
`;

export const bindGroupLayout2d: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0, // all uniforms
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
                minBindingSize: 32
            },
        },
    ],
};

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
    ]
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
            topology: 'triangle-strip',
        },
    });
    return pipeline;
}

export class Uniforms2D {
    buffer: GPUBuffer
    constructor(device: GPUDevice) {
        this.buffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    }

    setPosition(device: GPUDevice, x: number, y: number) {
        const buffer = new Float32Array([x, y])
        device.queue.writeBuffer(this.buffer, 0, buffer)
    }

    setColor(device: GPUDevice, color: [number, number, number, number]) {
        const buffer = new Float32Array(color)
        device.queue.writeBuffer(this.buffer, 16, buffer)
    }

    colorNorm(rgba: RGBA): RGBA {
        return rgba.map((c) => c / 255) as RGBA;
    }
}
