export { Keys } from "./Keycodes.ts";
export { atlas, GodotAtlas, PhaserAtlas, PixiAtlas } from "./atlas/mod.ts";
export { hexToRGBA } from "./HexToRGBA.ts";
export { generateFrames } from "./Frames.ts";
export { QuadTree } from "./QuadTree.ts";
export { sleepSync } from "./system.ts";

export const printBanner = (version: string) => {
  console.log.apply(globalThis.console, [
    "\n %c %c %c Caviar " + "v." + version + " - 🚀" + "WebGPU" +
    "  %c  %c  https://github.com/load1n9/caviar",
    "background: #d48e1e; padding:5px 0;",
    "background: #e67615; padding:5px 0;",
    "color: #e67615; background: #030307; padding:5px 0;",
    "background: #e67615; padding:5px 0;",
    "background: #d48e1e; padding:5px 0;",
  ]);
};
