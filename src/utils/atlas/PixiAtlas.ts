import { Frame } from "../../types.ts";
interface IPixiFrame {
    frame: { x: number, y: number, w: number, h: number},
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: { x: number, y: number, w: number, h: number },
    sourceSize: { w: number, h: number }
}
interface IPixiAtlas {
    frames: {
        [key: string] : IPixiFrame
    }
    meta: {
        app: string,
        version: string,
        image: string,
        format: string
        size: { w: number, h: number },
        scale: string,
        smartupdate: string
    }
}
export class PixiAtlas {
    public frames: { [key:string] : Frame } = {};
    public width: number;
    public height: number;
    public imgUrl: string;
    constructor(data: IPixiAtlas) {
        this.width = data.meta.size.w;
        this.height = data.meta.size.h;
        this.imgUrl = `file:///${Deno.cwd()}/${data.meta.image}`;
        for (const i in data.frames) {
            const frame = data.frames[i];
            this.frames[i] = {
                x: frame.frame.x,
                y: frame.frame.y,
                width: frame.frame.w,
                height: frame.frame.h
            }
        }        
    }
}