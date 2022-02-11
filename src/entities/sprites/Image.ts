import { Entity } from '../mod.ts';
import { Image as HTMLImage } from '../../../deno_gl/mod.ts';



export class Image extends Entity {
    public width: number;
    public height: number
    public image: HTMLImage;
    public url: string;

    constructor(
        url: string,
        x: number,
        y: number,
    ) {
        super(x, y);
        this.width = 0;
        this.height = 0;
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
                res(this)
            }
            this.image.onerror = rej
        })
    }
}