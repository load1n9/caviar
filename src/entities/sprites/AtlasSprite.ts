import { Atlas, Entity } from "../mod.ts";
import { Frame } from "../../types.ts";
import { Image as HTMLImage } from "../../../deps.ts";

export class AtlasSprite extends Entity {
  atlas: Atlas;
  frame: Frame;
  image: HTMLImage;
  #frame: string;

  constructor(atlas: Atlas, x: number, y: number, frame: string) {
    super(x, y);
    this.atlas = atlas;
    this.#frame = frame;
    this.frame = atlas.getFrame(frame);
    this.image = new HTMLImage();
  }

  load() {
    return new Promise<AtlasSprite>((res, rej) => {
      this.image.src = this.atlas.imgUrl;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        this.atlas.preloaded = true;
        res(this);
      };
      this.image.onerror = rej;
    });
  }

  collides(x: number, y: number): boolean {
    return (x > this.x && x < this.x + this.frame.width && y > this.y &&
      y < this.y + this.frame.height);
  }
}
