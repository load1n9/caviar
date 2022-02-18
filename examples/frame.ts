const width = 800;
const height = 600;
const buffer = new Uint8Array(width * height * 4);
import { FrameBuffer, Scene, World } from "../mod.ts";

class Game extends Scene {
  public test = new FrameBuffer(this.world, buffer);

  public setup() {
    this.setKeys(['a']);
    this.addChild(this.test);
  }
  // deno-lint-ignore no-explicit-any
  public keyDown(_key: any) {
    this.test.rawData = this.test.rawData.fill(Math.floor(Math.random() * 255), 300000, 1200000)
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
