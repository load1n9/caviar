export type RGBA = [number, number, number, number];
export type RGB = [number, number, number];

export interface PixelTexture {
    data: string[];
    palette?: string[];
    pixelWidth?: number;
    pixelHeight?: number;
}
export interface Frame {
    x: number,
    y: number,
    width: number,
    height: number
}
export interface SpriteConfig {
    cols: number,
    rows: number,
}