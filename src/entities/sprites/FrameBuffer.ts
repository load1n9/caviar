import { Entity } from "../mod.ts";
import { World } from "../../../mod.ts";

export class FrameBuffer extends Entity {
  width: number;
  height: number;
  rawData = new Uint8Array(0);
  requestStart = true;
  constructor(
    world: World,
    buffer: Uint8Array,
    width?: number,
    height?: number,
  ) {
    super(0, 0);
    this.width = width || world.width;
    this.height = height || world.height;
    this.rawData = buffer;
  }

  load() {
    return new Promise<FrameBuffer>((res, _rej) => {
      res(this);
    });
  }

  setBuffer(buffer: Uint8Array) {
    this.rawData = buffer;
    this.requestStart = true;
  }

  collides(x: number, y: number): boolean {
    return (x > 0 && x < this.width && y > 0 &&
      y < this.height);
  }
}
