import { ANGLEInstanceArrays } from "./angle_instance_arrays.ts";
import { EXTBlendMinmax } from "./ext_blend_minmax.ts";
import { EXTColorBufferFloat } from "./ext_color_buffer_float.ts";
import { EXTColorBufferHalfFloat } from "./ext_color_buffer_half_float.ts";
import { EXTDisjointTimerQuery } from "./ext_disjoint_timer_query.ts";
import { EXTFloatBlend } from "./ext_float_blend.ts";
import { EXTFragDepth } from "./ext_frag_depth.ts";
import { EXTShaderTextureLod } from "./ext_shader_texture_lod.ts";
import { EXTSRGB } from "./ext_srgb.ts";
import { EXTTextureFilterAnisotropic } from "./ext_texture_filter_anisotropic.ts";
import { KHRParallelShaderCompile } from "./khr_parallel_shader_compile.ts";
import { OESTextureFloatLinear } from "./oes_texture_float_linear.ts";
import { OESTextureHalfFloat } from "./oes_texture_half_float.ts";

export const extensions = {
  ANGLE_instanced_arrays: ANGLEInstanceArrays,
  EXT_blend_minmax: EXTBlendMinmax,
  EXT_color_buffer_float: EXTColorBufferFloat,
  EXT_color_buffer_half_float: EXTColorBufferHalfFloat,
  EXT_disjoint_timer_query: EXTDisjointTimerQuery,
  EXT_float_blend: EXTFloatBlend,
  EXT_frag_depth: EXTFragDepth,
  EXT_shader_texture_lod: EXTShaderTextureLod,
  EXT_sRGB: EXTSRGB,
  OES_texture_half_float: OESTextureHalfFloat,
  OES_texture_float_linear: OESTextureFloatLinear,
  EXT_texture_filter_anisotropic: EXTTextureFilterAnisotropic,
  KHR_parallel_shader_compile: KHRParallelShaderCompile,
};
