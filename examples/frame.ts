import { FrameBuffer, Scene, World } from "../mod.ts";

const width = 800;
const height = 600;
const buffer = new Uint8Array(width * height * 4);

class Game extends Scene {
  test = new FrameBuffer(this.world, buffer);

  override setup() {
    this.addChild(this.test);
  }
  override update() {
    this.test
      .rawData[Math.floor(Math.random() * this.test.rawData.length - 1)] = Math
        .floor(Math.random() * 255);
    this.test.setBuffer(this.test.rawData);
  }
}

const test = new World({
  title: "Frame Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);
test.setFPS(10);
await test.start();
