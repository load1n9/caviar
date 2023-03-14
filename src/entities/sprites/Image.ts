import { Entity } from "../mod.ts";
import { Image as HTMLImage } from "../../../deps.ts";

export class Image extends Entity {
  width: number;
  height: number;
  image: HTMLImage;
  url: string;

  constructor(
    url: string,
    x: number,
    y: number,
  ) {
    super(x, y);
    this.width = 0;
    this.height = 0;
    this.image = new HTMLImage();
    //TODO: this is a terrible hack pls fix this
    this.url = `file:///${Deno.cwd()}/${url}`;
  }

  load() {
    return new Promise<Image>((res, rej) => {
      this.image.src = this.url;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        res(this);
      };
      this.image.onerror = rej;
    });
  }

  collides(x: number, y: number): boolean {
    return (x > this.x && x < this.x + this.image.width && y > this.y &&
      y < this.y + this.image.height);
  }
}
