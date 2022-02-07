import { cstr, gl, glfw, initGL } from "../mod.ts";
import {
  Matrix4,
  PerspectiveFov,
  Rad,
  Vector3,
} from "https://deno.land/x/gmath@0.1.11/mod.ts";

if (!glfw.init()) {
  throw new Error("Failed to initialize GLFW");
}

if (Deno.build.os === "darwin") {
  // For using ANGLE
  glfw.windowHint(glfw.CONTEXT_CREATION_API, glfw.EGL_CONTEXT_API);
}

glfw.windowHint(glfw.SAMPLES, 4);
glfw.windowHint(glfw.CLIENT_API, glfw.OPENGL_ES_API);
glfw.windowHint(glfw.CONTEXT_VERSION_MAJOR, 3);
glfw.windowHint(glfw.CONTEXT_VERSION_MINOR, 0);
glfw.windowHint(glfw.OPENGL_FORWARD_COMPAT, glfw.OPENGL_CORE_PROFILE);

const width = 600, height = 500;

const win = glfw.createWindow(
  width,
  height,
  cstr("Hello World"),
  null,
  null,
) as Deno.UnsafePointer;

if (win.value === 0n) {
  glfw.terminate();
  throw new Error("Failed to create GLFW window");
}

glfw.makeContextCurrent(win);
initGL();
glfw.setInputMode(win, glfw.STICKY_KEYS, gl.TRUE);

gl.enable(gl.DEBUG_OUTPUT);
// gl.debugMessageCallback();

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

function loadShaders(vertex: string, fragment: string) {
  const vertexShaderID = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShaderID = gl.createShader(gl.FRAGMENT_SHADER);

  const result = new Uint32Array(1);
  const infoLogLength = new Uint32Array(1);

  const vertPtr = new BigUint64Array(1);
  vertPtr[0] = Deno.UnsafePointer.of(cstr(vertex)).value;

  gl.shaderSource(vertexShaderID, 1, vertPtr, null);

  gl.compileShader(vertexShaderID);
  gl.getShaderiv(vertexShaderID, gl.COMPILE_STATUS, result);
  gl.getShaderiv(
    vertexShaderID,
    gl.INFO_LOG_LENGTH,
    infoLogLength,
  );
  if (infoLogLength[0] > 0) {
    const infoLog = new Uint8Array(infoLogLength[0] + 1);
    gl.getShaderInfoLog(
      vertexShaderID,
      infoLogLength[0],
      null,
      infoLog,
    );
    console.log(new TextDecoder().decode(infoLog));
  }

  const fragPtr = new BigUint64Array(1);
  fragPtr[0] = Deno.UnsafePointer.of(cstr(fragment)).value;
  gl.shaderSource(fragmentShaderID, 1, fragPtr, null);
  gl.compileShader(fragmentShaderID);
  gl.getShaderiv(vertexShaderID, gl.COMPILE_STATUS, result);
  gl.getShaderiv(
    vertexShaderID,
    gl.INFO_LOG_LENGTH,
    infoLogLength,
  );
  if (infoLogLength[0] > 0) {
    const infoLog = new Uint8Array(infoLogLength[0] + 1);
    gl.getShaderInfoLog(
      vertexShaderID,
      infoLogLength[0],
      null,
      infoLog,
    );
    console.error(new TextDecoder().decode(infoLog));
  }

  const programID = gl.createProgram() as number;
  gl.attachShader(programID, vertexShaderID);
  gl.attachShader(programID, fragmentShaderID);
  gl.linkProgram(programID);
  gl.getProgramiv(programID, gl.LINK_STATUS, result);
  gl.getProgramiv(
    programID,
    gl.INFO_LOG_LENGTH,
    infoLogLength,
  );
  if (infoLogLength[0] > 0) {
    const infoLog = new Uint8Array(infoLogLength[0] + 1);
    gl.getProgramInfoLog(
      programID,
      infoLogLength[0],
      null,
      infoLog,
    );
    console.error(new TextDecoder().decode(infoLog));
  }

  gl.detachShader(programID, vertexShaderID);
  gl.detachShader(programID, fragmentShaderID);
  gl.deleteShader(vertexShaderID);
  gl.deleteShader(fragmentShaderID);

  return programID;
}

gl.clearColor(0.1, 0.2, 0.3, 1.0);

const vao = new Uint32Array(1);
gl.genVertexArrays(1, vao);
gl.bindVertexArray(vao[0]);

const VERTEX = `
#version 330 core

layout(location = 0) in vec3 vertexPosition_modelspace;
layout(location = 1) in vec3 vertexColor;

uniform mat4 mvp;

out vec3 fragmentColor;

void main() {
  gl_Position =  mvp * vec4(vertexPosition_modelspace, 1);
  fragmentColor = vertexColor;
}
`;

