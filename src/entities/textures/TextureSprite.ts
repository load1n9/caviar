import { Entity } from '../mod.ts';
import { World } from '../../../mod.ts';
import { PixelTexture } from "../../types.ts";
import { Arne16 } from "./palettes/mod.ts";
export class TextureSprite extends Entity {
    public data: string[];
    public palette: string[];
    public pixelWidth: number;
    public pixelHeight: number;
    public width: number;
    public height: number;
    constructor(_world: World, x: number, y: number, texture: PixelTexture) {
        super(x, y);
            this.data = texture.data,
            this.palette = texture.palette || Arne16,
            this.pixelWidth = texture.pixelWidth || 1;
            this.pixelHeight = texture.pixelHeight || this.pixelWidth;
            this.width = Math.floor(Math.abs(this.data[0].length * this.pixelWidth));
            this.height = Math.floor(Math.abs(this.data.length * this.pixelHeight));
    }
}