import { Entity } from "../mod.ts";
import { Frame } from "../../types.ts";
import {
  atlas,
  GodotAtlas,
  PhaserAtlas,
  PixiAtlas,
} from "./../../utils/atlas/mod.ts";

export class Atlas extends Entity {
  atlas: PhaserAtlas | PixiAtlas | GodotAtlas;
  // @ts-ignore: typescript is weird
  bitmap: ImageBitmap;
  // @ts-ignore: typescript is weird
  image: HTMLImageElement;
  preloaded = false;
  constructor(
    atlasUrl: string,
    type: string = "phaser",
  ) {
    super(0, 0);
    // @ts-ignore: typescript is weird
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
      this.image.src = this.atlas.imgUrl;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        this.preloaded = true;
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
