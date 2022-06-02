import type { RGBA } from "../types.ts";

export const hexToRGBA = (hex: string): RGBA => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
  1,
];
