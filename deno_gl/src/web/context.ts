import { cstr, gl, glfw } from "../core/mod.ts";
import type { Canvas } from "./canvas.ts";
import { Image } from "./image.ts";
import { extensions } from "./ext/mod.ts";
import { _invalidated, _name, WebGLObject } from "./webgl_object.ts";
import * as PNG from "https://deno.land/x/pngs@0.1.1/mod.ts";

export type GLenum = number;
export type GLboolean = boolean;
export type GLbitfield = number;
export type GLbyte = number;
export type GLshort = number;
export type GLint = number;
export type GLsizei = number;
export type GLintptr = number;
export type GLsizeiptr = number;
export type GLubyte = number;
export type GLushort = number;
export type GLuint = number;
export type GLfloat = number;
export type GLclampf = number;
export type GLuint64 = number;
export type GLint64 = number;

const TYPE_SIZE = {
  [gl.UNSIGNED_BYTE]: 1,
  [gl.FLOAT]: 4,
  [gl.HALF_FLOAT]: 2,
  [gl.UNSIGNED_SHORT_4_4_4_4]: 2,
  [gl.UNSIGNED_SHORT_5_5_5_1]: 2,
  [gl.UNSIGNED_SHORT_5_6_5]: 2,
} as const;

const TYPE_COMPONENTS = {
  [gl.UNSIGNED_BYTE]: 1,
  [gl.FLOAT]: 1,
  [gl.HALF_FLOAT]: 1,
  [gl.UNSIGNED_SHORT_4_4_4_4]: 4,
  [gl.UNSIGNED_SHORT_5_5_5_1]: 4,
  [gl.UNSIGNED_SHORT_5_6_5]: 3,
} as const;

const FORMAT_COMPONENTS = {
  [gl.RGBA]: 4,
  [gl.RGB]: 3,
  [gl.RG]: 2,
  [gl.LUMINANCE_ALPHA]: 2,
  [gl.LUMINANCE]: 1,
  [gl.ALPHA]: 1,
  [gl.DEPTH_COMPONENT]: 1,
  [gl.RED]: 1,
} as const;

export const _uniformLocation = Symbol("[[uniformLocation]]");
export const _contextLost = Symbol("[[contextLost]]");
export const _attributes = Symbol("[[attributes]]");
export const _canvas = Symbol("[[canvas]]");
export const _unpackColorspaceConversion = Symbol(
  "[[unpackColorspaceConversion]]",
);
export const _unpackFlipY = Symbol("[[unpackFlipY]]");
export const _unpackPremultiplyAlpha = Symbol(
  "[[unpackPremultiplyAlpha]]",
);

export class WebGLBuffer extends WebGLObject {}

export class WebGLFramebuffer extends WebGLObject {}

export class WebGLProgram extends WebGLObject {}

export class WebGLRenderbuffer extends WebGLObject {}

export class WebGLShader extends WebGLObject {}

export class WebGLTexture extends WebGLObject {}

export class WebGLQuery extends WebGLObject {}

export class WebGLSampler extends WebGLObject {}

export class WebGLSync extends WebGLObject {}

export class WebGLTransformFeedback extends WebGLObject {}

export class WebGLVertexArrayObject extends WebGLObject {}

export class WebGLUniformLocation {
  [_uniformLocation]: number;

  constructor(location: number) {
    this[_uniformLocation] = location;
  }

  [Symbol.for("Deno.customInspect")]() {
    return `WebGLUniformLocation(${this[_uniformLocation]})`;
  }
}

export interface WebGLActiveInfo {
  size: number;
  type: number;
  name: string;
}

export interface WebGLShaderPrecisionFormat {
  rangeMin: number;
  rangeMax: number;
  precision: number;
}

export interface WebGLContextAttributes {
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  antialias?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
  failIfMajorPerformanceCaveat?: boolean;
  desynchronized?: boolean;
}

export class WebGL2RenderingContext {
  /// Internal slots
  [_canvas]: Canvas;
  [_contextLost] = false;
  [_attributes]: WebGLContextAttributes;

  /// WebGL specific parameters
  [_unpackColorspaceConversion] = gl.NONE;
  [_unpackFlipY] = false;
  [_unpackPremultiplyAlpha] = false;

  /// Constructor used by Canvas
  constructor(
    canvas: Canvas,
    attributes: WebGLContextAttributes,
  ) {
    this[_canvas] = canvas;
    this[_attributes] = attributes;
  }

  /// Constants

  // FALSE = 0;
  // TRUE = 1;

  /* ClearBufferMask */
  DEPTH_BUFFER_BIT = 0x00000100;
  STENCIL_BUFFER_BIT = 0x00000400;
  COLOR_BUFFER_BIT = 0x00004000;

  /* BeginMode */
  POINTS = 0x0000;
  LINES = 0x0001;
  LINE_LOOP = 0x0002;
  LINE_STRIP = 0x0003;
  TRIANGLES = 0x0004;
  TRIANGLE_STRIP = 0x0005;
  TRIANGLE_FAN = 0x0006;

  /* AlphaFunction (not supported in ES20) */
  /*      NEVER */
  /*      LESS */
  /*      EQUAL */
  /*      LEQUAL */
  /*      GREATER */
  /*      NOTEQUAL */
  /*      GEQUAL */
  /*      ALWAYS */

  /* BlendingFactorDest */
  ZERO = 0;
  ONE = 1;
  SRC_COLOR = 0x0300;
  ONE_MINUS_SRC_COLOR = 0x0301;
  SRC_ALPHA = 0x0302;
  ONE_MINUS_SRC_ALPHA = 0x0303;
  DST_ALPHA = 0x0304;
  ONE_MINUS_DST_ALPHA = 0x0305;

  /* BlendingFactorSrc */
  /*      ZERO */
  /*      ONE */
  DST_COLOR = 0x0306;
  ONE_MINUS_DST_COLOR = 0x0307;
  SRC_ALPHA_SATURATE = 0x0308;
  /*      SRC_ALPHA */
  /*      ONE_MINUS_SRC_ALPHA */
  /*      DST_ALPHA */
  /*      ONE_MINUS_DST_ALPHA */

  /* BlendEquationSeparate */
  FUNC_ADD = 0x8006;
  BLEND_EQUATION = 0x8009;
  BLEND_EQUATION_RGB = 0x8009; /* same as BLEND_EQUATION */
  BLEND_EQUATION_ALPHA = 0x883D;

  /* BlendSubtract */
  FUNC_SUBTRACT = 0x800A;
  FUNC_REVERSE_SUBTRACT = 0x800B;

  /* Separate Blend Functions */
  BLEND_DST_RGB = 0x80C8;
  BLEND_SRC_RGB = 0x80C9;
  BLEND_DST_ALPHA = 0x80CA;
  BLEND_SRC_ALPHA = 0x80CB;
  CONSTANT_COLOR = 0x8001;
  ONE_MINUS_CONSTANT_COLOR = 0x8002;
  CONSTANT_ALPHA = 0x8003;
  ONE_MINUS_CONSTANT_ALPHA = 0x8004;
  BLEND_COLOR = 0x8005;

  /* Buffer Objects */
  ARRAY_BUFFER = 0x8892;
  ELEMENT_ARRAY_BUFFER = 0x8893;
  ARRAY_BUFFER_BINDING = 0x8894;
  ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;

  STREAM_DRAW = 0x88E0;
  STATIC_DRAW = 0x88E4;
  DYNAMIC_DRAW = 0x88E8;

  BUFFER_SIZE = 0x8764;
  BUFFER_USAGE = 0x8765;

  CURRENT_VERTEX_ATTRIB = 0x8626;

  /* CullFaceMode */
  FRONT = 0x0404;
  BACK = 0x0405;
  FRONT_AND_BACK = 0x0408;

  /* DepthFunction */
  /*      NEVER */
  /*      LESS */
  /*      EQUAL */
  /*      LEQUAL */
  /*      GREATER */
  /*      NOTEQUAL */
  /*      GEQUAL */
  /*      ALWAYS */

  /* EnableCap */
  /* TEXTURE_2D */
  CULL_FACE = 0x0B44;
  BLEND = 0x0BE2;
  DITHER = 0x0BD0;
  STENCIL_TEST = 0x0B90;
  DEPTH_TEST = 0x0B71;
  SCISSOR_TEST = 0x0C11;
  POLYGON_OFFSET_FILL = 0x8037;
  SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
  SAMPLE_COVERAGE = 0x80A0;

  /* ErrorCode */
  NO_ERROR = 0;
  INVALID_ENUM = 0x0500;
  INVALID_VALUE = 0x0501;
  INVALID_OPERATION = 0x0502;
  OUT_OF_MEMORY = 0x0505;

  /* FrontFaceDirection */
  CW = 0x0900;
  CCW = 0x0901;

  /* GetPName */
  LINE_WIDTH = 0x0B21;
  ALIASED_POINT_SIZE_RANGE = 0x846D;
  ALIASED_LINE_WIDTH_RANGE = 0x846E;
  CULL_FACE_MODE = 0x0B45;
  FRONT_FACE = 0x0B46;
  DEPTH_RANGE = 0x0B70;
  DEPTH_WRITEMASK = 0x0B72;
  DEPTH_CLEAR_VALUE = 0x0B73;
  DEPTH_FUNC = 0x0B74;
  STENCIL_CLEAR_VALUE = 0x0B91;
  STENCIL_FUNC = 0x0B92;
  STENCIL_FAIL = 0x0B94;
  STENCIL_PASS_DEPTH_FAIL = 0x0B95;
  STENCIL_PASS_DEPTH_PASS = 0x0B96;
  STENCIL_REF = 0x0B97;
  STENCIL_VALUE_MASK = 0x0B93;
  STENCIL_WRITEMASK = 0x0B98;
  STENCIL_BACK_FUNC = 0x8800;
  STENCIL_BACK_FAIL = 0x8801;
  STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;
  STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;
  STENCIL_BACK_REF = 0x8CA3;
  STENCIL_BACK_VALUE_MASK = 0x8CA4;
  STENCIL_BACK_WRITEMASK = 0x8CA5;
  VIEWPORT = 0x0BA2;
  SCISSOR_BOX = 0x0C10;
  /*      SCISSOR_TEST */
  COLOR_CLEAR_VALUE = 0x0C22;
  COLOR_WRITEMASK = 0x0C23;
  UNPACK_ALIGNMENT = 0x0CF5;
  PACK_ALIGNMENT = 0x0D05;
  MAX_TEXTURE_SIZE = 0x0D33;
  MAX_VIEWPORT_DIMS = 0x0D3A;
  SUBPIXEL_BITS = 0x0D50;
  RED_BITS = 0x0D52;
  GREEN_BITS = 0x0D53;
  BLUE_BITS = 0x0D54;
  ALPHA_BITS = 0x0D55;
  DEPTH_BITS = 0x0D56;
  STENCIL_BITS = 0x0D57;
  POLYGON_OFFSET_UNITS = 0x2A00;
  /*      POLYGON_OFFSET_FILL */
  POLYGON_OFFSET_FACTOR = 0x8038;
  TEXTURE_BINDING_2D = 0x8069;
  SAMPLE_BUFFERS = 0x80A8;
  SAMPLES = 0x80A9;
  SAMPLE_COVERAGE_VALUE = 0x80AA;
  SAMPLE_COVERAGE_INVERT = 0x80AB;

  /* GetTextureParameter */
  /*      TEXTURE_MAG_FILTER */
  /*      TEXTURE_MIN_FILTER */
  /*      TEXTURE_WRAP_S */
  /*      TEXTURE_WRAP_T */

  COMPRESSED_TEXTURE_FORMATS = 0x86A3;

  /* HintMode */
  DONT_CARE = 0x1100;
  FASTEST = 0x1101;
  NICEST = 0x1102;

  /* HintTarget */
  GENERATE_MIPMAP_HINT = 0x8192;

  /* DataType */
  BYTE = 0x1400;
  UNSIGNED_BYTE = 0x1401;
  SHORT = 0x1402;
  UNSIGNED_SHORT = 0x1403;
  INT = 0x1404;
  UNSIGNED_INT = 0x1405;
  FLOAT = 0x1406;

  /* PixelFormat */
  DEPTH_COMPONENT = 0x1902;
  ALPHA = 0x1906;
  RGB = 0x1907;
  RGBA = 0x1908;
  LUMINANCE = 0x1909;
  LUMINANCE_ALPHA = 0x190A;

  /* PixelType */
  /*      UNSIGNED_BYTE */
  UNSIGNED_SHORT_4_4_4_4 = 0x8033;
  UNSIGNED_SHORT_5_5_5_1 = 0x8034;
  UNSIGNED_SHORT_5_6_5 = 0x8363;

  /* Shaders */
  FRAGMENT_SHADER = 0x8B30;
  VERTEX_SHADER = 0x8B31;
  MAX_VERTEX_ATTRIBS = 0x8869;
  MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
  MAX_VARYING_VECTORS = 0x8DFC;
  MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
  MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
  MAX_TEXTURE_IMAGE_UNITS = 0x8872;
  MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
  SHADER_TYPE = 0x8B4F;
  DELETE_STATUS = 0x8B80;
  LINK_STATUS = 0x8B82;
  VALIDATE_STATUS = 0x8B83;
  ATTACHED_SHADERS = 0x8B85;
  ACTIVE_UNIFORMS = 0x8B86;
  ACTIVE_ATTRIBUTES = 0x8B89;
  SHADING_LANGUAGE_VERSION = 0x8B8C;
  CURRENT_PROGRAM = 0x8B8D;

