import { Entity } from "../Entity.ts";

export class Image extends Entity {
    bitmap: ImageBitmap
    image: HTMLImageElement;
    url: string;

    constructor(
        url: string,
        x: number,
        y: number,
    ) {
        super(x, y);
        this.width = 0;
        this.height = 0;
        this.image = document.createElement("img");
        this.url = url;
    }

    load() {
        return new Promise<Image>((res, rej) => {
            this.image.src = this.url
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                createImageBitmap(this.image).then(img => {
                    this.bitmap = img
                    res(this)
                })
            }
            this.image.onerror = rej
        })
    }
}