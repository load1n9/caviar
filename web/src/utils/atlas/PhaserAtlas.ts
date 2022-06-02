import { Frame } from "../../types.ts";

interface IPhaserFrame {
  filename: string;
  rotated: boolean;
  trimmed: boolean;
  sourceSize: {
    w: number;
    h: number;
  };
  spriteSourceSize: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
interface IPhaserAtlas {
  textures: [{
    image: string;
    format: string;
    size: {
      w: number;
      h: number;
    };
    scale: number;
    frames: Array<IPhaserFrame>;
  }];
  meta: {
    app: string;
    version: string;
    smartupdate: string;
  };
}
export class PhaserAtlas {
  public frames: { [key: string]: Frame } = {};
  public width: number;
  public height: number;
  public imgUrl: string;
  constructor(data: IPhaserAtlas) {
    this.width = data.textures[0].size.w;
    this.height = data.textures[0].size.h;
    this.imgUrl = data.textures[0].image;
    for (const frame of data.textures[0].frames) {
      this.frames[frame.filename] = {
        x: frame.frame.x,
        y: frame.frame.y,
        width: frame.frame.w,
        height: frame.frame.h,
      };
    }
  }
}