  /* StencilFunction */
  NEVER = 0x0200;
  LESS = 0x0201;
  EQUAL = 0x0202;
  LEQUAL = 0x0203;
  GREATER = 0x0204;
  NOTEQUAL = 0x0205;
  GEQUAL = 0x0206;
  ALWAYS = 0x0207;

  /* StencilOp */
  /*      ZERO */
  KEEP = 0x1E00;
  REPLACE = 0x1E01;
  INCR = 0x1E02;
  DECR = 0x1E03;
  INVERT = 0x150A;
  INCR_WRAP = 0x8507;
  DECR_WRAP = 0x8508;

  /* StringName */
  VENDOR = 0x1F00;
  RENDERER = 0x1F01;
  VERSION = 0x1F02;

  /* TextureMagFilter */
  NEAREST = 0x2600;
  LINEAR = 0x2601;

  /* TextureMinFilter */
  /*      NEAREST */
  /*      LINEAR */
  NEAREST_MIPMAP_NEAREST = 0x2700;
  LINEAR_MIPMAP_NEAREST = 0x2701;
  NEAREST_MIPMAP_LINEAR = 0x2702;
  LINEAR_MIPMAP_LINEAR = 0x2703;

  /* TextureParameterName */
  TEXTURE_MAG_FILTER = 0x2800;
  TEXTURE_MIN_FILTER = 0x2801;
  TEXTURE_WRAP_S = 0x2802;
  TEXTURE_WRAP_T = 0x2803;

  /* TextureTarget */
  TEXTURE_2D = 0x0DE1;
  TEXTURE = 0x1702;

  TEXTURE_CUBE_MAP = 0x8513;
  TEXTURE_BINDING_CUBE_MAP = 0x8514;
  TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
  TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
  TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
  TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
  TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
  TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
  MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;

  /* TextureUnit */
  TEXTURE0 = 0x84C0;
  TEXTURE1 = 0x84C1;
  TEXTURE2 = 0x84C2;
  TEXTURE3 = 0x84C3;
  TEXTURE4 = 0x84C4;
  TEXTURE5 = 0x84C5;
  TEXTURE6 = 0x84C6;
  TEXTURE7 = 0x84C7;
  TEXTURE8 = 0x84C8;
  TEXTURE9 = 0x84C9;
  TEXTURE10 = 0x84CA;
  TEXTURE11 = 0x84CB;
  TEXTURE12 = 0x84CC;
  TEXTURE13 = 0x84CD;
  TEXTURE14 = 0x84CE;
  TEXTURE15 = 0x84CF;
  TEXTURE16 = 0x84D0;
  TEXTURE17 = 0x84D1;
  TEXTURE18 = 0x84D2;
  TEXTURE19 = 0x84D3;
  TEXTURE20 = 0x84D4;
  TEXTURE21 = 0x84D5;
  TEXTURE22 = 0x84D6;
  TEXTURE23 = 0x84D7;
  TEXTURE24 = 0x84D8;
  TEXTURE25 = 0x84D9;
  TEXTURE26 = 0x84DA;
  TEXTURE27 = 0x84DB;
  TEXTURE28 = 0x84DC;
  TEXTURE29 = 0x84DD;
  TEXTURE30 = 0x84DE;
  TEXTURE31 = 0x84DF;
  ACTIVE_TEXTURE = 0x84E0;

  /* TextureWrapMode */
  REPEAT = 0x2901;
  CLAMP_TO_EDGE = 0x812F;
  MIRRORED_REPEAT = 0x8370;

  /* Uniform Types */
  FLOAT_VEC2 = 0x8B50;
  FLOAT_VEC3 = 0x8B51;
  FLOAT_VEC4 = 0x8B52;
  INT_VEC2 = 0x8B53;
  INT_VEC3 = 0x8B54;
  INT_VEC4 = 0x8B55;
  BOOL = 0x8B56;
  BOOL_VEC2 = 0x8B57;
  BOOL_VEC3 = 0x8B58;
  BOOL_VEC4 = 0x8B59;
  FLOAT_MAT2 = 0x8B5A;
  FLOAT_MAT3 = 0x8B5B;
  FLOAT_MAT4 = 0x8B5C;
  SAMPLER_2D = 0x8B5E;
  SAMPLER_CUBE = 0x8B60;

  /* Vertex Arrays */
  VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;
  VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;
  VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;
  VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;
  VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A;
  VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;
  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

  /* Read Format */
  IMPLEMENTATION_COLOR_READ_TYPE = 0x8B9A;
  IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B;

  /* Shader Source */
  COMPILE_STATUS = 0x8B81;

  /* Shader Precision-Specified Types */
  LOW_FLOAT = 0x8DF0;
  MEDIUM_FLOAT = 0x8DF1;
  HIGH_FLOAT = 0x8DF2;
  LOW_INT = 0x8DF3;
  MEDIUM_INT = 0x8DF4;
  HIGH_INT = 0x8DF5;

  /* Framebuffer Object. */
  FRAMEBUFFER = 0x8D40;
  RENDERBUFFER = 0x8D41;

  RGBA4 = 0x8056;
  RGB5_A1 = 0x8057;
  RGB565 = 0x8D62;
  DEPTH_COMPONENT16 = 0x81A5;
  STENCIL_INDEX8 = 0x8D48;
  DEPTH_STENCIL = 0x84F9;

  RENDERBUFFER_WIDTH = 0x8D42;
  RENDERBUFFER_HEIGHT = 0x8D43;
  RENDERBUFFER_INTERNAL_FORMAT = 0x8D44;
  RENDERBUFFER_RED_SIZE = 0x8D50;
  RENDERBUFFER_GREEN_SIZE = 0x8D51;
  RENDERBUFFER_BLUE_SIZE = 0x8D52;
  RENDERBUFFER_ALPHA_SIZE = 0x8D53;
  RENDERBUFFER_DEPTH_SIZE = 0x8D54;
  RENDERBUFFER_STENCIL_SIZE = 0x8D55;

  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8CD0;
  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8CD1;
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8CD2;
  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;

  COLOR_ATTACHMENT0 = 0x8CE0;
  DEPTH_ATTACHMENT = 0x8D00;
  STENCIL_ATTACHMENT = 0x8D20;
  DEPTH_STENCIL_ATTACHMENT = 0x821A;

  NONE = 0;

  FRAMEBUFFER_COMPLETE = 0x8CD5;
  FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
  FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
  FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

  FRAMEBUFFER_BINDING = 0x8CA6;
  RENDERBUFFER_BINDING = 0x8CA7;
  MAX_RENDERBUFFER_SIZE = 0x84E8;

  INVALID_FRAMEBUFFER_OPERATION = 0x0506;

  /* WebGL-specific enums */
  UNPACK_FLIP_Y_WEBGL = 0x9240;
  UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
  CONTEXT_LOST_WEBGL = 0x9242;
  UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
  BROWSER_DEFAULT_WEBGL = 0x9244;

  /// 5.14.1 Attributes

  get canvas() {
    return this[_canvas];
  }

  get drawingBufferWidth() {
    return this.canvas.width;
  }

  get drawingBufferHeight() {
    return this.canvas.height;
  }

  /// 5.14.2 Getting information about the context

  getContextAttributes() {
    if (this[_contextLost]) {
      return null;
    } else {
      return this[_attributes];
    }
  }

  /// 5.14.3 Setting and getting state

  activeTexture(texture: GLenum): void {
    gl.activeTexture(texture);
  }

  blendColor(
    red: GLclampf,
    green: GLclampf,
    blue: GLclampf,
    alpha: GLclampf,
  ): void {
    gl.blendColor(red, green, blue, alpha);
  }

  blendEquation(mode: GLenum): void {
    gl.blendEquation(mode);
  }

  blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void {
    gl.blendEquationSeparate(modeRGB, modeAlpha);
  }

  blendFunc(sfactor: GLenum, dfactor: GLenum): void {
    gl.blendFunc(sfactor, dfactor);
  }

  blendFuncSeparate(
    srcRGB: GLenum,
    dstRGB: GLenum,
    srcAlpha: GLenum,
    dstAlpha: GLenum,
  ): void {
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
  }

  clearColor(
    red: GLclampf,
    green: GLclampf,
    blue: GLclampf,
    alpha: GLclampf,
  ): void {
    gl.clearColor(red, green, blue, alpha);
  }

  clearDepth(depth: GLclampf): void {
    gl.clearDepthf(depth);
  }

  clearStencil(s: GLint): void {
    gl.clearStencil(s);
  }

  colorMask(
    red: GLboolean,
    green: GLboolean,
    blue: GLboolean,
    alpha: GLboolean,
  ): void {
    gl.colorMask(Number(red), Number(green), Number(blue), Number(alpha));
  }

  cullFace(mode: GLenum): void {
    gl.cullFace(mode);
  }

  depthFunc(func: GLenum): void {
    gl.depthFunc(func);
  }

  depthMask(flag: GLboolean): void {
    gl.depthMask(Number(flag));
  }

  depthRange(zNear: GLclampf, zFar: GLclampf): void {
    gl.depthRangef(zNear, zFar);
  }

  disable(cap: GLenum): void {
    gl.disable(cap);
  }

  enable(cap: GLenum): void {
    gl.enable(cap);
  }

  frontFace(mode: GLenum): void {
    gl.frontFace(mode);
  }

  getParameter(pname: GLenum): any {
    switch (pname) {
      // Return type: GLenum

      case this.ACTIVE_TEXTURE:
      case this.BLEND_DST_ALPHA:
      case this.BLEND_DST_RGB:
      case this.BLEND_EQUATION_ALPHA:
      case this.BLEND_EQUATION_RGB:
      case this.BLEND_SRC_ALPHA:
      case this.BLEND_SRC_RGB:
      case this.CULL_FACE_MODE:
      case this.DEPTH_FUNC:
      case this.FRONT_FACE:
      case this.GENERATE_MIPMAP_HINT:
      case this.IMPLEMENTATION_COLOR_READ_FORMAT:
      case this.IMPLEMENTATION_COLOR_READ_TYPE:
      case this.STENCIL_BACK_FAIL:
      case this.STENCIL_BACK_FUNC:
      case this.STENCIL_BACK_PASS_DEPTH_FAIL:
      case this.STENCIL_BACK_PASS_DEPTH_PASS:
      case this.STENCIL_FAIL:
      case this.STENCIL_FUNC:
      case this.STENCIL_PASS_DEPTH_FAIL:
      case this.STENCIL_PASS_DEPTH_PASS:
      case this.DRAW_BUFFER0:
      case this.DRAW_BUFFER1:
      case this.DRAW_BUFFER2:
      case this.DRAW_BUFFER3:
      case this.DRAW_BUFFER4:
      case this.DRAW_BUFFER5:
      case this.DRAW_BUFFER6:
      case this.DRAW_BUFFER7:
      case this.DRAW_BUFFER8:
      case this.DRAW_BUFFER9:
      case this.DRAW_BUFFER10:
      case this.DRAW_BUFFER11:
      case this.DRAW_BUFFER12:
      case this.DRAW_BUFFER13:
      case this.DRAW_BUFFER14:
      case this.DRAW_BUFFER15:
      case this.FRAGMENT_SHADER_DERIVATIVE_HINT:
      case this.READ_BUFFER: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        return data[0];
      }

      // Return type: Float32Array(2)

      case this.ALIASED_LINE_WIDTH_RANGE:
      case this.ALIASED_POINT_SIZE_RANGE:
      case this.DEPTH_RANGE: {
        const data = new Float32Array(2);
        gl.getFloatv(pname, data);
        return data;
      }

      // Return type: GLint

      case this.ALPHA_BITS:
      case this.BLUE_BITS:
      case this.DEPTH_BITS:
      case this.GREEN_BITS:
      case this.MAX_COMBINED_TEXTURE_IMAGE_UNITS:
      case this.MAX_CUBE_MAP_TEXTURE_SIZE:
      case this.MAX_FRAGMENT_UNIFORM_VECTORS:
      case this.MAX_RENDERBUFFER_SIZE:
      case this.MAX_TEXTURE_IMAGE_UNITS:
      case this.MAX_TEXTURE_SIZE:
      case this.MAX_VARYING_VECTORS:
      case this.MAX_VERTEX_ATTRIBS:
      case this.MAX_VERTEX_TEXTURE_IMAGE_UNITS:
      case this.MAX_VERTEX_UNIFORM_VECTORS:
      case this.PACK_ALIGNMENT:
      case this.RED_BITS:
      case this.SAMPLE_BUFFERS:
      case this.SAMPLES:
      case this.STENCIL_BACK_REF:
      case this.STENCIL_BITS:
      case this.STENCIL_CLEAR_VALUE:
      case this.STENCIL_REF:
      case this.SUBPIXEL_BITS:
      case this.UNPACK_ALIGNMENT:
      case this.MAX_3D_TEXTURE_SIZE:
      case this.MAX_ARRAY_TEXTURE_LAYERS:
      case this.MAX_COLOR_ATTACHMENTS:
      case this.MAX_COMBINED_UNIFORM_BLOCKS:
      case this.MAX_DRAW_BUFFERS:
      case this.MAX_ELEMENTS_INDICES:
      case this.MAX_ELEMENTS_VERTICES:
      case this.MAX_FRAGMENT_INPUT_COMPONENTS:
      case this.MAX_FRAGMENT_UNIFORM_BLOCKS:
      case this.MAX_FRAGMENT_UNIFORM_COMPONENTS:
      case this.MAX_PROGRAM_TEXEL_OFFSET:
      case this.MAX_SAMPLES:
      case this.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS:
      case this.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS:
      case this.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS:
      case this.MAX_UNIFORM_BUFFER_BINDINGS:
      case this.MAX_VARYING_COMPONENTS:
      case this.MAX_VERTEX_OUTPUT_COMPONENTS:
      case this.MAX_VERTEX_UNIFORM_BLOCKS:
      case this.MAX_VERTEX_UNIFORM_COMPONENTS:
      case this.MIN_PROGRAM_TEXEL_OFFSET:
      case this.PACK_ROW_LENGTH:
      case this.PACK_SKIP_PIXELS:
      case this.PACK_SKIP_ROWS:
      case this.UNIFORM_BUFFER_OFFSET_ALIGNMENT:
      case this.UNPACK_IMAGE_HEIGHT:
      case this.UNPACK_ROW_LENGTH:
      case this.UNPACK_SKIP_IMAGES:
      case this.UNPACK_SKIP_PIXELS:
      case this.UNPACK_SKIP_ROWS: {
        const data = new Int32Array(1);
        gl.getIntegerv(pname, data);
        return data[0];
      }

      // Return type: WebGLBuffer

      case this.ARRAY_BUFFER_BINDING:
      case this.ELEMENT_ARRAY_BUFFER_BINDING:
      case this.COPY_READ_BUFFER_BINDING:
      case this.COPY_WRITE_BUFFER_BINDING:
      case this.PIXEL_PACK_BUFFER_BINDING:
      case this.PIXEL_UNPACK_BUFFER_BINDING:
      case this.TRANSFORM_FEEDBACK_BUFFER_BINDING:
      case this.UNIFORM_BUFFER_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLBuffer.make(data[0]);
      }

