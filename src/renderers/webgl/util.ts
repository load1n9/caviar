import type { WebGL2RenderingContext, WebGLBuffer, WebGLProgram, WebGLShader, WebGLUniformLocation } from "../../../deno_gl/mod.ts";

export function initShaderProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);

    const shaderProgram = gl.createProgram();
    if (vertexShader && fragmentShader && shaderProgram) {
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            const msg = gl.getProgramInfoLog(shaderProgram)
            throw new Error(`Unable to initialize the shader program: ${msg}`);
        }

        return shaderProgram;
    }
    throw new Error(`Unable to initialize the shader program!`);
}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const msg = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader);
            throw new Error(`An error occurred compiling the shaders: ${msg}`);
        }

        return shader;
    }
    throw new Error(`An error occurred compiling the shaders!`);
}

export function createBuffer(
    gl: WebGL2RenderingContext,
    data: number[],
    target: number = gl.ARRAY_BUFFER,
    usage: number = gl.STATIC_DRAW
): WebGLBuffer {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error(`Could not create buffer!`)
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, new Float32Array(data), usage);
    return buffer
}

export function setBuffer(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer,
    location: number,
    numComponents: number,
    type: number = gl.FLOAT,
    target: number = gl.ARRAY_BUFFER,
    normalize = false,
    stride = 0,
    offset = 0,
): void {
    gl.bindBuffer(target, buffer);
    gl.vertexAttribPointer(
        location,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(location);
}