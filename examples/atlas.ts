import { Atlas, AtlasSprite, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Atlas("assets/pixi.json", "pixi");
  setup() {
    const test = new AtlasSprite(this.test, 0, 0, "skully.png");
    this.addChild(test);
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
