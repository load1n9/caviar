import type { RGBA, Frame } from "../types.ts";
export { Keys } from "./Keycodes.ts";
export const hexToRGBA = (hex: string): RGBA =>
    [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
        1
    ]
export const generateFrames = (width: number, height: number, rows: number, cols: number): Array<Frame> => {
    const frames = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            frames.push({
                x: i * (width/cols),
                y: j * (height/rows),
                width: width / cols,
                height: height/rows
            });
        }
    }
    return frames;
}