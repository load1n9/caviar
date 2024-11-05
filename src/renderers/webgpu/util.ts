export function createBuffer(device: GPUDevice, data: BufferSource) {
  const buffer = device.createBuffer({
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    size: data.byteLength,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

export function loadTexture(
  device: GPUDevice,
  source: ImageBitmap,
  mipmapShaderModule?: GPUShaderModule,
  genMipmap = false,
) {
  const size = { width: source.width, height: source.height };
  const descriptor: GPUTextureDescriptor = {
    size: size,
    format: "rgba8unorm",
    dimension: "2d",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  };
  if (genMipmap) {
    descriptor.mipLevelCount =
      Math.floor(Math.log2(Math.max(source.width, source.height))) + 1;
  }
  const texture = device.createTexture(descriptor);

  // @ts-ignore: typescript is weird
  device.queue.copyExternalImageToTexture({ source }, { texture }, size);
  if (genMipmap) {
    generateMipmap(device, texture, descriptor, mipmapShaderModule!);
  }

  return texture;
}

function generateMipmap(
  device: GPUDevice,
  texture: GPUTexture,
  textureDescriptor: GPUTextureDescriptor,
  mipmapShaderModule: GPUShaderModule,
) {
  const pipeline = device.createRenderPipeline({
    // @ts-ignore: typescript is weird
    layout: "auto",
    vertex: {
      module: mipmapShaderModule,
      entryPoint: "vertexMain",
    },
    fragment: {
      module: mipmapShaderModule,
      entryPoint: "fragmentMain",
      targets: [{
        format: textureDescriptor.format,
      }],
    },
    primitive: {
      topology: "triangle-strip",
      stripIndexFormat: "uint32",
    },
  });

  const sampler = device.createSampler({ minFilter: "linear" });

  let srcView = texture.createView({
    baseMipLevel: 0,
    mipLevelCount: 1,
  });

  const commandEncoder = device.createCommandEncoder({});
  for (let i = 1; i < textureDescriptor.mipLevelCount!; ++i) {
    const dstView = texture.createView({
      baseMipLevel: i,
      mipLevelCount: 1,
    });

    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: dstView,
        // @ts-ignore clear not recognized or something
        loadOp: "clear",
        clearValue: [0, 0, 0, 0],
        storeOp: "store",
      }],
    });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: sampler,
      }, {
        binding: 1,
        resource: srcView,
      }],
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(4);
    // @ts-ignore: typescript is weird
    passEncoder.end();

    srcView = dstView;
  }
  device.queue.submit([commandEncoder.finish()]);
}
