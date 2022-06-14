import { Scene, Sprite, World } from "../mod.ts";

class Game extends Scene {
  FPS = 5;
  test = new Sprite("assets/sample.png", 0, 0, { rows: 1, cols: 4 }, 1);

  setup() {
    this.setKeys(["a", "b"]);
    this.addChild(this.test);
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
