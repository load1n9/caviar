import { WebGLBuffer, WebGLTexture } from "https://deno.land/x/daybreak@v0.0.2/mod.ts";

export type EntityBuffers = RectangleBuffers | ImageBuffers

export type RectangleBuffers = {
    position: WebGLBuffer,
}

export type ImageBuffers = {
    position: WebGLBuffer,
    texture: WebGLTexture,
    coords: WebGLBuffer,
}