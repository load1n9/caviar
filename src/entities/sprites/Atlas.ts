import { Entity } from "../mod.ts";
import { Frame } from "../../types.ts";
import {
  atlas,
  GodotAtlas,
  PhaserAtlas,
  PixiAtlas,
} from "./../../utils/mod.ts";
import { Image as HTMLImage } from "../../../deps.ts";

export class Atlas extends Entity {
  atlas: PhaserAtlas | PixiAtlas | GodotAtlas;
  image: HTMLImage;
  preloaded = false;
  constructor(
    atlasUrl: string,
    type: string = "phaser",
  ) {
    super(0, 0);
    this.image = new HTMLImage();
    this.atlas = atlas(`file:///${Deno.cwd()}/${atlasUrl}`, type);
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
        res(this);
      };
      this.image.onerror = rej;
    });
  }
}
