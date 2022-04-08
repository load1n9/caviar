import type { Frame } from "../types.ts";
export const generateFrames = (width: number, height: number, rows: number, cols: number): Array<Frame> => {
    const frames = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            frames.push({
                x: i * (width / cols),
                y: j * (height / rows),
                width: width / cols,
                height: height / rows
            });
        }
    }
    return frames;
}