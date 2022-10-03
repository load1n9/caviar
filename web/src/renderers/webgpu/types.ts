import { Textures2D, Uniforms2D } from "./shader2d.ts";

export type Layouts = {
  uniform: GPUBindGroupLayout;
  texture: GPUBindGroupLayout;
};

export type EntityBuffers = RectangleBuffers | ImageBuffers;

export type RectangleBuffers = {
  uniforms: Uniforms2D;

  position: GPUBuffer;
};

export type ImageBuffers = {
  uniforms: Uniforms2D;
  texture: Textures2D;

  position: GPUBuffer;
  coords: GPUBuffer;
};

export enum Usage {
  Geometry,
  Texture,
}
