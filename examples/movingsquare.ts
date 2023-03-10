import { Rectangle, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Rectangle(0, 0, 100, 100, "#00ff00");
  test2 = new Rectangle(0, 0, 100, 100, "#ff0000");

  setup() {
    this.addChild([this.test, this.test2]);
  }
  update() {
    this.test.x += 5;
    this.test2.x += 2;
  }
}

const test = new World({
  title: "Moving Square Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
