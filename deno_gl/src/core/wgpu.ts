import { OS_LIB_PREFIX_DAWN, OS_LIB_SUFFIX } from "./util.ts";

// dawn uses a proc table to handle dll calls
// to setup `dawn_proc.dll`, we need call `dawnProcSetProcs()`
// and pass in a pointer to a `DawnProcTable`
//https://dawn.googlesource.com/dawn/+/refs/heads/main/include/dawn/dawn_proc.h#30

export const LIB_PATH = new URL(
    `../../dist/${OS_LIB_PREFIX_DAWN}dawn_proc.${OS_LIB_SUFFIX}`,
    import.meta.url,
);

export const lib = Deno.dlopen(LIB_PATH, {
    dawnProcSetProcs: {
        parameters: ["pointer"],
        result: "void",
    },
    wgpuCreateInstance: {
        parameters: ["pointer"],
        result: "pointer",
    },
});

export const LIB_NATIVE_PATH = new URL(
    `../../dist/${OS_LIB_PREFIX_DAWN}dawn_native.${OS_LIB_SUFFIX}`,
    import.meta.url,
);

// `dawn_native.dll` exports `GetProcs()` which returns a `DawnProcTable&`
// https://dawn.googlesource.com/dawn/+/refs/heads/main/include/dawn/native/DawnNative.h#176

const symbols = {}
// @ts-ignore
symbols["?GetProcs@native@dawn@@YAAEBUDawnProcTable@@XZ"] = {
    parameters: [],
    result: "pointer",
}
const lib_native = Deno.dlopen(LIB_NATIVE_PATH, symbols as any);

// @ts-ignore
const test = lib_native.symbols["?GetProcs@native@dawn@@YAAEBUDawnProcTable@@XZ"]()
lib.symbols.dawnProcSetProcs(test as Deno.UnsafePointer)