import type { WebGLBuffer, WebGLTexture } from "../../../deps.ts";

export type EntityBuffers = RectangleBuffers | ImageBuffers;

export type RectangleBuffers = {
  position: WebGLBuffer;
};

export type ImageBuffers = {
  position: WebGLBuffer;
  texture: WebGLTexture;
  coords: WebGLBuffer;
};
