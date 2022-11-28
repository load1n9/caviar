import {
  WebGLProgram,
  WebGLRenderingContext,
  WebGLUniformLocation,
} from "../../../deps.ts";

export const vertex2d = `
#version 330 core

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uShaderUsage;
uniform vec4 uVertexColor;
uniform vec2 uTransformMatrix;

varying lowp float vShaderUsage;
varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(aVertexPosition + uTransformMatrix, 1, 1);
  if (uShaderUsage == 0.0) {
    vColor = uVertexColor;
  } else {
    vTextureCoord = aTextureCoord;
  }
  vShaderUsage = uShaderUsage;
}
`;

export const fragment2d = `
#version 330 core

varying vec4 vColor;
varying highp vec2 vTextureCoord;

varying lowp float vShaderUsage;
uniform sampler2D uSampler;

void main(void) {
  if (vShaderUsage == 0.0) {
    gl_FragColor = vColor;
  } else {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  };
}
`;

export const vertex3d = `
#version 330 core

attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

export const fragment3d = `
#version 330 core

varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`;

export interface ProgramInfo2d {
  position: number;
  texture: number;

  color: WebGLUniformLocation;
  transform: WebGLUniformLocation;
  sampler: WebGLUniformLocation;
  usage: WebGLUniformLocation;
}

export function programInfo2d(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
) {
  return {
    position: gl.getAttribLocation(program, "aVertexPosition"),
    texture: gl.getAttribLocation(program, "aTextureCoord"),

    color: gl.getUniformLocation(program, "uVertexColor")!,
    transform: gl.getUniformLocation(program, "uTransformMatrix")!,
    sampler: gl.getUniformLocation(program, "uSampler")!,
    usage: gl.getUniformLocation(program, "uShaderUsage")!,
  };
}
