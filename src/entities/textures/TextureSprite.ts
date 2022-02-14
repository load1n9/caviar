import { Entity } from "../mod.ts";
import { hexToRGBA, Rectangle, Scene } from "../../../mod.ts";
import { PixelTexture } from "../../types.ts";
import { Arne16 } from "./palettes/mod.ts";
export class TextureSprite extends Entity {
  public data: Rectangle[];
  public texture: PixelTexture;
  public palette: string[];
  public pixelWidth: number;
  public pixelHeight: number;
  public width: number;
  public height: number;
  constructor(_scene: Scene, x: number, y: number, texture: PixelTexture) {
    super(x, y);
    this.texture = texture;
    this.data = [];
    this.palette = texture.palette || Arne16,
      this.pixelWidth = texture.pixelWidth || 1;
    this.pixelHeight = texture.pixelHeight || this.pixelWidth;
    this.width = Math.floor(
      Math.abs(this.texture.data[0].length * this.pixelWidth),
    );
    this.height = Math.floor(
      Math.abs(this.texture.data.length * this.pixelHeight),
    );
    this.setup();
  }
  public setup() {
    this.data = [];
    for (let y = 0; y < this.texture.data.length; y++) {
      const row = this.texture.data[y];
      for (let x = 0; x < row.length; x++) {
        const d: string = row[x];
        if (d !== "." && d !== " ") {
          this.data.push(
            new Rectangle(
              // x position
              (x * this.pixelWidth) + this.x,
              // y position
              (y * this.pixelHeight) + this.y,
              // width
              this.pixelWidth,
              // height
              this.pixelHeight,
              // fill color
              hexToRGBA(this.palette[parseInt("0x" + d.toUpperCase())]),
            ),
          );
        }
      }
    }
  }

  public setX(x: number) {
    this.x = x;
    let k = 0;
    for (let j = 0; j < this.texture.data.length; j++) {
      const row = this.texture.data[j];
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== "." && row[i] !== " ") {
          const pixel = this.data[k];
          pixel.x = (i * this.pixelWidth) + this.x;
          k += 1;
        }
      }
    }
  }
  public setY(y: number) {
    this.y = y;
    let k = 0;
    for (let j = 0; j < this.texture.data.length; j++) {
      const row = this.texture.data[j];
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== "." && row[i] !== " ") {
          const pixel = this.data[k];
          pixel.y = (j * this.pixelWidth) + this.y;
          k += 1;
        }
      }
    }
  }
}
