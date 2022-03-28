import {
  PICO8,
  Rectangle,
  Scene,
  TextureSprite,
  World,
} from "../../dist/mod.js";
class Test extends Scene {
  test3 = new TextureSprite(this, 100, 100, {
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
    this.setKeys(["w", "a", "s", "d", "q"]);
    this.addChild([this.test3]);
  }
  update() {
    
  }
}
const world = new World({
  width: 800,
  height: 800,
}, [Test]);
await world.start();
