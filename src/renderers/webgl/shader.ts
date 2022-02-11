import { WebGL2RenderingContext, WebGLProgram, WebGLUniformLocation } from "../../../deno_gl/mod.ts";

export const vertex2d = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform vec4 uVertexColor;
uniform vec2 uTransformMatrix;

varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(aVertexPosition + uTransformMatrix, 1, 1);
  vColor = uVertexColor;
  vTextureCoord = aTextureCoord;
}
`

export const fragment2d = `
varying vec4 vColor;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = vColor;
  gl_FragColor = texture2D(uSampler, vTextureCoord);
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
    texture: number;

    color: WebGLUniformLocation;
    transform: WebGLUniformLocation;
    sampler: WebGLUniformLocation;
}

export function programInfo2d(gl: WebGL2RenderingContext, program: WebGLProgram) {
    return {
        position: gl.getAttribLocation(program, 'aVertexPosition'),
        texture: gl.getAttribLocation(program, 'aTextureCoord'),

        color: gl.getUniformLocation(program, 'uVertexColor')!,
        transform: gl.getUniformLocation(program, 'uTransformMatrix')!,
        sampler: gl.getUniformLocation(program, 'uSampler')!,
    }
}