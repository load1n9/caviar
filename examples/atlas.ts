import { Atlas, AtlasSprite, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Atlas("assets/pixi.json", "pixi");
  setup() {
    this.addChild(new AtlasSprite(this.test, 0, 0, "skully.png"));
  }
}

const test = new World({
  title: "Atlas Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
