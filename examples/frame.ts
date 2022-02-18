const width = 800;
const height = 600;
const buffer = new Uint8Array(width * height * 4);
import { FrameBuffer, Scene, World } from "../mod.ts";

class Game extends Scene {
  public test = new FrameBuffer(this.world, buffer);

  public setup() {
    this.addChild(this.test);
  }
  public update() {
    this.test.rawData[Math.floor(Math.random()* this.test.rawData.length-1)] = Math.floor(Math.random()*255)
    this.test.setBuffer(this.test.rawData);
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);
test.setFPS(10)
await test.start();
