export function createBuffer(device: GPUDevice, data: BufferSource) {
    const buffer = device.createBuffer({
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        size: data.byteLength,
    });
    device.queue.writeBuffer(buffer, 0, data);
    return buffer
}

export function loadTexture(device: GPUDevice, source: ImageBitmap) {
    const size = { width: source.width, height: source.height }
    const texture = device.createTexture({
        size: size,
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    // @ts-ignore
    device.queue.copyExternalImageToTexture({ source }, { texture }, size);

    return texture;
}