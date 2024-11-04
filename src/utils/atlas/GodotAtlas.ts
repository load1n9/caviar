import type { Frame } from "../../types.ts";
interface IGodotFrame {
  filename: string;
  region: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  margin: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
interface IGodotAtlas {
  textures: [{
    image: string;
    size: {
      w: number;
      h: number;
    };
    sprites: Array<IGodotFrame>;
  }];
  meta: {
    app: string;
    version: string;
    smartupdate: string;
  };
}
export class GodotAtlas {
  frames: { [key: string]: Frame } = {};
  width: number;
  height: number;
  imgUrl: string;
  constructor(data: IGodotAtlas) {
    this.width = data.textures[0].size.w;
    this.height = data.textures[0].size.h;
    this.imgUrl = `file:///${Deno.cwd()}/${data.textures[0].image}`;
    for (const frame of data.textures[0].sprites) {
      this.frames[frame.filename] = {
        x: frame.region.x,
        y: frame.region.y,
        width: frame.region.w,
        height: frame.region.h,
      };
    }
  }
}
