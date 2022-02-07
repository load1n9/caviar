import { GL_CONST } from "./const.ts";
import { MapFFI } from "./util.ts";

const GLenum = "u32" as const;
const GLboolean = "u8" as const;
const GLbitfield = "u32" as const;
// const GLbyte = "i8" as const;
// const GLshort = "i16" as const;
const GLint = "i32" as const;
const GLsizei = "i32" as const;
const GLintptr = "u64" as const;
const GLsizeiptr = "u64" as const;
// const GLubyte = "u8" as const;
// const GLushort = "u16" as const;
const GLuint = "u32" as const;
const GLuint64 = "u64" as const;
const GLfloat = "f32" as const;
const GLclampf = "f32" as const;
const GLfloatv = "pointer" as const;
const GLbooleanv = "pointer" as const;
const GLubyteptr = "pointer" as const;
const GLvoidptr = "pointer" as const;
const GLuintv = "pointer" as const;
const GLintv = "pointer" as const;
const GLcharptr = "pointer" as const;
const GLenumv = "pointer" as const;
const GLint64v = "pointer" as const;

export const symbols = {
  /// 5.14.3 Setting and getting state

  activeTexture: {
    parameters: [GLenum],
    result: "void",
  },

  blendColor: {
    parameters: [GLclampf, GLclampf, GLclampf, GLclampf],
    result: "void",
  },

  blendEquation: {
    parameters: [GLenum],
    result: "void",
  },

  blendEquationSeparate: {
    parameters: [GLenum, GLenum],
    result: "void",
  },

  blendFunc: {
    parameters: [GLenum, GLenum],
    result: "void",
  },

  blendFuncSeparate: {
    parameters: [GLenum, GLenum, GLenum, GLenum],
    result: "void",
  },

  clearColor: {
    parameters: [GLclampf, GLclampf, GLclampf, GLclampf],
    result: "void",
  },

  clearDepthf: {
    parameters: [GLclampf],
    result: "void",
  },

  clearStencil: {
    parameters: [GLint],
    result: "void",
  },

  colorMask: {
    parameters: [GLboolean, GLboolean, GLboolean, GLboolean],
    result: "void",
  },

  cullFace: {
    parameters: [GLenum],
    result: "void",
  },

  depthFunc: {
    parameters: [GLenum],
    result: "void",
  },

  depthMask: {
    parameters: [GLboolean],
    result: "void",
  },

  depthRangef: {
    parameters: [GLclampf, GLclampf],
    result: "void",
  },

  disable: {
    parameters: [GLenum],
    result: "void",
  },

  enable: {
    parameters: [GLenum],
    result: "void",
  },

  frontFace: {
    parameters: [GLenum],
    result: "void",
  },

  getIntegerv: {
    parameters: [GLenum, GLintv],
    result: "void",
  },

  getFloatv: {
    parameters: [GLenum, GLfloatv],
    result: "void",
  },

  getBooleanv: {
    parameters: [GLenum, GLbooleanv],
    result: "void",
  },

  getString: {
    parameters: [GLenum],
    result: GLubyteptr,
  },

  getError: {
    parameters: [],
    result: GLenum,
  },

  debugMessageCallback: {
    parameters: ["pointer"],
    result: "void",
  },

  hint: {
    parameters: [GLenum, GLenum],
    result: "void",
  },

  isEnabled: {
    parameters: [GLenum],
    result: GLboolean,
  },

  lineWidth: {
    parameters: [GLfloat],
    result: "void",
  },

  pixelStorei: {
    parameters: [GLenum, GLint],
    result: "void",
  },

  polygonOffset: {
    parameters: [GLfloat, GLfloat],
    result: "void",
  },

  sampleCoverage: {
    parameters: [GLclampf, GLboolean],
    result: "void",
  },

  stencilFunc: {
    parameters: [GLenum, GLint, GLuint],
    result: "void",
  },

  stencilFuncSeparate: {
    parameters: [GLenum, GLenum, GLint, GLuint],
    result: "void",
  },

  stencilMask: {
    parameters: [GLuint],
    result: "void",
  },

  stencilMaskSeparate: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  stencilOp: {
    parameters: [GLenum, GLenum, GLenum],
    result: "void",
  },

  stencilOpSeparate: {
    parameters: [GLenum, GLenum, GLenum, GLenum],
    result: "void",
  },

  /// 5.14.4 Viewing and clipping

  scissor: {
    parameters: [GLint, GLint, GLsizei, GLsizei],
    result: "void",
  },

  viewport: {
    parameters: [GLint, GLint, GLsizei, GLsizei],
    result: "void",
  },

  /// 5.14.5 Buffer objects

  bindBuffer: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  bufferData: {
    parameters: [GLenum, GLsizeiptr, GLvoidptr, GLenum],
    result: "void",
  },

  bufferSubData: {
    parameters: [GLenum, GLintptr, GLsizeiptr, GLvoidptr],
    result: "void",
  },

  genBuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  deleteBuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  getBufferParameteriv: {
    parameters: [GLenum, GLenum, GLintv],
    result: "void",
  },

  isBuffer: {
    parameters: [GLuint],
    result: GLboolean,
  },

  /// 5.14.6 Framebuffer objects

  bindFramebuffer: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  checkFramebufferStatus: {
    parameters: [GLenum],
    result: GLenum,
  },

  genFramebuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  deleteFramebuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  framebufferRenderbuffer: {
    parameters: [GLenum, GLenum, GLenum, GLuint],
    result: "void",
  },

  framebufferTexture2D: {
    parameters: [GLenum, GLenum, GLenum, GLuint, GLint],
    result: "void",
  },

  getFramebufferAttachmentParameteriv: {
    parameters: [GLenum, GLenum, GLenum, GLintv],
    result: "void",
  },

  isFramebuffer: {
    parameters: [GLuint],
    result: GLboolean,
  },

  /// 5.14.7 Renderbuffer objects

  bindRenderbuffer: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  genRenderbuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  deleteRenderbuffers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  getRenderbufferParameteriv: {
    parameters: [GLenum, GLenum, GLintv],
    result: "void",
  },

  isRenderbuffer: {
    parameters: [GLuint],
    result: GLboolean,
  },

  renderbufferStorage: {
    parameters: [GLenum, GLenum, GLsizei, GLsizei],
    result: "void",
  },

  /// 5.14.8 Texture objects

  bindTexture: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  compressedTexImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLenum,
      GLsizei,
      GLsizei,
      GLint,
      GLsizei,
      GLvoidptr,
    ],
    result: "void",
  },

  compressedTexSubImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLenum,
      GLsizei,
      GLvoidptr,
    ],
    result: "void",
  },

  copyTexImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLenum,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLint,
    ],
    result: "void",
  },

  copyTexSubImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLint,
      GLint,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
    ],
    result: "void",
  },

  genTextures: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  deleteTextures: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  generateMipmap: {
    parameters: [GLenum],
    result: "void",
  },

  getTexParameteriv: {
    parameters: [GLenum, GLenum, GLintv],
    result: "void",
  },

  isTexture: {
    parameters: [GLuint],
    result: GLboolean,
  },

  texImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLint,
      GLenum,
      GLenum,
      GLvoidptr,
    ],
    result: "void",
  },

  texParameterf: {
    parameters: [GLenum, GLenum, GLfloat],
    result: "void",
  },

  texParameteri: {
    parameters: [GLenum, GLenum, GLint],
    result: "void",
  },

  texSubImage2D: {
    parameters: [
      GLenum,
      GLint,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLenum,
      GLenum,
      GLvoidptr,
    ],
    result: "void",
  },

  /// 5.14.9 Programs and Shaders

  attachShader: {
    parameters: [GLuint, GLuint],
    result: "void",
  },

  bindAttribLocation: {
    parameters: [GLuint, GLuint, GLcharptr],
    result: "void",
  },

  compileShader: {
    parameters: [GLuint],
    result: "void",
  },

  createProgram: {
    parameters: [],
    result: GLuint,
  },

  createShader: {
    parameters: [GLenum],
    result: GLuint,
  },

  deleteProgram: {
    parameters: [GLuint],
    result: "void",
  },

  deleteShader: {
    parameters: [GLuint],
    result: "void",
  },

  detachShader: {
    parameters: [GLuint, GLuint],
    result: "void",
  },

  getAttachedShaders: {
    parameters: [GLuint, GLsizei, GLuintv, GLuintv],
    result: "void",
  },

  getProgramiv: {
    parameters: [GLuint, GLenum, GLintv],
    result: "void",
  },

  getProgramInfoLog: {
    parameters: [GLuint, GLsizei, GLintv, GLcharptr],
    result: "void",
  },

  getShaderiv: {
    parameters: [GLuint, GLenum, GLintv],
    result: "void",
  },

  getShaderPrecisionFormat: {
    parameters: [GLenum, GLenum, GLintv, GLintv],
    result: "void",
  },

  getShaderInfoLog: {
    parameters: [GLuint, GLsizei, GLintv, GLcharptr],
    result: "void",
  },

  getShaderSource: {
    parameters: [GLuint, GLsizei, GLintv, GLcharptr],
    result: "void",
  },

  isProgram: {
    parameters: [GLuint],
    result: GLboolean,
  },

  isShader: {
    parameters: [GLuint],
    result: GLboolean,
  },

  linkProgram: {
    parameters: [GLuint],
    result: "void",
  },

  shaderSource: {
    parameters: [GLuint, GLsizei, GLcharptr, GLintv],
    result: "void",
  },

  useProgram: {
    parameters: [GLuint],
    result: "void",
  },

  validateProgram: {
    parameters: [GLuint],
    result: "void",
  },

  /// 5.14.10 Uniforms and attributes

  disableVertexAttribArray: {
    parameters: [GLuint],
    result: "void",
  },

  enableVertexAttribArray: {
    parameters: [GLuint],
    result: "void",
  },

  getActiveAttrib: {
    parameters: [GLuint, GLuint, GLsizei, GLuintv, GLintv, GLenumv, GLcharptr],
    result: "void",
  },

  getActiveUniform: {
    parameters: [
      GLuint,
      GLuint,
      GLsizei,
      GLuintv,
      GLintv,
      GLenumv,
      GLcharptr,
    ],
    result: "void",
  },

  getAttribLocation: {
    parameters: [GLuint, GLcharptr],
    result: GLint,
  },

  getUniformfv: {
    parameters: [GLuint, GLint, GLfloatv],
    result: "void",
  },

  getUniformiv: {
    parameters: [GLuint, GLint, GLintv],
    result: "void",
  },

  getUniformLocation: {
    parameters: [GLuint, GLcharptr],
    result: GLint,
  },

  getVertexAttribfv: {
    parameters: [GLuint, GLenum, GLfloatv],
    result: "void",
  },

  getVertexAttribiv: {
    parameters: [GLuint, GLenum, GLintv],
    result: "void",
  },

  getVertexAttribPointerv: {
    parameters: [GLuint, GLenum, GLvoidptr],
    result: "void",
  },

  uniform1f: {
    parameters: [GLint, GLfloat],
    result: "void",
  },

  uniform2f: {
    parameters: [GLint, GLfloat, GLfloat],
    result: "void",
  },

  uniform3f: {
    parameters: [GLint, GLfloat, GLfloat, GLfloat],
    result: "void",
  },

  uniform4f: {
    parameters: [GLint, GLfloat, GLfloat, GLfloat, GLfloat],
    result: "void",
  },

  uniform1i: {
    parameters: [GLint, GLint],
    result: "void",
  },

  uniform2i: {
    parameters: [GLint, GLint, GLint],
    result: "void",
  },

  uniform3i: {
    parameters: [GLint, GLint, GLint, GLint],
    result: "void",
  },

  uniform4i: {
    parameters: [GLint, GLint, GLint, GLint, GLint],
    result: "void",
  },

  uniform1fv: {
    parameters: [GLint, GLsizei, GLfloatv],
    result: "void",
  },

  uniform2fv: {
    parameters: [GLint, GLsizei, GLfloatv],
    result: "void",
  },

  uniform3fv: {
    parameters: [GLint, GLsizei, GLfloatv],
    result: "void",
  },

  uniform4fv: {
    parameters: [GLint, GLsizei, GLfloatv],
    result: "void",
  },

  uniform1iv: {
    parameters: [GLint, GLsizei, GLintv],
    result: "void",
  },

  uniform2iv: {
    parameters: [GLint, GLsizei, GLintv],
    result: "void",
  },

  uniform3iv: {
    parameters: [GLint, GLsizei, GLintv],
    result: "void",
  },

  uniform4iv: {
    parameters: [GLint, GLsizei, GLintv],
    result: "void",
  },

  uniformMatrix2fv: {
    parameters: [GLint, GLsizei, GLboolean, GLfloatv],
    result: "void",
  },

  uniformMatrix3fv: {
    parameters: [GLint, GLsizei, GLboolean, GLfloatv],
    result: "void",
  },

  uniformMatrix4fv: {
    parameters: [GLint, GLsizei, GLboolean, GLfloatv],
    result: "void",
  },

  vertexAttrib1f: {
    parameters: [GLuint, GLfloat],
    result: "void",
  },

  vertexAttrib2f: {
    parameters: [GLuint, GLfloat, GLfloat],
    result: "void",
  },

  vertexAttrib3f: {
    parameters: [GLuint, GLfloat, GLfloat, GLfloat],
    result: "void",
  },

  vertexAttrib4f: {
    parameters: [GLuint, GLfloat, GLfloat, GLfloat, GLfloat],
    result: "void",
  },

  vertexAttrib1fv: {
    parameters: [GLuint, GLfloatv],
    result: "void",
  },

  vertexAttrib2fv: {
    parameters: [GLuint, GLfloatv],
    result: "void",
  },

  vertexAttrib3fv: {
    parameters: [GLuint, GLfloatv],
    result: "void",
  },

  vertexAttrib4fv: {
    parameters: [GLuint, GLfloatv],
    result: "void",
  },

  vertexAttribPointer: {
    parameters: [
      GLuint,
      GLint,
      GLenum,
      GLboolean,
      GLsizei,
      GLvoidptr,
    ],
    result: "void",
  },

  /// 5.14.11 Writing to the drawing buffer

  clear: {
    parameters: [GLbitfield],
    result: "void",
  },

  drawArrays: {
    parameters: [GLenum, GLint, GLsizei],
    result: "void",
  },

  drawElements: {
    parameters: [GLenum, GLsizei, GLenum, GLvoidptr],
    result: "void",
  },

  finish: {
    parameters: [],
    result: "void",
  },

  flush: {
    parameters: [],
    result: "void",
  },

  /// 5.14.12 Reading back pixels

  readPixels: {
    parameters: [
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLenum,
      GLenum,
      GLvoidptr,
    ],
    result: "void",
  },

  //// WebGL 2

  /// 3.7.2 Setting and getting state

  getInteger64v: {
    parameters: [GLenum, GLint64v],
    result: "void",
  },

  getIntegeri_v: {
    parameters: [GLenum, GLuint, GLintv],
    result: "void",
  },

  getInteger64i_v: {
    parameters: [GLenum, GLuint, GLint64v],
    result: "void",
  },

  /// 3.7.3 Buffer objects

  getBufferParameteri64v: {
    parameters: [GLenum, GLenum, GLint64v],
    result: "void",
  },

  copyBufferSubData: {
    parameters: [GLenum, GLenum, GLintptr, GLintptr, GLsizeiptr],
    result: "void",
  },

  mapBufferRange: {
    parameters: [
      GLenum,
      GLintptr,
      GLsizeiptr,
      GLbitfield,
    ],
    result: GLvoidptr,
  },

  unmapBuffer: {
    parameters: [GLenum],
    result: GLboolean,
  },

  /// 3.7.4 Framebuffer objects

  blitFramebuffer: {
    parameters: [
      GLint,
      GLint,
      GLint,
      GLint,
      GLint,
      GLint,
      GLint,
      GLint,
      GLbitfield,
      GLenum,
    ],
    result: "void",
  },

  framebufferTextureLayer: {
    parameters: [GLenum, GLenum, GLuint, GLint, GLint],
    result: "void",
  },

  invalidateFramebuffer: {
    parameters: [GLenum, GLsizei, GLenumv],
    result: "void",
  },

  invalidateSubFramebuffer: {
    parameters: [GLenum, GLsizei, GLenumv, GLint, GLint, GLsizei, GLsizei],
    result: "void",
  },

  readBuffer: {
    parameters: [GLenum],
    result: "void",
  },

  /// 3.7.5 Renderbuffer objects

  getInternalformativ: {
    parameters: [
      GLenum,
      GLenum,
      GLenum,
      GLsizei,
      GLintv,
    ],
    result: "void",
  },

  renderbufferStorageMultisample: {
    parameters: [
      GLenum,
      GLsizei,
      GLenum,
      GLsizei,
      GLsizei,
    ],
    result: "void",
  },

  /// 3.7.6 Texture objects

  getTexParameterfv: {
    parameters: [GLenum, GLenum, GLfloatv],
    result: "void",
  },

  texStorage2D: {
    parameters: [GLenum, GLsizei, GLenum, GLsizei, GLsizei],
    result: "void",
  },

  texStorage3D: {
    parameters: [GLenum, GLsizei, GLenum, GLsizei, GLsizei, GLsizei],
    result: "void",
  },

  texSubImage3D: {
    parameters: [
      GLenum,
      GLint,
      GLint,
      GLint,
      GLint,
      GLsizei,
      GLsizei,
      GLsizei,
      GLenum,
      GLenum,
      GLvoidptr,
    ],
    result: "void",
  },

  /// 3.7.7 Programs and Shaders

  getFragDataLocation: {
    parameters: [GLuint, GLcharptr],
    result: GLint,
  },

  /// 3.7.11 Multiple render targets

  drawBuffers: {
    parameters: [GLsizei, GLenumv],
    result: "void",
  },

  clearBufferfv: {
    parameters: [GLenum, GLint, GLfloatv],
    result: "void",
  },

  clearBufferiv: {
    parameters: [GLenum, GLint, GLintv],
    result: "void",
  },

  clearBufferuiv: {
    parameters: [GLenum, GLint, GLuintv],
    result: "void",
  },

  clearBufferfi: {
    parameters: [GLenum, GLint, GLfloat, GLint],
    result: "void",
  },

  /// 3.7.13 Sampler objects

  genSamplers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  deleteSamplers: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  isSampler: {
    parameters: [GLuint],
    result: GLboolean,
  },

  bindSampler: {
    parameters: [GLuint, GLuint],
    result: "void",
  },

  samplerParameteri: {
    parameters: [GLuint, GLenum, GLint],
    result: "void",
  },

  samplerParameterf: {
    parameters: [GLuint, GLenum, GLfloat],
    result: "void",
  },

  getSamplerParameterfv: {
    parameters: [GLuint, GLenum, GLfloatv],
    result: "void",
  },

  getSamplerParameteriv: {
    parameters: [GLuint, GLenum, GLintv],
    result: "void",
  },

  /// 3.7.17 Vertex Array objects

  bindVertexArray: {
    parameters: [GLuint],
    result: "void",
  },

  genVertexArrays: {
    parameters: [GLuint, GLuintv],
    result: GLuint,
  },

  deleteVertexArrays: {
    parameters: [GLuint, GLuintv],
    result: "void",
  },

  isVertexArray: {
    parameters: [GLuint],
    result: GLboolean,
  },

  /// 3.7.12 Query objects

  genQueries: {
    parameters: [GLsizei, GLuintv],
    result: GLuint,
  },

  deleteQueries: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  isQuery: {
    parameters: [GLuint],
    result: GLboolean,
  },

  beginQuery: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  endQuery: {
    parameters: [GLenum],
    result: "void",
  },

  getQueryiv: {
    parameters: [GLenum, GLenum, GLintv],
    result: "void",
  },

  getQueryObjectuiv: {
    parameters: [GLuint, GLenum, GLuintv],
    result: "void",
  },

  /// 3.7.14 Sync objects

  fenceSync: {
    parameters: [GLenum, GLbitfield],
    result: GLuint,
  },

  isSync: {
    parameters: [GLuint],
    result: GLboolean,
  },

  deleteSync: {
    parameters: [GLuint],
    result: "void",
  },

  clientWaitSync: {
    parameters: [GLuint, GLbitfield, GLuint64],
    result: GLenum,
  },

  waitSync: {
    parameters: [GLuint, GLbitfield, GLuint64],
    result: "void",
  },

  getSynciv: {
    parameters: [GLuint, GLenum, GLsizei, GLuintv, GLintv],
    result: "void",
  },

  /// 3.7.15 Transform feedback

  genTransformFeedbacks: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },
  
  deleteTransformFeedbacks: {
    parameters: [GLsizei, GLuintv],
    result: "void",
  },

  isTransformFeedback: {
    parameters: [GLuint],
    result: GLboolean,
  },

  bindTransformFeedback: {
    parameters: [GLenum, GLuint],
    result: "void",
  },

  beginTransformFeedback: {
    parameters: [GLenum],
    result: "void",
  },

  endTransformFeedback: {
    parameters: [],
    result: "void",
  },

  pauseTransformFeedback: {
    parameters: [],
    result: "void",
  },

  resumeTransformFeedback: {
    parameters: [],
    result: "void",
  },

  transformFeedbackVaryings: {
    parameters: [
      GLuint,
      GLsizei,
      GLcharptr,
      GLenum,
    ],
    result: "void",
  },

  getTransformFeedbackVarying: {
    parameters: [
      GLuint,
      GLuint,
      GLsizei,
      GLvoidptr,
      GLvoidptr,
      GLvoidptr,
      GLcharptr,
    ],
    result: "void",
  },

  /// 3.7.16 Uniform Buffer objects

  bindBufferBase: {
    parameters: [GLenum, GLuint, GLuint],
    result: "void",
  },

  bindBufferRange: {
    parameters: [
      GLenum,
      GLuint,
      GLuint,
      GLintptr,
      GLsizeiptr,
    ],
    result: "void",
  },

  getUniformIndices: {
    parameters: [GLuint, GLsizei, GLcharptr, GLuintv],
    result: "void",
  },

  getActiveUniformsiv: {
    parameters: [GLuint, GLsizei, GLuintv, GLenum, GLintv],
    result: "void",
  },

  getUniformBlockIndex: {
    parameters: [GLuint, GLcharptr],
    result: GLuint,
  },

  getActiveUniformBlockiv: {
    parameters: [GLuint, GLuint, GLenum, GLintv],
    result: "void",
  },

  getActiveUniformBlockName: {
    parameters: [GLuint, GLuint, GLsizei, GLvoidptr, GLcharptr],
    result: "void",
  },

  uniformBlockBinding: {
    parameters: [GLuint, GLuint, GLuint],
    result: "void",
  },
} as const;

