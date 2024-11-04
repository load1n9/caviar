import { Entity } from "../mod.ts";
import type { Frame, spriteConfig } from "../../types.ts";
import { generateFrames } from "../../utils/mod.ts";
import { Image as HTMLImage } from "../../../deps.ts";

export class Sprite extends Entity {
  override width: number;
  override height: number;
  image: HTMLImage;
  url: string;
  rows: number;
  cols: number;
  frames: Array<Frame> = [];
  frame: Frame = { x: 0, y: 0, width: 0, height: 0 };

  #frame: number;
  constructor(
    url: string,
    x: number,
    y: number,
    { rows, cols }: spriteConfig,
    frame = 0,
  ) {
    super(x, y);
    this.image = new HTMLImage();
    this.url = `file:///${Deno.cwd()}/${url}`;
    this.width = 0;
    this.height = 0;
    this.rows = rows;
    this.cols = cols;
    this.#frame = frame;
  }

  load(): Promise<Sprite> {
    return new Promise<Sprite>((res, rej) => {
      this.image.src = this.url;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        this.frames = generateFrames(
          this.width,
          this.height,
          this.rows,
          this.cols,
        );
        this.frame = this.frames[this.#frame];
        res(this);
      };
      this.image.onerror = rej;
    });
  }

  nextFrame(): void {
    this.frame =
      this.frames[(this.frames.indexOf(this.frame) + 1) % this.frames.length];
  }

  previousFrame(): void {
    this.frame = this
      .frames[
        (this.frames.indexOf(this.frame) - 1 + this.frames.length) %
        this.frames.length
      ];
  }

  setFrame(frame: number): void {
    this.frame = this.frames[frame];
  }

  override collides(x: number, y: number): boolean {
    return (x > this.x && x < this.x + this.frame.width && y > this.y &&
      y < this.y + this.frame.height);
  }
}
