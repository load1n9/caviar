import { Entity } from '../mod.ts';
import { Frame } from '../../types.ts';
import { PhaserAtlas, PixiAtlas, GodotAtlas, atlas } from './../../utils/atlas/mod.ts';

export class Atlas extends Entity {
    atlas: PhaserAtlas | PixiAtlas | GodotAtlas;
    bitmap: ImageBitmap
    image: HTMLImageElement;
    preloaded = false;
    constructor(
        atlasUrl: string,
        type: string = "phaser"
    ) {
        super(0, 0);
        this.image = document.createElement("img");
        this.atlas = atlas(atlasUrl, type);
    }

    getFrame(key: string): Frame {
        return this.atlas.frames[key];
    }

    get imgUrl(): string {
        return this.atlas.imgUrl;
    }
    load(): Promise<Atlas> {
        return new Promise<Atlas>((res, rej) => {
            this.image.src = this.atlas.imgUrl
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.preloaded = true;
                createImageBitmap(this.image).then(img => {
                    this.bitmap = img
                    res(this)
                });
            }
            this.image.onerror = rej
        })
    }
}