const FRAGMENT = `
#version 330 core

in vec3 fragmentColor;
out vec3 color;

void main() {
  color = fragmentColor;
}
`;

const programID = loadShaders(VERTEX, FRAGMENT);

// deno-fmt-ignore
const vertexBufferData = new Float32Array([
  -1.0,-1.0,-1.0,
  -1.0,-1.0, 1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0,-1.0,
  1.0,-1.0, 1.0,
  -1.0,-1.0,-1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0,-1.0,
  1.0,-1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0, 1.0,
  -1.0, 1.0,-1.0,
  1.0,-1.0, 1.0,
  -1.0,-1.0, 1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0, 1.0,
  -1.0,-1.0, 1.0,
  1.0,-1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0,-1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0, 1.0,
  1.0,-1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0,-1.0,
  -1.0, 1.0,-1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0,-1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  1.0,-1.0, 1.0,
]);

const vertexBuffer = new Uint32Array(1);
gl.genBuffers(1, vertexBuffer);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer[0]);
gl.bufferData(
  gl.ARRAY_BUFFER,
  vertexBufferData.byteLength,
  vertexBufferData,
  gl.STATIC_DRAW,
);

// deno-fmt-ignore
const colorBufferData = new Float32Array([
  0.583,  0.771,  0.014,
  0.609,  0.115,  0.436,
  0.327,  0.483,  0.844,
  0.822,  0.569,  0.201,
  0.435,  0.602,  0.223,
  0.310,  0.747,  0.185,
  0.597,  0.770,  0.761,
  0.559,  0.436,  0.730,
  0.359,  0.583,  0.152,
  0.483,  0.596,  0.789,
  0.559,  0.861,  0.639,
  0.195,  0.548,  0.859,
  0.014,  0.184,  0.576,
  0.771,  0.328,  0.970,
  0.406,  0.615,  0.116,
  0.676,  0.977,  0.133,
  0.971,  0.572,  0.833,
  0.140,  0.616,  0.489,
  0.997,  0.513,  0.064,
  0.945,  0.719,  0.592,
  0.543,  0.021,  0.978,
  0.279,  0.317,  0.505,
  0.167,  0.620,  0.077,
  0.347,  0.857,  0.137,
  0.055,  0.953,  0.042,
  0.714,  0.505,  0.345,
  0.783,  0.290,  0.734,
  0.722,  0.645,  0.174,
  0.302,  0.455,  0.848,
  0.225,  0.587,  0.040,
  0.517,  0.713,  0.338,
  0.053,  0.959,  0.120,
  0.393,  0.621,  0.362,
  0.673,  0.211,  0.457,
  0.820,  0.883,  0.371,
  0.982,  0.099,  0.879,
]);

const colorBuffer = new Uint32Array(1);
gl.genBuffers(1, colorBuffer);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer[0]);
gl.bufferData(
  gl.ARRAY_BUFFER,
  colorBufferData.byteLength,
  colorBufferData,
  gl.STATIC_DRAW,
);

let mvp!: Matrix4;

function makeProjMatrix() {
  const proj = new PerspectiveFov(new Rad(45.0), width / height, 0.1, 100.0)
    .toPerspective()
    .toMatrix4();
  const view = Matrix4.lookAtRh(
    new Vector3(4, 4, 3),
    Vector3.zero(), // origin
    new Vector3(0, 1, 0),
  );
  const model = Matrix4.identity();
  mvp = proj.mul(view.mul(model));
}
makeProjMatrix();

const matrixID = gl.getUniformLocation(programID, cstr("mvp"));

const times = [];
let fps;

// To limit FPS at ~60
// glfw.swapInterval(1);

do {
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  fps = times.length;
  glfw.setWindowTitle(win, cstr(`Hello World | ${fps} FPS`));

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programID);

  gl.uniformMatrix4fv(matrixID, 1, gl.FALSE, mvp.toFloat32Array());

  gl.enableVertexAttribArray(0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer[0]);
  gl.vertexAttribPointer(
    0,
    3,
    gl.FLOAT,
    gl.FALSE,
    0,
    null,
  );

  gl.enableVertexAttribArray(1);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer[0]);
  gl.vertexAttribPointer(
    1,
    3,
    gl.FLOAT,
    gl.FALSE,
    0,
    null,
  );

  gl.drawArrays(gl.TRIANGLES, 0, 3 * 12);

  gl.disableVertexAttribArray(0);

  glfw.swapBuffers(win);
  glfw.pollEvents();
} while (!glfw.windowShouldClose(win) && !glfw.getKey(win, glfw.KEY_ESCAPE));

gl.deleteBuffers(2, new Uint32Array([...vertexBuffer, ...colorBuffer]));
gl.deleteVertexArrays(1, vao);
gl.deleteProgram(programID);

glfw.terminate();
