import { Uniforms2D } from "./shader2d.ts";

export type EntityBuffers = RectangleBuffers

export type RectangleBuffers = {
    bindGroup: GPUBindGroup,
    uniforms: Uniforms2D,
    
    position: GPUBuffer
}

// export type ImageBuffers = {
//     // bindGroup: GPUBindGroup,
//     position: GPUBuffer,
//     texture: GPUTexture,
//     coords: GPUBuffer,
// }