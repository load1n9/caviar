import { Scene, Sprite, World } from "../mod.ts";

class Game extends Scene {
  FPS = 5;
  test = new Sprite("assets/sample2.png", 0, 0, { rows: 1, cols: 4 }, 1);

  setup() {
    this.addChild(this.test);
  }
  update(): void {
      this.test.nextFrame();
      this.world.reRender = true;
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
