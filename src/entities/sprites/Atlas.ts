import { Entity } from '../mod.ts';
// import { World } from '../../../mod.ts';
import { Frame } from '../../types.ts';
import { PhaserAtlas, atlas } from './../../utils/mod.ts';
export class Atlas extends Entity {
    public atlas: PhaserAtlas;
    constructor(
        atlasUrl: string
    ) {
        super(0, 0);
        this.atlas = atlas(atlasUrl);
    }

    public getFrame(key: string): Frame {
        return this.atlas.frames[key];
    }

    public get imgUrl(): string {
        return this.atlas.imgUrl;
    }
}


