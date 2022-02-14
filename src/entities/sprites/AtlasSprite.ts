import { Entity, Atlas } from "../mod.ts";
import { Frame } from '../../types.ts';
import { Image as HTMLImage } from 'https://deno.land/x/daybreak@v0.0.2/mod.ts';

export class AtlasSprite  extends Entity {
    public atlas: Atlas;
    public frame: Frame;
    public image: HTMLImage;
    private _frame: string;
    constructor(atlas: Atlas, x: number, y: number, frame: string) { 
        super(x, y);
        this.atlas = atlas;
        this._frame = frame;
        this.frame = atlas.getFrame(frame);
        this.image = new HTMLImage;
    }
    public  load() {
        return new Promise<AtlasSprite>((res, rej) => {
            this.image.src = this.atlas.imgUrl
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.atlas.preloaded = true;
                res(this)
            }
            this.image.onerror = rej
        });
    }
    
}