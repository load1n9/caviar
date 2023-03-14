import { Rectangle, RGBA, Scene, World } from "../mod.ts";

class Custom extends Rectangle {
  constructor(x: number, y: number, fill: RGBA | string) {
    super(x, y, 100, 100, fill);
    this.setInteractive(true);
  }

  onClick() {
    console.log("onClick");
  }
}

class Game extends Scene {
  test = new Custom(0, 0, "#00ff00");
  test2 = new Custom(0, 0, "#ff0000");

  setup() {
    this.addChild([this.test, this.test2]);
  }
  update() {
    this.test.x += 5;
    this.test2.x += 2;
  }
}

const test = new World({
  title: "Onclick Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
