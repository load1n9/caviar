import { Entity } from '../mod.ts';
import { World } from '../../../mod.ts';
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';

export class Text extends Entity {
    public font: any;
    public color: RGBA;
    public text: string;
    public surface: any;
    public texture: any;
    public width: number;
    public height: number;
    constructor(world: World, font: string, text: string, x:number,y:number, width: number, height: number, size: number = 128, color: RGBA | string = [255, 255, 255, 1]) {
        super(x,y);
        this.width = width;
        this.height = height;
        this.text = text;
        this.font = world.loadFont(font, size, { style: "normal", });
        this.color = typeof color === 'string' ? hexToRGBA(color) : color;
    }

    public render(world: World) {
        this.surface = world.renderFont(this.font, this.text, {
            blended: {
              color: {
                r: this.color[0],
                g: this.color[1],
                b: this.color[2],
                a: this.color[3],
              },
            },
        });
        const texture = world.createTextureFromSurface(this.surface);
    }
}