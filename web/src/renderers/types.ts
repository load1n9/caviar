export type EntityBuffers = RectangleBuffers | ImageBuffers

export type RectangleBuffers = {
    // bindGroup: GPUBindGroup,
    position: GPUBuffer,
}

export type ImageBuffers = {
    // bindGroup: GPUBindGroup,
    position: GPUBuffer,
    texture: GPUTexture,
    coords: GPUBuffer,
}