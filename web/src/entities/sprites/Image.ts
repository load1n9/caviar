import { Entity } from "../Entity.ts";

export class Image extends Entity {
  // @ts-ignore: typescript is weird
  bitmap: ImageBitmap;
  // @ts-ignore: typescript is weird
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
    // @ts-ignore: typescript is weird
    this.image = document.createElement("img");
    this.url = url;
  }

  load() {
    return new Promise<Image>((res, rej) => {
      this.image.src = this.url;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        // @ts-ignore: typescript is weird
        createImageBitmap(this.image).then((img: ImageBitmap) => {
          this.bitmap = img;
          res(this);
        });
      };
      this.image.onerror = rej;
    });
  }
}