export type Symbols = {
  -readonly [K in keyof typeof symbols]: {
    // Make non-readonly
    parameters: [...(typeof symbols)[K]["parameters"]];
    result: (typeof symbols)[K]["result"];
  };
};

const gl = new GL_CONST() as unknown as MapFFI<Symbols> & GL_CONST;

function prefixGl(name: string) {
  return `gl${name[0].toUpperCase()}${name.slice(1)}`;
}

const DEBUG = Deno.env.get("DENO_GL_DEBUG") === "1";

function checkErrors(name: string, args: any[], res: any) {
  if (!DEBUG) return;
  let err;
  while (
    name !== "getError" && (err = gl.getError()) != gl.NO_ERROR
  ) {
    console.error(
      `%cerror%c: ${name}(${
        args.map((e) => Deno.inspect(e, { colors: true })).join(", ")
      }) threw 0x${err.toString(16)} (and returned ${
        Deno.inspect(res, { colors: true })
      })`,
      "color: red",
      "",
    );
  }
}

export function init(GetProcAddress: (name: string) => Deno.UnsafePointer) {
  for (const name in symbols) {
    const glName = prefixGl(name);

    const ptr = GetProcAddress(glName);

    if (ptr.value === 0n) {
      console.error(`GetProcAddress(${glName}) returned nullptr`);
    }

    const fnptr = new Deno.UnsafeFnPointer(
      ptr,
      (symbols as Record<string, Deno.ForeignFunction>)[name],
    );

    gl[name as keyof Symbols] = ((...args: any[]) => {
      if (ptr.value === 0n) {
        // throw new Error(`GetProcAddress(${glName}) returned nullptr`);
        return;
      }
      const res = fnptr.call(...args);
      checkErrors(name, args, res);
      return res;
    }) as any;
  }
}

export default gl;
