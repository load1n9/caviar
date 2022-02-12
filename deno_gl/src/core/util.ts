export type MapType<T extends Deno.NativeType> = T extends "u8" ? number
  : T extends "i8" ? number
  : T extends "u16" ? number
  : T extends "i16" ? number
  : T extends "u32" ? number
  : T extends "i32" ? number
  : T extends "u64" ? number
  : T extends "i64" ? number
  : T extends "f32" ? number
  : T extends "f64" ? number
  : T extends "pointer" ? Deno.UnsafePointer
  : T extends "void" ? void
  : never;

export type MapParamType<T extends Deno.NativeType> = T extends "pointer" ? (
  | Deno.UnsafePointer
  | null
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Float32Array
  | Float64Array
  | Uint32Array
  | Int32Array
  | BigUint64Array
  | BigInt64Array
)
  : MapType<T>;

export type MapParameters<T extends Deno.NativeType[]> = [
  ...{
    [K in keyof T]: T[K] extends Deno.NativeType ? MapParamType<T[K]> : unknown;
  },
];

export type MapFunction<T extends Deno.ForeignFunction> = (
  ...args: MapParameters<T[any]>
) => T["nonblocking"] extends true ? Promise<MapType<T["result"]>>
  : MapType<T["result"]>;

export type MapFFI<T extends Record<string, Deno.ForeignFunction>> = {
  [name in keyof T]: MapFunction<T[name]>;
};

export function cstr(str: string) {
  const buffer = new Uint8Array(str.length + 1);
  new TextEncoder().encodeInto(str, buffer);
  return buffer;
}

export const OS_LIB_PREFIX = Deno.build.os === "windows" ? "" : "lib";
export const OS_LIB_PREFIX_DAWN = Deno.build.os === "windows" ? Deno.build.arch === "x86_64" ? "" : "arm" : "lib";
export const OS_LIB_SUFFIX = Deno.build.os === "windows"
  ? "dll"
  : Deno.build.os === "darwin"
  ? "dylib"
  : "so";
