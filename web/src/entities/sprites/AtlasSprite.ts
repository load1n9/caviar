import { Atlas, Entity } from "../mod.ts";
import { Frame } from "../../types.ts";

export class AtlasSprite extends Entity {
  atlas: Atlas;
  frame: Frame;
  // @ts-ignore: typescript is weird
  bitmap: ImageBitmap;
  // @ts-ignore: typescript is weird
  image: HTMLImageElement;
  #frame: string;
  constructor(atlas: Atlas, x: number, y: number, frame: string) {
    super(x, y);
    this.atlas = atlas;
    this.#frame = frame;
    // @ts-ignore: typescript is weird
    this.image = document.createElement("img");
    this.frame = this.atlas.getFrame(this.#frame);
  }
  load() {
    return new Promise<AtlasSprite>((res, rej) => {
      this.image.src = this.atlas.imgUrl;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        this.atlas.preloaded = true;
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
