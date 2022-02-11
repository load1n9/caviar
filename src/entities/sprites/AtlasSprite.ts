import { Entity, Atlas } from "../mod.ts";
import { Frame } from '../../types.ts';
export class AtlasSprite  extends Entity {

    public atlas: Atlas;
    public frame: Frame;
    public url: string;
    constructor(atlas: Atlas, x: number, y: number, frame: string) { 
        super(x, y);
        this.atlas = atlas;
        this.frame = atlas.getFrame(frame);
        this.url = atlas.imgUrl;
    }
    public async load() {
        if (this.atlas.preloaded) return this;
        await this.atlas.load();
        return this;
    }
    
}