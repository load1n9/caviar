import { WebGL2RenderingContext, WebGLProgram, WebGLUniformLocation } from "../../../deno_gl/mod.ts";

export const vertex2d = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uTransformMatrix;

varying lowp vec4 vColor;

void main(void) {
  gl_Position = aVertexPosition * uTransformMatrix;
  vColor = aVertexColor;
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
    transform: WebGLUniformLocation,
}
export function programInfo2d(gl: WebGL2RenderingContext, program: WebGLProgram) {
    return {
        position: gl.getAttribLocation(program, 'aVertexPosition'),
        color: gl.getAttribLocation(program, 'aVertexColor'),
        transform: gl.getUniformLocation(program, 'uTransformMatrix')!,
    }
}