import { PICO8, Scene, TextureSprite, World } from "../mod.ts";

class Game extends Scene {
  test = new TextureSprite(this, 0, 0, {
    data: [
      "..9..9..",
      "..9999..",
      ".AAAAAA.",
      ".A1F1FA.",
      ".AFFFFA.",
      ".FEEEEAA",
      ".EEEEEEA",
      "..E..E..",
    ],
    pixelWidth: 32,
    pixelHeight: 32,
    palette: PICO8,
  });

  setup() {
    this.addChild(this.test);
  }
  update() {
    this.test.setX(this.test.x + 10);
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
