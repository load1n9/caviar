import { WebGL2RenderingContext } from "../../../deno_gl/mod.ts";

export function createBuffer(
    gl: WebGL2RenderingContext,
    data: number[],
    target: number = gl.ARRAY_BUFFER,
    usage: number = gl.STATIC_DRAW
) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error(`Could not create buffer!`)
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, new Float32Array(data), usage);
}

export function setBuffer(
    gl: WebGL2RenderingContext,
    location: number,
    numComponents: number,
    type: number,
    normalize = false,
    stride = 0,
    offset = 0,
) {
    gl.vertexAttribPointer(
        location,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(location);
}