import { Entity } from '../mod.ts';
import { Frame } from '../../types.ts';
import { PhaserAtlas, atlas } from './../../utils/mod.ts';
import { Image as HTMLImage } from '../../../deno_gl/mod.ts';

export class Atlas extends Entity {
    public atlas: PhaserAtlas;
    public image: HTMLImage;
    public preloaded = false;
    constructor(
        atlasUrl: string
    ) {
        super(0, 0);
        this.image = new HTMLImage;
        this.atlas = atlas(`file:///${Deno.cwd()}/${atlasUrl}`);
    }

    public getFrame(key: string): Frame {
        return this.atlas.frames[key];
    }

    public get imgUrl(): string {
        return this.atlas.imgUrl;
    }
    public load(): Promise<Atlas> {
        return new Promise<Atlas>((res, rej) => {
            this.image.src = this.atlas.imgUrl
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.preloaded = true;
                res(this)
            }
            this.image.onerror = rej
        })
    }
}


