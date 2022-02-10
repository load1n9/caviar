import { WebGL2RenderingContext, WebGLProgram, WebGLUniformLocation } from "../../../deno_gl/mod.ts";

export const vertex2d = `
attribute vec2 aVertexPosition;

uniform vec4 uVertexColor;
uniform vec2 uTransformMatrix;

varying vec4 vColor;

void main(void) {
  gl_Position = vec4(aVertexPosition + uTransformMatrix, 1, 1);
  vColor = uVertexColor;
}
`

export const fragment2d = `
varying vec4 vColor;

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

export interface ProgramInfo2d {
    position: number;
    color: WebGLUniformLocation;
    transform: WebGLUniformLocation;
}

export function programInfo2d(gl: WebGL2RenderingContext, program: WebGLProgram) {
    return {
        position: gl.getAttribLocation(program, 'aVertexPosition'),
        color: gl.getUniformLocation(program, 'uVertexColor')!,
        transform: gl.getUniformLocation(program, 'uTransformMatrix')!,
    }
}