      // Return type: GLboolean

      case this.BLEND:
      case this.CULL_FACE:
      case this.DEPTH_TEST:
      case this.DEPTH_WRITEMASK:
      case this.DITHER:
      case this.POLYGON_OFFSET_FILL:
      case this.SAMPLE_ALPHA_TO_COVERAGE:
      case this.SAMPLE_COVERAGE:
      case this.SAMPLE_COVERAGE_INVERT:
      case this.SCISSOR_TEST:
      case this.STENCIL_TEST:
      case this.RASTERIZER_DISCARD:
      case this.TRANSFORM_FEEDBACK_ACTIVE:
      case this.TRANSFORM_FEEDBACK_PAUSED:
      // GPU_DISJOINT_EXT
      case 0x8FBB: {
        const data = new Uint8Array(1);
        gl.getBooleanv(pname, data);
        return Boolean(data[0]);
      }

      // Return type: Float32Array(4)

      case this.BLEND_COLOR:
      case this.COLOR_CLEAR_VALUE: {
        const data = new Float32Array(4);
        gl.getFloatv(pname, data);
        return data;
      }

      // Return type: boolean[4]

      case this.COLOR_WRITEMASK: {
        const data = new Uint8Array(4);
        gl.getBooleanv(pname, data);
        return [
          Boolean(data[0]),
          Boolean(data[1]),
          Boolean(data[2]),
          Boolean(data[3]),
        ];
      }

      // Return type: Uint32Array(n)

      case this.COMPRESSED_TEXTURE_FORMATS: {
        const len = new Uint32Array(1);
        gl.getIntegerv(gl.NUM_COMPRESSED_TEXTURE_FORMATS, len);
        const data = new Uint32Array(len[0]);
        gl.getIntegerv(pname, data);
        return data;
      }

      // Return type: WebGLProgram

