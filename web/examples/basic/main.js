import {
  // Atlas,
  //   AtlasSprite,
  Image,
  //   PICO8,
  Rectangle,
  Scene,
  //   TextureSprite,
  World,
} from "../../dist/mod.js";
class Test extends Scene {
  rect = new Rectangle(0, 0, 100, 100, "#00ff00");
  img = new Image("./deno_logo.png", 0, 100);

  //   public test3 = new TextureSprite(this, 100, 100, {
  //     data: [
  //       "..9..9..",
  //       "..9999..",
  //       ".AAAAAA.",
  //       ".A1F1FA.",
  //       ".AFFFFA.",
  //       ".FEEEEAA",
  //       ".EEEEEEA",
  //       "..E..E..",
  //     ],
  //     pixelWidth: 32,
  //     pixelHeight: 32,
  //     palette: PICO8,
  //   });
  setup() {
    this.setBackground("#000000");
    this.setKeys(["w", "a", "s", "d", "q"]);
    this.addChild([this.rect, this.img]);
  }
  update() {
    if (this.keyDown("q")) {
      this.addChild(new Rectangle(this.rect.x, this.rect.y, 100,100, "#00ff00"));
    }
    if (this.keyDown("w")) {
      this.rect.y -= 10;
    }
    if (this.keyDown("a")) {
      this.rect.x -= 10;
    }
    if (this.keyDown("s")) {
      this.rect.y += 10;
    }
    if (this.keyDown("d")) {
      this.rect.x += 10;
    }
  }
}
const world = new World({
  width: 800,
  height: 800,
}, [Test]);
await world.start();
