import {
  // Atlas,
  //   AtlasSprite,
  Image,
  //   PICO8,
  Rectangle,
  Scene,
  //   TextureSprite,
  World,
} from "../../mod.ts";
class Test extends Scene {
  //   public crabAtlas = new Atlas('./klutzy.json', 'phaser');
  //   public crab = new AtlasSprite(this.crabAtlas, 100, 100, "sprite1");
  public rect = new Rectangle(0, 0, 100, 100, "#00ff00");
  public img = new Image("./deno_logo.png", 0, 100);

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
  public setup() {
    this.setBackground("#000000");
    this.setKeys(["w", "a", "s", "d"]);
    this.addChild([this.rect, this.img]);
  }
  public update() {
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