      case this.CURRENT_PROGRAM: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLProgram.make(data[0]);
      }

      // Return type: GLfloat

      case this.DEPTH_CLEAR_VALUE:
      case this.LINE_WIDTH:
      case this.POLYGON_OFFSET_FACTOR:
      case this.POLYGON_OFFSET_UNITS:
      case this.SAMPLE_COVERAGE_VALUE:
      case this.MAX_TEXTURE_LOD_BIAS: {
        const data = new Float32Array(1);
        gl.getFloatv(pname, data);
        return data[0];
      }

      // Return type: WebGLFramebuffer

      case this.FRAMEBUFFER_BINDING:
      case this.DRAW_FRAMEBUFFER_BINDING:
      case this.READ_FRAMEBUFFER_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLFramebuffer.make(data[0]);
      }

      // Return type: Int32Array(2)

      case this.MAX_VIEWPORT_DIMS: {
        const data = new Int32Array(2);
        gl.getIntegerv(pname, data);
        return data;
      }

      // Return type: WebGLRenderbuffer

      case this.RENDERBUFFER_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLRenderbuffer.make(data[0]);
      }

      // Return type: string

      case this.RENDERER:
      case this.SHADING_LANGUAGE_VERSION:
      case this.VENDOR:
      case this.VERSION: {
        const ptr = gl.getString(pname);
        if (ptr.value === 0n) {
          return null;
        } else {
          const str = new Deno.UnsafePointerView(ptr).getCString();
          if (pname === this.VERSION) {
            return `WebGL 2.0 (${str})`;
          } else if (pname === this.SHADING_LANGUAGE_VERSION) {
            return `WebGL GLSL ES 3.00 (${str})`;
          } else {
            return str;
          }
        }
      }

      // Return type: Int32Array(4)

      case this.SCISSOR_BOX:
      case this.VIEWPORT: {
        const data = new Int32Array(4);
        gl.getIntegerv(pname, data);
        return data;
      }

      // Return type: GLuint

      case this.STENCIL_BACK_VALUE_MASK:
      case this.STENCIL_BACK_WRITEMASK:
      case this.STENCIL_VALUE_MASK:
      case this.STENCIL_WRITEMASK: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        return data[0];
      }

      // Return type: WebGLTexture

      case this.TEXTURE_BINDING_2D:
      case this.TEXTURE_BINDING_CUBE_MAP:
      case this.TEXTURE_BINDING_2D_ARRAY:
      case this.TEXTURE_BINDING_3D: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLTexture.make(data[0]);
      }

      // Return type: GLint64

      case this.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS:
      case this.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS:
      case this.MAX_ELEMENT_INDEX:
      case this.MAX_SERVER_WAIT_TIMEOUT:
      case this.MAX_UNIFORM_BLOCK_SIZE: {
        const data = new BigInt64Array(1);
        gl.getInteger64v(pname, data);
        return Number(data[0]);
      }

      // Return type: WebGLSampler

      case this.SAMPLER_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLSampler.make(data[0]);
      }

      // Return type: WebGLTransformFeedback

      case this.TRANSFORM_FEEDBACK_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLTransformFeedback.make(data[0]);
      }

      // Return type: WebGLVertexArrayObject

      case this.VERTEX_ARRAY_BINDING: {
        const data = new Uint32Array(1);
        gl.getIntegerv(pname, data);
        if (data[0] === 0) return null;
        return WebGLVertexArrayObject.make(data[0]);
      }

      /// WebGL special

      case this.UNPACK_COLORSPACE_CONVERSION_WEBGL: {
        return this[_unpackColorspaceConversion];
      }

      case this.UNPACK_FLIP_Y_WEBGL: {
        return this[_unpackFlipY];
      }

      case this.UNPACK_PREMULTIPLY_ALPHA_WEBGL: {
        return this[_unpackPremultiplyAlpha];
      }

      case this.MAX_CLIENT_WAIT_TIMEOUT_WEBGL: {
        return 0;
      }

      default:
        return null;
    }
  }

  getError(): GLenum {
    return gl.getError();
  }

  hint(target: GLenum, mode: GLenum): void {
    gl.hint(target, mode);
  }

  isEnabled(cap: GLenum): boolean {
    if (this[_contextLost]) {
      return false;
    }
    return Boolean(gl.isEnabled(cap));
  }

  lineWidth(width: GLfloat): void {
    gl.lineWidth(width);
  }

  pixelStorei(pname: GLenum, param: GLint | GLboolean): void {
    switch (pname) {
      case this.UNPACK_COLORSPACE_CONVERSION_WEBGL:
        this[_unpackColorspaceConversion] = Number(param);
        break;

      case this.UNPACK_FLIP_Y_WEBGL:
        this[_unpackFlipY] = Boolean(param);
        break;

      case this.UNPACK_PREMULTIPLY_ALPHA_WEBGL:
        this[_unpackPremultiplyAlpha] = Boolean(param);
        break;

      default:
        if (
          typeof pname !== "number" ||
          (typeof param !== "number" && typeof param !== "boolean")
        ) {
          return;
        }
        gl.pixelStorei(pname, Number(param));
        break;
    }
  }

  polygonOffset(factor: GLfloat, units: GLfloat): void {
    gl.polygonOffset(factor, units);
  }

  sampleCoverage(value: GLclampf, invert: GLboolean): void {
    gl.sampleCoverage(value, Number(invert));
  }

  stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void {
    gl.stencilFunc(func, ref, mask);
  }

  stencilFuncSeparate(
    face: GLenum,
    func: GLenum,
    ref: GLint,
    mask: GLuint,
  ): void {
    gl.stencilFuncSeparate(face, func, ref, mask);
  }

  stencilMask(mask: GLuint): void {
    gl.stencilMask(mask);
  }

  stencilMaskSeparate(face: GLenum, mask: GLuint): void {
    gl.stencilMaskSeparate(face, mask);
  }

  stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    gl.stencilOp(fail, zfail, zpass);
  }

  stencilOpSeparate(
    face: GLenum,
    fail: GLenum,
    zfail: GLenum,
    zpass: GLenum,
  ): void {
    gl.stencilOpSeparate(face, fail, zfail, zpass);
  }

  /// 5.14.4 Viewing and clipping

  scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    gl.scissor(x, y, width, height);
  }

  viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    gl.viewport(x, y, width, height);
  }

  /// 5.14.5 Buffer objects

  bindBuffer(target: GLenum, buffer: WebGLBuffer | null): void {
    gl.bindBuffer(target, buffer?.[_name] ?? 0);
  }

  bufferData(
    target: GLenum,
    size: GLsizeiptr,
    usage: GLenum,
    srcOffset?: GLuint,
    length?: GLuint,
  ): void;
  bufferData(
    target: GLenum,
    data: BufferSource,
    usage: GLenum,
    srcOffset?: GLuint,
    length?: GLuint,
  ): void;
  bufferData(
    target: GLenum,
    data: GLsizeiptr | BufferSource,
    usage: GLenum,
    srcOffset: GLuint = 0,
    _length: GLuint = 0,
  ): void {
    if (typeof data === "number") {
      gl.bufferData(target, data, new Uint8Array(data), usage);
    } else {
      gl.bufferData(
        target,
        data.byteLength,
        data instanceof ArrayBuffer
          ? new Uint8Array(data, srcOffset)
          : new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
        usage,
      );
    }
  }

  bufferSubData(
    target: GLenum,
    offset: GLintptr,
    data: BufferSource,
    srcOffset: GLuint = 0,
    _length: GLuint = 0,
  ): void {
    gl.bufferSubData(
      target,
      offset,
      data.byteLength,
      data instanceof ArrayBuffer
        ? new Uint8Array(data, srcOffset)
        : new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    );
  }

  createBuffer(): WebGLBuffer | null {
    const buffer = new Uint32Array(1);
    gl.genBuffers(1, buffer);
    if (buffer[0] === 0) {
      return null;
    }
    return WebGLBuffer.make(buffer[0]);
  }

  deleteBuffer(buffer: WebGLBuffer | null): void {
    gl.deleteBuffers(1, new Uint32Array([buffer?.[_name] ?? 0]));
  }

  getBufferParameter(target: GLenum, pname: GLenum): any {
    switch (pname) {
      case this.BUFFER_SIZE: {
        const data = new BigUint64Array(1);
        gl.getBufferParameteri64v(target, pname, data);
        return Number(data[0]);
      }

      case this.BUFFER_USAGE: {
        const data = new Uint32Array(1);
        gl.getBufferParameteriv(target, pname, data);
        return data[0];
      }

      default:
        return null;
    }
  }

  isBuffer(buffer: WebGLBuffer | null): boolean {
    if (this[_contextLost]) {
      return false;
    }
    if (buffer === null) {
      return false;
    }
    if (buffer[_invalidated]) {
      return false;
    }
    return Boolean(gl.isBuffer(buffer[_name]));
  }

  /// 5.14.6 Framebuffer objects

  bindFramebuffer(target: GLenum, framebuffer: WebGLFramebuffer | null): void {
    gl.bindFramebuffer(target, framebuffer?.[_name] ?? 0);
  }

  checkFramebufferStatus(target: GLenum): GLenum {
    if (this[_contextLost]) {
      return this.FRAMEBUFFER_UNSUPPORTED;
    }
    return gl.checkFramebufferStatus(target);
  }

  createFramebuffer(): WebGLFramebuffer | null {
    const framebuffer = new Uint32Array(1);
    gl.genFramebuffers(1, framebuffer);
    if (framebuffer[0] === 0) {
      return null;
    }
    return WebGLFramebuffer.make(framebuffer[0]);
  }

  deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void {
    gl.deleteFramebuffers(1, new Uint32Array([framebuffer?.[_name] ?? 0]));
  }

  framebufferRenderbuffer(
    target: GLenum,
    attachment: GLenum,
    renderbuffertarget: GLenum,
    renderbuffer: WebGLRenderbuffer | null,
  ): void {
    gl.framebufferRenderbuffer(
      target,
      attachment,
      renderbuffertarget,
      renderbuffer?.[_name] ?? 0,
    );
  }

  framebufferTexture2D(
    target: GLenum,
    attachment: GLenum,
    textarget: GLenum,
    texture: WebGLTexture | null,
    level: GLint,
  ): void {
    gl.framebufferTexture2D(
      target,
      attachment,
      textarget,
      texture?.[_name] ?? 0,
      level,
    );
  }

  getFramebufferAttachmentParameter(
    target: GLenum,
    attachment: GLenum,
    pname: GLenum,
  ): any {
    if (
      typeof target !== "number" || typeof attachment !== "number" ||
      typeof pname !== "number"
    ) {
      return null;
    }

    switch (pname) {
      case this.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:
      case this.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:
      case this.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE:
      case this.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: {
        const data = new Uint32Array(1);
        gl.getFramebufferAttachmentParameteriv(
          target,
          attachment,
          pname,
          data,
        );
        return data[0];
      }

      case this.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:
      case this.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: {
        const data = new Uint32Array(1);
        gl.getFramebufferAttachmentParameteriv(
          target,
          attachment,
          pname,
          data,
        );
        return data[0] === 0 ? null : WebGLRenderbuffer.make(data[0]);
      }

      case this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:
      case this.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:
      case this.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_RED_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE:
      case this.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:
      case this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER:
      case this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: {
        const data = new Int32Array(1);
        gl.getFramebufferAttachmentParameteriv(
          target,
          attachment,
          pname,
          data,
        );
        return data[0];
      }

      default:
        return null;
    }
  }

  isFramebuffer(framebuffer: WebGLFramebuffer | null): boolean {
    if (this[_contextLost]) {
      return false;
    }
    if (framebuffer === null) {
      return false;
    }
    if (framebuffer[_invalidated]) {
      return false;
    }
    return Boolean(gl.isFramebuffer(framebuffer[_name]));
  }

  /// 5.14.7 Renderbuffer objects

  bindRenderbuffer(
    target: GLenum,
    renderbuffer: WebGLRenderbuffer | null,
  ): void {
    gl.bindRenderbuffer(target, renderbuffer?.[_name] ?? 0);
  }

  createRenderbuffer(): WebGLRenderbuffer | null {
    const renderbuffer = new Uint32Array(1);
    gl.genRenderbuffers(1, renderbuffer);
    if (renderbuffer[0] === 0) {
      return null;
    }
    return WebGLRenderbuffer.make(renderbuffer[0]);
  }

  deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void {
    gl.deleteRenderbuffers(1, new Uint32Array([renderbuffer?.[_name] ?? 0]));
  }

  getRenderbufferParameter(target: GLenum, pname: GLenum): any {
    switch (pname) {
      case this.RENDERBUFFER_WIDTH:
      case this.RENDERBUFFER_HEIGHT:
      case this.RENDERBUFFER_INTERNAL_FORMAT:
      case this.RENDERBUFFER_RED_SIZE:
      case this.RENDERBUFFER_GREEN_SIZE:
      case this.RENDERBUFFER_BLUE_SIZE:
      case this.RENDERBUFFER_ALPHA_SIZE:
      case this.RENDERBUFFER_DEPTH_SIZE:
      case this.RENDERBUFFER_STENCIL_SIZE:
      case this.RENDERBUFFER_INTERNAL_FORMAT: {
        const data = new Uint32Array(1);
        gl.getRenderbufferParameteriv(target, pname, data);
        return data[0];
      }

      case this.RENDERBUFFER_WIDTH:
      case this.RENDERBUFFER_HEIGHT:
      case this.RENDERBUFFER_RED_SIZE:
      case this.RENDERBUFFER_GREEN_SIZE:
      case this.RENDERBUFFER_BLUE_SIZE:
      case this.RENDERBUFFER_ALPHA_SIZE:
      case this.RENDERBUFFER_DEPTH_SIZE:
      case this.RENDERBUFFER_SAMPLES:
      case this.RENDERBUFFER_STENCIL_SIZE: {
        const data = new Int32Array(1);
        gl.getRenderbufferParameteriv(target, pname, data);
        return data[0];
      }

      default:
        return null;
    }
  }

  isRenderbuffer(renderbuffer: WebGLRenderbuffer | null): boolean {
    if (this[_contextLost]) {
      return false;
    }
    if (renderbuffer === null) {
      return false;
    }
    if (renderbuffer[_invalidated]) {
      return false;
    }
    return Boolean(gl.isRenderbuffer(renderbuffer[_name]));
  }

  renderbufferStorage(
    target: GLenum,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
  ): void {
    gl.renderbufferStorage(target, internalformat, width, height);
  }

  /// 5.14.8 Texture objects

  bindTexture(target: GLenum, texture: WebGLTexture | null): void {
    gl.bindTexture(target, texture?.[_name] ?? 0);
  }

  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    data: ArrayBufferView,
  ): void {
    gl.compressedTexImage2D(
      target,
      level,
      internalformat,
      width,
      height,
      border,
      data.byteLength,
      data as Uint8Array,
    );
  }

  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    data: ArrayBufferView,
  ): void {
    gl.compressedTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      data.byteLength,
      data as Uint8Array,
    );
  }

  copyTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
  ): void {
    gl.copyTexImage2D(
      target,
      level,
      internalformat,
      x,
      y,
      width,
      height,
      border,
    );
  }

  copyTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
  ): void {
    gl.copyTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      x,
      y,
      width,
      height,
    );
  }

  createTexture(): WebGLTexture | null {
    const texture = new Uint32Array(1);
    gl.genTextures(1, texture);
    if (texture[0] === 0) {
      return null;
    }
    return WebGLTexture.make(texture[0]);
  }

  deleteTexture(texture: WebGLTexture | null): void {
    gl.deleteTextures(1, new Uint32Array([texture?.[_name] ?? 0]));
  }

  generateMipmap(target: GLenum): void {
    gl.generateMipmap(target);
  }

  getTexParameter(target: GLenum, pname: GLenum): any {
    switch (pname) {
      case this.TEXTURE_MAG_FILTER:
      case this.TEXTURE_MIN_FILTER:
      case this.TEXTURE_WRAP_S:
      case this.TEXTURE_WRAP_T:
      case this.TEXTURE_COMPARE_FUNC:
      case this.TEXTURE_COMPARE_MODE:
      case this.TEXTURE_IMMUTABLE_LEVELS:
      case this.TEXTURE_MAG_FILTER:
      case this.TEXTURE_MIN_FILTER:
      case this.TEXTURE_WRAP_R:
      case this.TEXTURE_WRAP_S:
      case this.TEXTURE_WRAP_T: {
        const data = new Uint32Array(1);
        gl.getTexParameteriv(target, pname, data);
        return data[0];
      }

      case this.TEXTURE_BASE_LEVEL:
      case this.TEXTURE_MAX_LEVEL: {
        const data = new Int32Array(1);
        gl.getTexParameteriv(target, pname, data);
        return data[0];
      }

      case this.TEXTURE_IMMUTABLE_FORMAT: {
        const data = new Uint32Array(1);
        gl.getTexParameteriv(target, pname, data);
        return data[0] !== 0;
      }

      case this.TEXTURE_MAX_LOD:
      case this.TEXTURE_MIN_LOD: {
        const data = new Float32Array(1);
        gl.getTexParameterfv(target, pname, data);
        return data[0];
      }

      default:
        return null;
    }
  }

  isTexture(texture: WebGLTexture | null): boolean {
    if (this[_contextLost]) {
      return false;
    }
    if (texture === null) {
      return false;
    }
    if (texture[_invalidated]) {
      return false;
    }
    return Boolean(gl.isTexture(texture[_name]));
  }

  #unpackPixels(
    format: GLenum,
    type: GLenum,
    width: GLsizei,
    height: GLsizei,
    pixels: Uint8Array,
  ) {
    if (!this[_unpackFlipY] && !this[_unpackPremultiplyAlpha]) return pixels;

    const pixelSize = TYPE_SIZE[type]! * FORMAT_COMPONENTS[format]! /
      TYPE_COMPONENTS[type]!;

    let rowSize = width * pixelSize;

    const unpackAlignment = this.getParameter(this.UNPACK_ALIGNMENT);
    if (rowSize % unpackAlignment !== 0) {
      rowSize += unpackAlignment - (rowSize % unpackAlignment);
    }

    const imageSize = rowSize * height;

    const data = new Uint8Array(imageSize);

    if (this[_unpackFlipY]) {
      for (let i = 0, j = height - 1; j >= 0; ++i, --j) {
        const src = pixels.subarray(
          i * rowSize,
          (i + 1) * rowSize,
        );
        data.set(src, j * rowSize);
      }
    } else {
      data.set(pixels);
    }

    if (
      this[_unpackPremultiplyAlpha] &&
      (format === this.RGBA || format === this.LUMINANCE_ALPHA)
    ) {
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          const pixel = (y * rowSize) + (x * pixelSize);

          if (format === this.LUMINANCE_ALPHA) {
            data[pixel] *= data[pixel + 1] / 255;
          } else if (type === this.UNSIGNED_BYTE) {
            const scale = data[pixel + 3] / 255;
            data[pixel] *= scale;
            data[pixel + 1] *= scale;
            data[pixel + 2] *= scale;
          } else if (type == this.UNSIGNED_SHORT_4_4_4_4) {
            let r = data[pixel] & 0x0f;
            let g = data[pixel] >> 4;
            let b = data[pixel + 1] & 0x0f;
            let a = data[pixel + 1] >> 4;

            const scale = a / 15.0;
            r *= scale;
            g *= scale;
            b *= scale;

            data[pixel] = r + (g << 4);
            data[pixel + 1] = b + (a << 4);
          } else if (type == this.UNSIGNED_SHORT_5_5_5_1) {
            if ((data[pixel] & 1) == 0) {
              data[pixel] = 1;
              data[pixel] = 0;
            }
          }
        }
      }
    }

    return data;
  }

  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void;
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    format: GLenum,
    type: GLenum,
    image: Image,
  ): void;
  texImage2D(
    ...args: [
      target: GLenum,
      level: GLint,
      internalformat: GLenum,
      width: GLsizei,
      height: GLsizei,
      border: GLint,
      format: GLenum,
      type: GLenum,
      pixels: ArrayBufferView | null,
    ] | [
      target: GLenum,
      level: GLint,
      internalformat: GLenum,
      format: GLenum,
      type: GLenum,
      image: Image,
    ]
  ): void {
    if (args.length === 9) {
      if (args[8] === null) {
        // Initialize the pixels buffer to sufficient size.
        const size = args[3] * args[4] * FORMAT_COMPONENTS[args[6]] *
          TYPE_SIZE[args[7]] * TYPE_COMPONENTS[args[7]];
        args[8] = new Uint8Array(size);
      } else {
        args[8] = this.#unpackPixels(
          args[6],
          args[7],
          args[3],
          args[4],
          args[8] as Uint8Array,
        );
      }

      // @ts-ignore
      gl.texImage2D(...args);
    } else if (args.length === 6) {
      gl.texImage2D(
        args[0],
        args[1],
        this.RGBA,
        args[5].width,
        args[5].height,
        0,
        this.RGBA,
        this.UNSIGNED_BYTE,
        this.#unpackPixels(
          this.RGBA,
          this.UNSIGNED_BYTE,
          args[5].width,
          args[5].height,
          args[5].rawData,
        ),
      );
    } else throw new Error("Invalid arguments");
  }

  texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void {
    gl.texParameterf(target, pname, param);
  }

  texParameteri(target: GLenum, pname: GLenum, param: GLint): void {
    gl.texParameteri(target, pname, param);
  }

  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void;
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    format: GLenum,
    type: GLenum,
    image: Image,
  ): void;
  texSubImage2D(
    ...args: [
      target: GLenum,
      level: GLint,
      xoffset: GLint,
      yoffset: GLint,
      width: GLsizei,
      height: GLsizei,
      format: GLenum,
      type: GLenum,
      pixels: ArrayBufferView | null,
    ] | [
      target: GLenum,
      level: GLint,
      xoffset: GLint,
      yoffset: GLint,
      format: GLenum,
      type: GLenum,
      image: Image,
    ]
  ): void {
    if (args.length === 9) {
      if (args[8] === null) {
        // Initialize the pixels buffer to sufficient size.
        const size = args[3] * args[4] * FORMAT_COMPONENTS[args[6]] *
          TYPE_SIZE[args[7]] * TYPE_COMPONENTS[args[7]];
        args[8] = new Uint8Array(size);
      } else {
        args[8] = this.#unpackPixels(
          args[6],
          args[7],
          args[4],
          args[5],
          args[8] as Uint8Array,
        );
      }

      gl.texSubImage2D(
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
        args[6],
        args[7],
        args[8] as Uint8Array,
      );
    } else if (args.length === 7) {
      const pixels = this.#unpackPixels(
        args[4],
        args[5],
        args[6].width,
        args[6].height,
        args[6].rawData,
      );
      gl.texSubImage2D(
        args[0],
        args[1],
        args[2],
        args[3],
        args[6].width,
        args[6].height,
        args[4],
        args[5],
        pixels,
      );
    }
  }

  /// 5.14.9 Programs and Shaders

  attachShader(program: WebGLProgram, shader: WebGLShader): void {
    gl.attachShader(program[_name], shader[_name]);
  }

  bindAttribLocation(program: WebGLProgram, index: GLuint, name: string): void {
    gl.bindAttribLocation(program[_name], index, cstr(name));
  }

  compileShader(shader: WebGLShader): void {
    gl.compileShader(shader[_name]);
  }

  createProgram(): WebGLProgram | null {
    const program = gl.createProgram();
    if (program === 0) {
      return null;
    }
    return WebGLProgram.make(program);
  }

  createShader(type: GLenum): WebGLShader | null {
    const shader = gl.createShader(type);
    if (shader === 0) {
      return null;
    }
    return WebGLShader.make(shader);
  }

  deleteProgram(program: WebGLProgram | null): void {
    gl.deleteProgram(program?.[_name] ?? 0);
  }

  deleteShader(shader: WebGLShader | null): void {
    gl.deleteShader(shader?.[_name] ?? 0);
  }

  detachShader(program: WebGLProgram, shader: WebGLShader): void {
    gl.detachShader(program[_name], shader[_name]);
  }

  getAttachedShaders(program: WebGLProgram): WebGLShader[] {
    let shaders = new Uint32Array(2);
    const count = new Uint32Array(1);
    gl.getAttachedShaders(program[_name], 2, count, shaders);
    if (count[0] > shaders.length) {
      shaders = new Uint32Array(count[0]);
      gl.getAttachedShaders(program[_name], count[0], count, shaders);
    }
    return [...shaders.subarray(0, count[0])].map((shader) =>
      new WebGLShader(shader)
    );
  }

  getProgramParameter(program: WebGLProgram, pname: GLenum): any {
    switch (pname) {
      case this.DELETE_STATUS:
      case this.LINK_STATUS:
      case this.VALIDATE_STATUS: {
        const result = new Uint32Array(1);
        gl.getProgramiv(program[_name], pname, result);
        return result[0] !== 0;
      }

      case this.ATTACHED_SHADERS:
      case this.ACTIVE_ATTRIBUTES:
      case this.ACTIVE_UNIFORMS:
      case this.TRANSFORM_FEEDBACK_VARYINGS:
      case this.ACTIVE_UNIFORM_BLOCKS: {
        const result = new Int32Array(1);
        gl.getProgramiv(program[_name], pname, result);
        return result[0];
      }

      case this.TRANSFORM_FEEDBACK_BUFFER_MODE: {
        const result = new Uint32Array(1);
        gl.getProgramiv(program[_name], pname, result);
        return result[0];
      }

      default:
        return null;
    }
  }

  getProgramInfoLog(program: WebGLProgram): string {
    const length = new Uint32Array(1);
    gl.getProgramiv(program[_name], gl.INFO_LOG_LENGTH, length);
    const result = new Uint8Array(length[0]);
    gl.getProgramInfoLog(program[_name], length[0], length, result);
    return new TextDecoder().decode(result);
  }

  getShaderParameter(shader: WebGLShader, pname: GLenum): any {
    switch (pname) {
      case this.DELETE_STATUS:
      case this.COMPILE_STATUS: {
        const result = new Uint32Array(1);
        gl.getShaderiv(shader[_name], pname, result);
        return result[0] !== 0;
      }

      case this.SHADER_TYPE: {
        const result = new Uint32Array(1);
        gl.getShaderiv(shader[_name], pname, result);
        return result[0];
      }

      default:
        return null;
    }
  }

  getShaderPrecisionFormat(
    shaderType: GLenum,
    precisionType: GLenum,
  ): WebGLShaderPrecisionFormat {
    const range = new Int32Array(2);
    const precision = new Uint32Array(1);
    gl.getShaderPrecisionFormat(shaderType, precisionType, range, precision);
    return { rangeMin: range[0], rangeMax: range[1], precision: precision[0] };
  }

  getShaderInfoLog(shader: WebGLShader): string {
    const length = new Uint32Array(1);
    gl.getShaderiv(shader[_name], gl.INFO_LOG_LENGTH, length);
    const result = new Uint8Array(length[0]);
    gl.getShaderInfoLog(shader[_name], length[0], length, result);
    return new TextDecoder().decode(result);
  }

  getShaderSource(shader: WebGLShader): string {
    const length = new Uint32Array(1);
    gl.getShaderiv(shader[_name], gl.SHADER_SOURCE_LENGTH, length);
    const result = new Uint8Array(length[0]);
    gl.getShaderSource(shader[_name], length[0], length, result);
    return new TextDecoder().decode(result);
  }

  isProgram(program: WebGLProgram | null): boolean {
    if (this[_contextLost] || program === null || program[_invalidated]) {
      return false;
    } else return Boolean(gl.isProgram(program[_name]));
  }

  isShader(shader: WebGLShader | null): boolean {
    if (this[_contextLost] || shader === null || shader[_invalidated]) {
      return false;
    } else return Boolean(gl.isShader(shader[_name]));
  }

  linkProgram(program: WebGLProgram): void {
    gl.linkProgram(program[_name]);
  }

  shaderSource(shader: WebGLShader, source: string): void {
    const sourceEncoded = new TextEncoder().encode(source);
    const sourcePtr = new BigUint64Array(1);
    sourcePtr[0] = Deno.UnsafePointer.of(sourceEncoded).value;
    const lengthPtr = new Uint32Array(1);
    lengthPtr[0] = sourceEncoded.byteLength;
    gl.shaderSource(shader[_name], 1, sourcePtr, lengthPtr);
  }

  useProgram(program: WebGLProgram | null): void {
    gl.useProgram(program?.[_name] ?? 0);
  }

  validateProgram(program: WebGLProgram): void {
    gl.validateProgram(program[_name]);
  }

  /// 5.14.10 Uniforms and attributes

  disableVertexAttribArray(index: number): void {
    gl.disableVertexAttribArray(index);
  }

  enableVertexAttribArray(index: number): void {
    gl.enableVertexAttribArray(index);
  }

  getActiveAttrib(
    program: WebGLProgram,
    index: number,
  ): WebGLActiveInfo | null {
    const name = new Uint8Array(256);
    const length = new Uint32Array(1);
    const size = new Uint32Array(1);
    const type = new Uint32Array(1);
    gl.getActiveAttrib(
      program[_name],
      index,
      name.byteLength,
      length,
      size,
      type,
      name,
    );
    return {
      name: new TextDecoder().decode(name.subarray(0, length[0])),
      size: size[0],
      type: type[0],
    };
  }

  getActiveUniform(
    program: WebGLProgram,
    index: number,
  ): WebGLActiveInfo | null {
    const name = new Uint8Array(256);
    const length = new Uint32Array(1);
    const size = new Uint32Array(1);
    const type = new Uint32Array(1);
    gl.getActiveUniform(
      program[_name],
      index,
      name.byteLength,
      length,
      size,
      type,
      name,
    );
    return {
      name: new TextDecoder().decode(name.subarray(0, length[0])),
      size: size[0],
      type: type[0],
    };
  }

  getAttribLocation(program: WebGLProgram, name: string): number {
    return gl.getAttribLocation(program[_name], cstr(name));
  }

  getUniform(
    program: WebGLProgram,
    location: WebGLUniformLocation,
  ): any {
    const type =
      this.getActiveUniform(program, location[_uniformLocation])!.type;

    switch (type) {
      case this.FLOAT: {
        const result = new Float32Array(1);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result[0];
      }

      case this.FLOAT_VEC2: {
        const result = new Float32Array(2);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.FLOAT_VEC3: {
        const result = new Float32Array(3);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.FLOAT_VEC4: {
        const result = new Float32Array(4);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.INT: {
        const result = new Int32Array(1);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result[0];
      }

      case this.INT_VEC2: {
        const result = new Int32Array(2);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.INT_VEC3: {
        const result = new Int32Array(3);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.INT_VEC4: {
        const result = new Int32Array(4);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.BOOL: {
        const result = new Int32Array(1);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result[0] !== 0;
      }

      case this.BOOL_VEC2: {
        const result = new Int32Array(2);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.BOOL_VEC3: {
        const result = new Int32Array(3);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.BOOL_VEC4: {
        const result = new Int32Array(4);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.FLOAT_MAT2: {
        const result = new Float32Array(4);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.FLOAT_MAT3: {
        const result = new Float32Array(9);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.FLOAT_MAT4: {
        const result = new Float32Array(16);
        gl.getUniformfv(program[_name], location[_uniformLocation], result);
        return result;
      }

      case this.SAMPLER_2D:
      case this.SAMPLER_CUBE: {
        const result = new Int32Array(1);
        gl.getUniformiv(program[_name], location[_uniformLocation], result);
        return result[0];
      }

      default:
        return null;
    }
  }

  getUniformLocation(
    program: WebGLProgram,
    name: string,
  ): WebGLUniformLocation | null {
    const loc = gl.getUniformLocation(program[_name], cstr(name));
    if (loc < 0) {
      return null;
    }
    return new WebGLUniformLocation(loc);
  }

  getVertexAttrib(
    index: number,
    pname: number,
  ): any {
    switch (pname) {
      case this.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: {
        const result = new Uint32Array(1);
        gl.getVertexAttribiv(index, pname, result);
        if (result[0] === 0) return null;
        return WebGLBuffer.make(result[0]);
      }

      case this.VERTEX_ATTRIB_ARRAY_ENABLED:
      case this.VERTEX_ATTRIB_ARRAY_NORMALIZED: {
        const result = new Int32Array(1);
        gl.getVertexAttribiv(index, pname, result);
        return result[0] !== 0;
      }

      case this.VERTEX_ATTRIB_ARRAY_SIZE:
      case this.VERTEX_ATTRIB_ARRAY_STRIDE: {
        const result = new Int32Array(1);
        gl.getVertexAttribiv(index, pname, result);
        return result[0];
      }

      case this.VERTEX_ATTRIB_ARRAY_TYPE: {
        const result = new Int32Array(1);
        gl.getVertexAttribiv(index, pname, result);
        return result[0];
      }

      case this.CURRENT_VERTEX_ATTRIB: {
        const result = new Float32Array(4);
        gl.getVertexAttribfv(index, pname, result);
        return result;
      }

      default:
        return null;
    }
  }

  getVertexAttribOffset(
    index: number,
    pname: number,
  ): number {
    const result = new BigUint64Array(1);
    gl.getVertexAttribiv(index, pname, result);
    // TODO: is this right?
    return Number(result[0]);
  }

  uniform1f(
    location: WebGLUniformLocation,
    x: GLfloat,
  ): void {
    gl.uniform1f(location[_uniformLocation], isNaN(x) ? 0 : Number(x));
  }

  uniform2f(
    location: WebGLUniformLocation,
    x: GLfloat,
    y: GLfloat,
  ): void {
    gl.uniform2f(location[_uniformLocation], Number(x), Number(y));
  }

  uniform3f(
    location: WebGLUniformLocation,
    x: GLfloat,
    y: GLfloat,
    z: GLfloat,
  ): void {
    gl.uniform3f(location[_uniformLocation], Number(x), Number(y), Number(z));
  }

  uniform4f(
    location: WebGLUniformLocation,
    x: GLfloat,
    y: GLfloat,
    z: GLfloat,
    w: GLfloat,
  ): void {
    gl.uniform4f(
      location[_uniformLocation],
      Number(x),
      Number(y),
      Number(z),
      Number(w),
    );
  }

  uniform1i(
    location: WebGLUniformLocation,
    x: GLint,
  ): void {
    gl.uniform1i(location[_uniformLocation], Number(x));
  }

  uniform2i(
    location: WebGLUniformLocation,
    x: GLint,
    y: GLint,
  ): void {
    gl.uniform2i(location[_uniformLocation], Number(x), Number(y));
  }

  uniform3i(
    location: WebGLUniformLocation,
    x: GLint,
    y: GLint,
    z: GLint,
  ): void {
    gl.uniform3i(location[_uniformLocation], Number(x), Number(y), Number(z));
  }

  uniform4i(
    location: WebGLUniformLocation,
    x: GLint,
    y: GLint,
    z: GLint,
    w: GLint,
  ): void {
    gl.uniform4i(
      location[_uniformLocation],
      Number(x),
      Number(y),
      Number(z),
      Number(w),
    );
  }

  uniform1fv(
    location: WebGLUniformLocation,
    v: Float32Array | GLfloat[],
  ): void {
    gl.uniform1fv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  uniform2fv(
    location: WebGLUniformLocation,
    v: Float32Array | GLfloat[],
  ): void {
    gl.uniform2fv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  uniform3fv(
    location: WebGLUniformLocation,
    v: Float32Array | GLfloat[],
  ): void {
    gl.uniform3fv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  uniform4fv(
    location: WebGLUniformLocation,
    v: Float32Array | GLfloat[],
  ): void {
    gl.uniform4fv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  uniform1iv(
    location: WebGLUniformLocation,
    v: Int32Array | GLint[],
  ): void {
    gl.uniform1iv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Int32Array(v) : v,
    );
  }

  uniform2iv(
    location: WebGLUniformLocation,
    v: Int32Array | GLint[],
  ): void {
    gl.uniform2iv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Int32Array(v) : v,
    );
  }

  uniform3iv(
    location: WebGLUniformLocation | null,
    v: Int32Array | GLint[],
  ): void {
    if (location === null) {
      return console.warn("uniform3iv: got null location");
    }
    gl.uniform3iv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Int32Array(v) : v,
    );
  }

  uniform4iv(
    location: WebGLUniformLocation,
    v: Int32Array | GLint[],
  ): void {
    gl.uniform4iv(
      location[_uniformLocation],
      1,
      Array.isArray(v) ? new Int32Array(v) : v,
    );
  }

  uniformMatrix2fv(
    location: WebGLUniformLocation,
    transpose: GLboolean,
    value: Float32Array | GLfloat[],
  ): void {
    gl.uniformMatrix2fv(
      location[_uniformLocation],
      1,
      Number(transpose),
      Array.isArray(value) ? new Float32Array(value) : value,
    );
  }

  uniformMatrix3fv(
    location: WebGLUniformLocation,
    transpose: GLboolean,
    value: Float32Array | GLfloat[],
  ): void {
    gl.uniformMatrix3fv(
      location[_uniformLocation],
      1,
      Number(transpose),
      Array.isArray(value) ? new Float32Array(value) : value,
    );
  }

  uniformMatrix4fv(
    location: WebGLUniformLocation,
    transpose: GLboolean,
    value: Float32Array | GLfloat[],
  ): void {
    gl.uniformMatrix4fv(
      location[_uniformLocation],
      1,
      Number(transpose),
      Array.isArray(value) ? new Float32Array(value) : value,
    );
  }

  vertexAttrib1f(
    index: GLuint,
    x: GLfloat,
  ): void {
    gl.vertexAttrib1f(index, Number(x));
  }

  vertexAttrib2f(
    index: GLuint,
    x: GLfloat,
    y: GLfloat,
  ): void {
    gl.vertexAttrib2f(index, Number(x), Number(y));
  }

  vertexAttrib3f(
    index: GLuint,
    x: GLfloat,
    y: GLfloat,
    z: GLfloat,
  ): void {
    gl.vertexAttrib3f(index, Number(x), Number(y), Number(z));
  }

  vertexAttrib4f(
    index: GLuint,
    x: GLfloat,
    y: GLfloat,
    z: GLfloat,
    w: GLfloat,
  ): void {
    gl.vertexAttrib4f(
      index,
      Number(x),
      Number(y),
      Number(z),
      Number(w),
    );
  }

  vertexAttrib1fv(
    index: GLuint,
    v: Float32Array | GLfloat[],
  ): void {
    gl.vertexAttrib1fv(
      index,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  vertexAttrib2fv(
    index: GLuint,
    v: Float32Array | GLfloat[],
  ): void {
    gl.vertexAttrib2fv(
      index,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  vertexAttrib3fv(
    index: GLuint,
    v: Float32Array | GLfloat[],
  ): void {
    gl.vertexAttrib3fv(
      index,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  vertexAttrib4fv(
    index: GLuint,
    v: Float32Array | GLfloat[],
  ): void {
    gl.vertexAttrib4fv(
      index,
      Array.isArray(v) ? new Float32Array(v) : v,
    );
  }

  vertexAttribPointer(
    index: GLuint,
    size: GLint,
    type: GLenum,
    normalized: GLboolean,
    stride: GLsizei,
    offset: GLintptr | bigint,
  ): void {
    gl.vertexAttribPointer(
      index,
      Number(size),
      Number(type),
      Number(normalized ?? 0),
      Number(stride),
      new Deno.UnsafePointer(BigInt(offset)),
    );
  }

  /// 5.14.11 Writing to the drawing buffer

  clear(mask: GLbitfield): void {
    gl.clear(Number(mask));
  }

  drawArrays(
    mode: GLenum,
    first: GLint,
    count: GLsizei,
  ): void {
    gl.drawArrays(Number(mode), Number(first), Number(count));
  }

  drawElements(
    mode: GLenum,
    count: GLsizei,
    type: GLenum,
    offset: GLintptr | bigint,
  ): void {
    gl.drawElements(
      Number(mode),
      Number(count),
      Number(type),
      new Deno.UnsafePointer(BigInt(offset)),
    );
  }

  finish(): void {
    gl.finish();
  }

  flush(): void {
    gl.flush();
  }

  /// 5.14.12 Reading back pixels

  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    // TODO: spec makes it nullable and says
    // to generate error if its null????
    pixels: ArrayBufferView | null | number,
  ): void {
    gl.readPixels(
      Number(x),
      Number(y),
      Number(width),
      Number(height),
      Number(format),
      Number(type),
      typeof pixels === "number"
        ? new Deno.UnsafePointer(BigInt(pixels))
        : pixels as Uint8Array,
    );
  }

  /// 5.14.13 Detecting context lost events

  isContextLost(): boolean {
    return this[_contextLost];
  }

  /// 5.14.14 Detecting and enabling extensions

  getSupportedExtensions(): string[] {
    return [];
  }

  getExtension(name: string): any {
    const idx = name.indexOf("_webgl");
    name = name.substring(0, idx < 0 ? name.length : idx);

    if (!glfw.extensionSupported(cstr("GL_" + name))) {
      return null;
    }

    if (!(name in extensions)) {
      throw new Error("Extension supported but not implemented: " + name);
    }

    return new (extensions as any)[name]();
  }

  //// WebGL 2

  /// Constants

  READ_BUFFER = 0x0C02;
  UNPACK_ROW_LENGTH = 0x0CF2;
  UNPACK_SKIP_ROWS = 0x0CF3;
  UNPACK_SKIP_PIXELS = 0x0CF4;
  PACK_ROW_LENGTH = 0x0D02;
  PACK_SKIP_ROWS = 0x0D03;
  PACK_SKIP_PIXELS = 0x0D04;
  COLOR = 0x1800;
  DEPTH = 0x1801;
  STENCIL = 0x1802;
  RED = 0x1903;
  RGB8 = 0x8051;
  RGBA8 = 0x8058;
  RGB10_A2 = 0x8059;
  TEXTURE_BINDING_3D = 0x806A;
  UNPACK_SKIP_IMAGES = 0x806D;
  UNPACK_IMAGE_HEIGHT = 0x806E;
  TEXTURE_3D = 0x806F;
  TEXTURE_WRAP_R = 0x8072;
  MAX_3D_TEXTURE_SIZE = 0x8073;
  UNSIGNED_INT_2_10_10_10_REV = 0x8368;
  MAX_ELEMENTS_VERTICES = 0x80E8;
  MAX_ELEMENTS_INDICES = 0x80E9;
  TEXTURE_MIN_LOD = 0x813A;
  TEXTURE_MAX_LOD = 0x813B;
  TEXTURE_BASE_LEVEL = 0x813C;
  TEXTURE_MAX_LEVEL = 0x813D;
  MIN = 0x8007;
  MAX = 0x8008;
  DEPTH_COMPONENT24 = 0x81A6;
  MAX_TEXTURE_LOD_BIAS = 0x84FD;
  TEXTURE_COMPARE_MODE = 0x884C;
  TEXTURE_COMPARE_FUNC = 0x884D;
  CURRENT_QUERY = 0x8865;
  QUERY_RESULT = 0x8866;
  QUERY_RESULT_AVAILABLE = 0x8867;
  STREAM_READ = 0x88E1;
  STREAM_COPY = 0x88E2;
  STATIC_READ = 0x88E5;
  STATIC_COPY = 0x88E6;
  DYNAMIC_READ = 0x88E9;
  DYNAMIC_COPY = 0x88EA;
  MAX_DRAW_BUFFERS = 0x8824;
  DRAW_BUFFER0 = 0x8825;
  DRAW_BUFFER1 = 0x8826;
  DRAW_BUFFER2 = 0x8827;
  DRAW_BUFFER3 = 0x8828;
  DRAW_BUFFER4 = 0x8829;
  DRAW_BUFFER5 = 0x882A;
  DRAW_BUFFER6 = 0x882B;
  DRAW_BUFFER7 = 0x882C;
  DRAW_BUFFER8 = 0x882D;
  DRAW_BUFFER9 = 0x882E;
  DRAW_BUFFER10 = 0x882F;
  DRAW_BUFFER11 = 0x8830;
  DRAW_BUFFER12 = 0x8831;
  DRAW_BUFFER13 = 0x8832;
  DRAW_BUFFER14 = 0x8833;
  DRAW_BUFFER15 = 0x8834;
  MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8B49;
  MAX_VERTEX_UNIFORM_COMPONENTS = 0x8B4A;
  SAMPLER_3D = 0x8B5F;
  SAMPLER_2D_SHADOW = 0x8B62;
  FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8B8B;
  PIXEL_PACK_BUFFER = 0x88EB;
  PIXEL_UNPACK_BUFFER = 0x88EC;
  PIXEL_PACK_BUFFER_BINDING = 0x88ED;
  PIXEL_UNPACK_BUFFER_BINDING = 0x88EF;
  FLOAT_MAT2x3 = 0x8B65;
  FLOAT_MAT2x4 = 0x8B66;
  FLOAT_MAT3x2 = 0x8B67;
  FLOAT_MAT3x4 = 0x8B68;
  FLOAT_MAT4x2 = 0x8B69;
  FLOAT_MAT4x3 = 0x8B6A;
  SRGB = 0x8C40;
  SRGB8 = 0x8C41;
  SRGB8_ALPHA8 = 0x8C43;
  COMPARE_REF_TO_TEXTURE = 0x884E;
  RGBA32F = 0x8814;
  RGB32F = 0x8815;
  RGBA16F = 0x881A;
  RGB16F = 0x881B;
  VERTEX_ATTRIB_ARRAY_INTEGER = 0x88FD;
  MAX_ARRAY_TEXTURE_LAYERS = 0x88FF;
  MIN_PROGRAM_TEXEL_OFFSET = 0x8904;
  MAX_PROGRAM_TEXEL_OFFSET = 0x8905;
  MAX_VARYING_COMPONENTS = 0x8B4B;
  TEXTURE_2D_ARRAY = 0x8C1A;
  TEXTURE_BINDING_2D_ARRAY = 0x8C1D;
  R11F_G11F_B10F = 0x8C3A;
  UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B;
  RGB9_E5 = 0x8C3D;
  UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
  TRANSFORM_FEEDBACK_BUFFER_MODE = 0x8C7F;
  MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 0x8C80;
  TRANSFORM_FEEDBACK_VARYINGS = 0x8C83;
  TRANSFORM_FEEDBACK_BUFFER_START = 0x8C84;
  TRANSFORM_FEEDBACK_BUFFER_SIZE = 0x8C85;
  TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 0x8C88;
  RASTERIZER_DISCARD = 0x8C89;
  MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 0x8C8A;
  MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 0x8C8B;
  INTERLEAVED_ATTRIBS = 0x8C8C;
  SEPARATE_ATTRIBS = 0x8C8D;
  TRANSFORM_FEEDBACK_BUFFER = 0x8C8E;
  TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8C8F;
  RGBA32UI = 0x8D70;
  RGB32UI = 0x8D71;
  RGBA16UI = 0x8D76;
  RGB16UI = 0x8D77;
  RGBA8UI = 0x8D7C;
  RGB8UI = 0x8D7D;
  RGBA32I = 0x8D82;
  RGB32I = 0x8D83;
  RGBA16I = 0x8D88;
  RGB16I = 0x8D89;
  RGBA8I = 0x8D8E;
  RGB8I = 0x8D8F;
  RED_INTEGER = 0x8D94;
  RGB_INTEGER = 0x8D98;
  RGBA_INTEGER = 0x8D99;
  SAMPLER_2D_ARRAY = 0x8DC1;
  SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
  SAMPLER_CUBE_SHADOW = 0x8DC5;
  UNSIGNED_INT_VEC2 = 0x8DC6;
  UNSIGNED_INT_VEC3 = 0x8DC7;
  UNSIGNED_INT_VEC4 = 0x8DC8;
  INT_SAMPLER_2D = 0x8DCA;
  INT_SAMPLER_3D = 0x8DCB;
  INT_SAMPLER_CUBE = 0x8DCC;
  INT_SAMPLER_2D_ARRAY = 0x8DCF;
  UNSIGNED_INT_SAMPLER_2D = 0x8DD2;
  UNSIGNED_INT_SAMPLER_3D = 0x8DD3;
  UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4;
  UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7;
  DEPTH_COMPONENT32F = 0x8CAC;
  DEPTH32F_STENCIL8 = 0x8CAD;
  FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD;
  FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 0x8210;
  FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 0x8211;
  FRAMEBUFFER_ATTACHMENT_RED_SIZE = 0x8212;
  FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 0x8213;
  FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 0x8214;
  FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 0x8215;
  FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 0x8216;
  FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 0x8217;
  FRAMEBUFFER_DEFAULT = 0x8218;
  UNSIGNED_INT_24_8 = 0x84FA;
  DEPTH24_STENCIL8 = 0x88F0;
  UNSIGNED_NORMALIZED = 0x8C17;
  DRAW_FRAMEBUFFER_BINDING = 0x8CA6; /* Same as FRAMEBUFFER_BINDING */
  READ_FRAMEBUFFER = 0x8CA8;
  DRAW_FRAMEBUFFER = 0x8CA9;
  READ_FRAMEBUFFER_BINDING = 0x8CAA;
  RENDERBUFFER_SAMPLES = 0x8CAB;
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0x8CD4;
  MAX_COLOR_ATTACHMENTS = 0x8CDF;
  COLOR_ATTACHMENT1 = 0x8CE1;
  COLOR_ATTACHMENT2 = 0x8CE2;
  COLOR_ATTACHMENT3 = 0x8CE3;
  COLOR_ATTACHMENT4 = 0x8CE4;
  COLOR_ATTACHMENT5 = 0x8CE5;
  COLOR_ATTACHMENT6 = 0x8CE6;
  COLOR_ATTACHMENT7 = 0x8CE7;
  COLOR_ATTACHMENT8 = 0x8CE8;
  COLOR_ATTACHMENT9 = 0x8CE9;
  COLOR_ATTACHMENT10 = 0x8CEA;
  COLOR_ATTACHMENT11 = 0x8CEB;
  COLOR_ATTACHMENT12 = 0x8CEC;
  COLOR_ATTACHMENT13 = 0x8CED;
  COLOR_ATTACHMENT14 = 0x8CEE;
  COLOR_ATTACHMENT15 = 0x8CEF;
  FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8D56;
  MAX_SAMPLES = 0x8D57;
  HALF_FLOAT = 0x140B;
  // To make CTS pass
  // HALF_FLOAT_OES = 0x140B; // 0x8D61;
  RG = 0x8227;
  RG_INTEGER = 0x8228;
  R8 = 0x8229;
  RG8 = 0x822B;
  R16F = 0x822D;
  R32F = 0x822E;
  RG16F = 0x822F;
  RG32F = 0x8230;
  R8I = 0x8231;
  R8UI = 0x8232;
  R16I = 0x8233;
  R16UI = 0x8234;
  R32I = 0x8235;
  R32UI = 0x8236;
  RG8I = 0x8237;
  RG8UI = 0x8238;
  RG16I = 0x8239;
  RG16UI = 0x823A;
  RG32I = 0x823B;
  RG32UI = 0x823C;
  VERTEX_ARRAY_BINDING = 0x85B5;
  R8_SNORM = 0x8F94;
  RG8_SNORM = 0x8F95;
  RGB8_SNORM = 0x8F96;
  RGBA8_SNORM = 0x8F97;
  SIGNED_NORMALIZED = 0x8F9C;
  COPY_READ_BUFFER = 0x8F36;
  COPY_WRITE_BUFFER = 0x8F37;
  COPY_READ_BUFFER_BINDING = 0x8F36; /* Same as COPY_READ_BUFFER */
  COPY_WRITE_BUFFER_BINDING = 0x8F37; /* Same as COPY_WRITE_BUFFER */
  UNIFORM_BUFFER = 0x8A11;
  UNIFORM_BUFFER_BINDING = 0x8A28;
  UNIFORM_BUFFER_START = 0x8A29;
  UNIFORM_BUFFER_SIZE = 0x8A2A;
  MAX_VERTEX_UNIFORM_BLOCKS = 0x8A2B;
  MAX_FRAGMENT_UNIFORM_BLOCKS = 0x8A2D;
  MAX_COMBINED_UNIFORM_BLOCKS = 0x8A2E;
  MAX_UNIFORM_BUFFER_BINDINGS = 0x8A2F;
  MAX_UNIFORM_BLOCK_SIZE = 0x8A30;
  MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 0x8A31;
  MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 0x8A33;
  UNIFORM_BUFFER_OFFSET_ALIGNMENT = 0x8A34;
  ACTIVE_UNIFORM_BLOCKS = 0x8A36;
  UNIFORM_TYPE = 0x8A37;
  UNIFORM_SIZE = 0x8A38;
  UNIFORM_BLOCK_INDEX = 0x8A3A;
  UNIFORM_OFFSET = 0x8A3B;
  UNIFORM_ARRAY_STRIDE = 0x8A3C;
  UNIFORM_MATRIX_STRIDE = 0x8A3D;
  UNIFORM_IS_ROW_MAJOR = 0x8A3E;
  UNIFORM_BLOCK_BINDING = 0x8A3F;
  UNIFORM_BLOCK_DATA_SIZE = 0x8A40;
  UNIFORM_BLOCK_ACTIVE_UNIFORMS = 0x8A42;
  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8A43;
  UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8A44;
  UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8A46;
  INVALID_INDEX = 0xFFFFFFFF;
  MAX_VERTEX_OUTPUT_COMPONENTS = 0x9122;
  MAX_FRAGMENT_INPUT_COMPONENTS = 0x9125;
  MAX_SERVER_WAIT_TIMEOUT = 0x9111;
  OBJECT_TYPE = 0x9112;
  SYNC_CONDITION = 0x9113;
  SYNC_STATUS = 0x9114;
  SYNC_FLAGS = 0x9115;
  SYNC_FENCE = 0x9116;
  SYNC_GPU_COMMANDS_COMPLETE = 0x9117;
  UNSIGNALED = 0x9118;
  SIGNALED = 0x9119;
  ALREADY_SIGNALED = 0x911A;
  TIMEOUT_EXPIRED = 0x911B;
  CONDITION_SATISFIED = 0x911C;
  WAIT_FAILED = 0x911D;
  SYNC_FLUSH_COMMANDS_BIT = 0x00000001;
  VERTEX_ATTRIB_ARRAY_DIVISOR = 0x88FE;
  ANY_SAMPLES_PASSED = 0x8C2F;
  ANY_SAMPLES_PASSED_CONSERVATIVE = 0x8D6A;
  SAMPLER_BINDING = 0x8919;
  RGB10_A2UI = 0x906F;
  INT_2_10_10_10_REV = 0x8D9F;
  TRANSFORM_FEEDBACK = 0x8E22;
  TRANSFORM_FEEDBACK_PAUSED = 0x8E23;
  TRANSFORM_FEEDBACK_ACTIVE = 0x8E24;
  TRANSFORM_FEEDBACK_BINDING = 0x8E25;
  TEXTURE_IMMUTABLE_FORMAT = 0x912F;
  MAX_ELEMENT_INDEX = 0x8D6B;
  TEXTURE_IMMUTABLE_LEVELS = 0x82DF;

  TIMEOUT_IGNORED = -1;

  /* WebGL-specific enums */
  MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 0x9247;

  /// 3.7.1 More binding points - covered in old methods.

  /// 3.7.2 Setting and getting state

  /// getParameter extension covered in old method.

  getIndexedParameter(target: GLenum, index: GLuint): any {
    switch (target) {
      case this.TRANSFORM_FEEDBACK_BUFFER_BINDING:
      case this.UNIFORM_BUFFER_BINDING: {
        const result = new Uint32Array(1);
        gl.getIntegeri_v(target, index, result);
        return WebGLBuffer.make(result[0]);
      }

      case this.TRANSFORM_FEEDBACK_BUFFER_SIZE:
      case this.UNIFORM_BUFFER_SIZE: {
        const result = new BigUint64Array(1);
        gl.getInteger64i_v(target, index, result);
        return Number(result[0]);
      }

      case this.TRANSFORM_FEEDBACK_BUFFER_START:
      case this.UNIFORM_BUFFER_START: {
        const result = new BigInt64Array(1);
        gl.getInteger64i_v(target, index, result);
        return Number(result[0]);
      }

      default:
        return null;
    }
  }

  /// isEnabled extension covered in old method.
  /// pixelStorei extension covered in old method.

  /// 3.7.3 Buffer objects

  /// bufferData extension covered in old method.
  /// bufferSubData extension covered in old method.
  /// getBufferParameter extension covered in old method.

  copyBufferSubData(
    readTarget: GLenum,
    writeTarget: GLenum,
    readOffset: GLintptr,
    writeOffset: GLintptr,
    size: GLsizeiptr,
  ): void {
    gl.copyBufferSubData(
      readTarget,
      writeTarget,
      readOffset,
      writeOffset,
      size,
    );
  }

  getBufferSubData(
    target: GLenum,
    srcByteOffset: GLintptr,
    dstData: ArrayBufferView,
  ): void {
    const mapped = gl.mapBufferRange(
      target,
      srcByteOffset,
      dstData.byteLength,
      0x0001,
    );
    if (mapped.value === 0n) {
      return;
    }
    const view = new Deno.UnsafePointerView(mapped);
    view.copyInto(dstData as Uint8Array, 0);
    gl.unmapBuffer(target);
  }

  /// 3.7.4 Framebuffer objects

  /// checkFramebufferStatus extension covered in old method.
  /// getFramebufferAttachmentParameter extension covered in old method.

  blitFramebuffer(
    srcX0: GLint,
    srcY0: GLint,
    srcX1: GLint,
    srcY1: GLint,
    dstX0: GLint,
    dstY0: GLint,
    dstX1: GLint,
    dstY1: GLint,
    mask: GLbitfield,
    filter: GLenum,
  ): void {
    gl.blitFramebuffer(
      srcX0,
      srcY0,
      srcX1,
      srcY1,
      dstX0,
      dstY0,
      dstX1,
      dstY1,
      mask,
      filter,
    );
  }

  framebufferTextureLayer(
    target: GLenum,
    attachment: GLenum,
    texture: WebGLTexture | null,
    level: GLint,
    layer: GLint,
  ): void {
    gl.framebufferTextureLayer(
      target,
      attachment,
      texture ? texture[_name] : 0,
      level,
      layer,
    );
  }

  invalidateFramebuffer(
    target: GLenum,
    attachments: GLenum[],
  ): void {
    gl.invalidateFramebuffer(
      target,
      attachments.length,
      new Uint32Array(attachments),
    );
  }

  invalidateSubFramebuffer(
    target: GLenum,
    attachments: GLenum[],
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
  ): void {
    gl.invalidateSubFramebuffer(
      target,
      attachments.length,
      new Uint32Array(attachments),
      x,
      y,
      width,
      height,
    );
  }

  readBuffer(src: GLenum): void {
    gl.readBuffer(src);
  }

  /// 3.7.5 Renderbuffer objects

  getInternalformatParameter(
    target: GLenum,
    internalformat: GLenum,
    pname: GLenum,
  ): any {
    switch (pname) {
      case this.SAMPLES: {
        const count = new Uint32Array(1);
        const NUM_SAMPLE_COUNTS = 0x9380;
        gl.getInternalformativ(
          target,
          internalformat,
          NUM_SAMPLE_COUNTS,
          1,
          count,
        );
        const result = new Int32Array(count[0]);
        gl.getInternalformativ(
          target,
          internalformat,
          pname,
          count[0],
          result,
        );
        return result;
      }

      default:
        return null;
    }
  }

  /// getRenderbufferParameter extension covered in old method.
  /// renderbufferStorage extension covered in old method.

  renderbufferStorageMultisample(
    target: GLenum,
    samples: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
  ): void {
    gl.renderbufferStorageMultisample(
      target,
      samples,
      internalformat,
      width,
      height,
    );
  }

  /// 3.7.6 Texture objects

  /// getTexParameter extension covered in old method.
  /// texParameterf extension covered in old method.
  /// texParameteri extension covered in old method.

  texStorage2D(
    target: GLenum,
    levels: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
  ): void {
    gl.texStorage2D(target, levels, internalformat, width, height);
  }

  texStorage3D(
    target: GLenum,
    levels: GLsizei,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
  ): void {
    gl.texStorage3D(target, levels, internalformat, width, height, depth);
  }

  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | Image | null,
    // TODO: handle this
    _srcOffset?: GLuint,
  ): void {
    gl.texSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      pixels instanceof Image ? pixels.rawData : (pixels as Uint8Array),
    );
  }

  /// TODO: texImage2D overload
  /// TODO: texSubImage2D overload
  /// TODO: texImage3D
  /// TODO: texSubImage3D

  /// 3.7.7 Programs and Shaders

  getFragDataLocation(
    program: WebGLProgram,
    name: string,
  ): GLint {
    return gl.getFragDataLocation(program[_name], cstr(name));
  }

  /// getProgramParameter extension covered in old method.

  /// 3.7.11 Multiple render targets

  drawBuffers(buffers: GLenum[]): void {
    gl.drawBuffers(buffers.length, new Uint32Array(buffers));
  }

  clearBufferfv(
    buffer: GLenum,
    drawbuffer: GLint,
    values: GLfloat[] | Float32Array,
  ): void {
    gl.clearBufferfv(buffer, drawbuffer, new Float32Array(values));
  }

  clearBufferiv(
    buffer: GLenum,
    drawbuffer: GLint,
    values: GLint[] | Int32Array,
  ): void {
    gl.clearBufferiv(buffer, drawbuffer, new Int32Array(values));
  }

  clearBufferuiv(
    buffer: GLenum,
    drawbuffer: GLint,
    values: GLuint[] | Uint32Array,
  ): void {
    gl.clearBufferuiv(buffer, drawbuffer, new Uint32Array(values));
  }

  clearBufferfi(
    buffer: GLenum,
    drawbuffer: GLint,
    depth: GLfloat,
    stencil: GLint,
  ): void {
    gl.clearBufferfi(buffer, drawbuffer, depth, stencil);
  }

  /// 3.7.12 Query objects

  createQuery(): WebGLQuery {
    const query = new Uint32Array(1);
    gl.genQueries(1, query);
    return WebGLQuery.make(query[0]);
  }

  deleteQuery(query: WebGLQuery | null): void {
    gl.deleteQueries(1, new Uint32Array([query?.[_name] ?? 0]));
  }

  isQuery(query: WebGLQuery | null): GLboolean {
    return Boolean(gl.isQuery(query?.[_name] ?? 0));
  }

  beginQuery(target: GLenum, query: WebGLQuery): void {
    gl.beginQuery(target, query[_name]);
  }

  endQuery(target: GLenum): void {
    gl.endQuery(target);
  }

  getQuery(target: GLenum, pname: GLenum): any {
    switch (pname) {
      case this.CURRENT_QUERY: {
        const query = new Uint32Array(1);
        gl.getQueryiv(target, pname, query);
        return query[0] ? WebGLQuery.make(query[0]) : null;
      }

      default:
        return null;
    }
  }

  getQueryParameter(query: WebGLQuery, pname: GLenum): any {
    switch (pname) {
      case this.QUERY_RESULT: {
        const result = new Uint32Array(1);
        gl.getQueryObjectuiv(query[_name], pname, result);
        return result[0];
      }

      case this.QUERY_RESULT_AVAILABLE: {
        const result = new Uint32Array(1);
        gl.getQueryObjectuiv(query[_name], pname, result);
        return result[0] === 1;
      }

      default:
        return null;
    }
  }

  /// 3.7.13 Sampler objects

  createSampler(): WebGLSampler {
    const sampler = new Uint32Array(1);
    gl.genSamplers(1, sampler);
    return WebGLSampler.make(sampler[0]);
  }

  deleteSampler(sampler: WebGLSampler | null): void {
    gl.deleteSamplers(1, new Uint32Array([sampler?.[_name] ?? 0]));
  }

  isSampler(sampler: WebGLSampler | null): GLboolean {
    return Boolean(gl.isSampler(sampler?.[_name] ?? 0));
  }

  bindSampler(unit: GLuint, sampler: WebGLSampler | null): void {
    gl.bindSampler(unit, sampler?.[_name] ?? 0);
  }

  samplerParameteri(
    sampler: WebGLSampler,
    pname: GLenum,
    param: GLint,
  ): void {
    gl.samplerParameteri(sampler[_name], pname, param);
  }

  samplerParameterf(
    sampler: WebGLSampler,
    pname: GLenum,
    param: GLfloat,
  ): void {
    gl.samplerParameterf(sampler[_name], pname, param);
  }

  getSamplerParameter(
    sampler: WebGLSampler,
    pname: GLenum,
  ): any {
    switch (pname) {
      case this.TEXTURE_COMPARE_FUNC:
      case this.TEXTURE_COMPARE_MODE:
      case this.TEXTURE_MAG_FILTER:
      case this.TEXTURE_MIN_FILTER:
      case this.TEXTURE_WRAP_R:
      case this.TEXTURE_WRAP_S:
      case this.TEXTURE_WRAP_T: {
        const result = new Uint32Array(1);
        gl.getSamplerParameteriv(sampler[_name], pname, result);
        return result[0];
      }

      case this.TEXTURE_MAX_LOD:
      case this.TEXTURE_MIN_LOD: {
        const result = new Float32Array(1);
        gl.getSamplerParameterfv(sampler[_name], pname, result);
        return result[0];
      }

      default:
        return null;
    }
  }

  /// 3.7.14 Sync objects

  fenceSync(condition: GLenum, flags: GLbitfield): WebGLSync {
    const sync = gl.fenceSync(condition, flags);
    return new WebGLSync(sync);
  }

  isSync(sync: WebGLSync | null): GLboolean {
    return Boolean(gl.isSync(sync?.[_name] ?? 0));
  }

  deleteSync(sync: WebGLSync | null): void {
    gl.deleteSync(sync?.[_name] ?? 0);
  }

  clientWaitSync(
    sync: WebGLSync,
    flags: GLbitfield,
    timeout: GLuint64,
  ): GLenum {
    return gl.clientWaitSync(sync[_name], flags, timeout);
  }

  waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64): void {
    gl.waitSync(sync[_name], flags, timeout);
  }

  getSyncParameter(sync: WebGLSync, pname: GLenum): any {
    switch (pname) {
      case this.OBJECT_TYPE:
      case this.SYNC_STATUS:
      case this.SYNC_CONDITION:
      case this.SYNC_FLAGS: {
        const result = new Int32Array(1);
        const outLen = new Uint32Array(1);
        gl.getSynciv(sync[_name], pname, 1, outLen, result);
        return result[0];
      }

      default:
        return null;
    }
  }

  /// 3.7.15 Transform feedback

  createTransformFeedback(): WebGLTransformFeedback {
    const feedback = new Uint32Array(1);
    gl.genTransformFeedbacks(1, feedback);
    return WebGLTransformFeedback.make(feedback[0]);
  }

  deleteTransformFeedback(
    transformFeedback: WebGLTransformFeedback | null,
  ): void {
    gl.deleteTransformFeedbacks(
      1,
      new Uint32Array([transformFeedback?.[_name] ?? 0]),
    );
  }

  isTransformFeedback(
    transformFeedback: WebGLTransformFeedback | null,
  ): GLboolean {
    return Boolean(gl.isTransformFeedback(transformFeedback?.[_name] ?? 0));
  }

  bindTransformFeedback(
    target: GLenum,
    transformFeedback: WebGLTransformFeedback | null,
  ): void {
    gl.bindTransformFeedback(target, transformFeedback?.[_name] ?? 0);
  }

  beginTransformFeedback(target: GLenum): void {
    gl.beginTransformFeedback(target);
  }

  endTransformFeedback(): void {
    gl.endTransformFeedback();
  }

  pauseTransformFeedback(): void {
    gl.pauseTransformFeedback();
  }

  resumeTransformFeedback(): void {
    gl.resumeTransformFeedback();
  }

  transformFeedbackVaryings(
    program: WebGLProgram,
    varyings: string[],
    bufferMode: GLenum,
  ): void {
    const varyingCstrs = varyings.map(cstr);
    const ptrs = new BigUint64Array(varyings.length);
    for (let i = 0; i < varyings.length; i++) {
      ptrs[i] = Deno.UnsafePointer.of(varyingCstrs[i]).value;
    }
    gl.transformFeedbackVaryings(program[_name], ptrs.length, ptrs, bufferMode);
  }

  getTransformFeedbackVarying(
    program: WebGLProgram,
    index: GLuint,
  ): WebGLActiveInfo | null {
    const name = new Uint8Array(128);
    const length = new Uint32Array(1);
    const size = new Uint32Array(1);
    const type = new Uint32Array(1);
    gl.getTransformFeedbackVarying(
      program[_name],
      index,
      name.length,
      length,
      size,
      type,
      name,
    );
    return {
      name: new TextDecoder().decode(name.subarray(0, length[0])),
      size: size[0],
      type: type[0],
    };
  }

  /// 3.7.16 Uniform Buffer objects

  bindBufferBase(
    target: GLenum,
    index: GLuint,
    buffer: WebGLBuffer | null,
  ): void {
    gl.bindBufferBase(target, index, buffer?.[_name] ?? 0);
  }

  bindBufferRange(
    target: GLenum,
    index: GLuint,
    buffer: WebGLBuffer | null,
    offset: GLintptr,
    size: GLsizeiptr,
  ): void {
    gl.bindBufferRange(target, index, buffer?.[_name] ?? 0, offset, size);
  }

  getUniformIndices(
    program: WebGLProgram,
    uniformNames: string[],
  ): GLuint[] {
    const indices = new Uint32Array(uniformNames.length);
    const pointers = new BigUint64Array(uniformNames.length);
    const cstrs = uniformNames.map(cstr);
    cstrs.forEach((e, i) => {
      pointers[i] = Deno.UnsafePointer.of(e).value;
    });
    gl.getUniformIndices(
      program[_name],
      uniformNames.length,
      pointers,
      indices,
    );
    return [...indices];
  }

  getActiveUniforms(
    program: WebGLProgram,
    uniformIndices: GLuint[],
    pname: GLenum,
  ): any {
    switch (pname) {
      case this.UNIFORM_SIZE:
      case this.UNIFORM_TYPE: {
        const activeUniforms = this.getProgramParameter(
          program,
          this.ACTIVE_UNIFORMS,
        );
        const data = new Uint32Array(activeUniforms);
        gl.getActiveUniformsiv(
          program[_name],
          uniformIndices.length,
          new Uint32Array(uniformIndices),
          pname,
          data,
        );
        return [...data];
      }

      case this.UNIFORM_BLOCK_INDEX:
      case this.UNIFORM_OFFSET:
      case this.UNIFORM_ARRAY_STRIDE:
      case this.UNIFORM_MATRIX_STRIDE: {
        const activeUniforms = this.getProgramParameter(
          program,
          this.ACTIVE_UNIFORMS,
        );
        const data = new Int32Array(activeUniforms);
        gl.getActiveUniformsiv(
          program[_name],
          uniformIndices.length,
          new Uint32Array(uniformIndices),
          pname,
          data,
        );
        return [...data];
      }

      case this.UNIFORM_IS_ROW_MAJOR: {
        const activeUniforms = this.getProgramParameter(
          program,
          this.ACTIVE_UNIFORMS,
        );
        const data = new Int32Array(activeUniforms);
        gl.getActiveUniformsiv(
          program[_name],
          uniformIndices.length,
          new Uint32Array(uniformIndices),
          pname,
          data,
        );
        return [...data].map((e) => Boolean(e));
      }

      default:
        return null;
    }
  }

  getUniformBlockIndex(
    program: WebGLProgram,
    uniformBlockName: string,
  ): GLuint {
    return gl.getUniformBlockIndex(program[_name], cstr(uniformBlockName));
  }

  getActiveUniformBlockParameter(
    program: WebGLProgram,
    uniformBlockIndex: GLuint,
    pname: GLenum,
  ): any {
    switch (pname) {
      case this.UNIFORM_BLOCK_BINDING:
      case this.UNIFORM_BLOCK_DATA_SIZE:
      case this.UNIFORM_BLOCK_ACTIVE_UNIFORMS: {
        const result = new Int32Array(1);
        gl.getActiveUniformBlockiv(
          program[_name],
          uniformBlockIndex,
          pname,
          result,
        );
        return result[0];
      }

      case this.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: {
        const activeUniforms = this.getProgramParameter(
          program,
          this.UNIFORM_BLOCK_ACTIVE_UNIFORMS,
        );
        const data = new Uint32Array(activeUniforms);
        gl.getActiveUniformBlockiv(
          program[_name],
          uniformBlockIndex,
          pname,
          data,
        );
        return [...data];
      }

      case this.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER:
      case this.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: {
        const result = new Int32Array(1);
        gl.getActiveUniformBlockiv(
          program[_name],
          uniformBlockIndex,
          pname,
          result,
        );
        return Boolean(result[0]);
      }

      default:
        return null;
    }
  }

  getActiveUniformBlockName(
    program: WebGLProgram,
    uniformBlockIndex: GLuint,
  ): string {
    const length = new Uint32Array(1);
    gl.getActiveUniformBlockName(
      program[_name],
      uniformBlockIndex,
      0,
      length,
      null,
    );
    const result = new Uint8Array(length[0]);
    gl.getActiveUniformBlockName(
      program[_name],
      uniformBlockIndex,
      length[0],
      null,
      result,
    );
    return new TextDecoder().decode(result);
  }

  uniformBlockBinding(
    program: WebGLProgram,
    uniformBlockIndex: GLuint,
    uniformBlockBinding: GLuint,
  ): void {
    gl.uniformBlockBinding(
      program[_name],
      uniformBlockIndex,
      uniformBlockBinding,
    );
  }

  /// 3.7.17 Vertex Array objects

  bindVertexArray(vao: WebGLVertexArrayObject | null): void {
    gl.bindVertexArray(vao ? vao[_name] : 0);
  }

  createVertexArray(): WebGLVertexArrayObject {
    const vao = new Uint32Array(1);
    gl.genVertexArrays(1, vao);
    const result = WebGLVertexArrayObject.make(vao[0]);
    return result;
  }

  deleteVertexArray(vao: WebGLVertexArrayObject | null): void {
    gl.deleteVertexArrays(1, new Uint32Array([vao ? vao[_name] : 0]));
  }

  isVertexArray(vao: WebGLVertexArrayObject | null): GLboolean {
    return Boolean(gl.isVertexArray(vao ? vao[_name] : 0));
  }
}

Object.defineProperty(window, "WebGLRenderingContext", {
  value: WebGL2RenderingContext,
});

Object.defineProperty(window, "WebGL2RenderingContext", {
  value: WebGL2RenderingContext,
});
