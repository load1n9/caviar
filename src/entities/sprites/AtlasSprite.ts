import { Entity, Atlas } from "../mod.ts";
import { World } from '../../../mod.ts';
import { Frame } from '../../types.ts';
export class AtlasSprite  extends Entity {

    public atlas: Atlas;
    public frame: Frame;
    public surface: any;
    public texture: any;

    constructor(world: World, x: number, y: number, atlas: Atlas, frame: string) { 
        super(x, y);
        this.atlas = atlas;
        this.frame = atlas.getFrame(frame);
        this.surface = world.loadSurface(atlas.imgUrl);
        this.texture = world.createTextureFromSurface(this.surface);

    }
}