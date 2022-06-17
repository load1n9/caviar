import {
  PICO8,
  Scene,
  TextureSprite,
  World,
} from "https://deno.land/x/caviar@2.5.3/web/dist/mod.js";

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
    this.setBackground("#000000");
    this.addChild(this.test);
  }
}
const world = new World({ width: 600, height: 600 }, [Game]);
await world.start();
