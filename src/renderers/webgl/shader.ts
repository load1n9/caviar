import { WebGL2RenderingContext, WebGLProgram } from "../../../deno_gl/mod.ts";

export const vertex2d = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

varying lowp vec4 vColor;

void main() {
  gl_Position = aVertexPosition;
}
`

export const fragment2d = `
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`

export const vertex3d = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`

export const fragment3d = `
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`

export type ProgramInfo2d = {
    position: number,
    color: number,
}
export function programInfo2d(gl: WebGL2RenderingContext, program: WebGLProgram) {
    return {
        position: gl.getAttribLocation(program, 'aVertexPosition'),
        color: gl.getAttribLocation(program, 'aVertexColor'),
    }
}

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

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
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