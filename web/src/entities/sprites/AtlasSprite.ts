import { Entity, Atlas } from "../mod.ts";
import { Frame } from '../../types.ts';

export class AtlasSprite  extends Entity {
    atlas: Atlas;
    frame?: Frame;
    bitmap: ImageBitmap
    image: HTMLImageElement;
    #frame: string;
    constructor(atlas: Atlas, x: number, y: number, frame: string) { 
        super(x, y);
        this.atlas = atlas;
        this.#frame = frame;
        this.image = document.createElement("img");
    }
    load() {
        this.frame = this.atlas.getFrame(this.#frame);
        return new Promise<AtlasSprite>((res, rej) => {
            this.image.src = this.atlas.imgUrl
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.atlas.preloaded = true;
                createImageBitmap(this.image).then(img => {
                    this.bitmap = img
                    res(this)
                })
            }
            this.image.onerror = rej
        });
    }
    
}