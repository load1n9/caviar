import { Image, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Image("assets/caviar.png", 0, 0);

  setup() {
    this.addChild(this.test);
  }
  update() {
    this.test.x += 1;
  }
}

const test = new World({
  title: "test",
  width: 1800,
  height: 1600,
  resizable: true,
}, [Game]);

await test.start();
