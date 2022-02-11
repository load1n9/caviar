import { Entity } from '../mod.ts';
import { Image as HTMLImage } from '../../../deno_gl/mod.ts';

type Crop = {
    x: number,
    y: number,
    width: number,
    height: number
}

export class Image extends Entity {
    public width: number;
    public height: number
    public image: HTMLImage;
    public url: string;
    public crop: Crop

    constructor(
        url: string,
        x: number,
        y: number,
        crop: Crop = {
            x: 0,
            y: 0,
            width: 1,
            height: 1
        }
    ) {
        super(x, y);
        this.width = 0;
        this.height = 0;
        this.crop = crop
        this.image = new HTMLImage;
        //TODO: this is a terrible hack pls fix this
        this.url = `file:///${Deno.cwd()}/${url}`;
    }

    public load() {
        return new Promise<Image>((res, rej) => {
            this.image.src = this.url
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.crop.width = this.crop.width || this.width;
                this.crop.height = this.crop.height || this.height;
                res(this)
            }
            this.image.onerror = rej
        })
    }
}