import { Atlas, AtlasSprite, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Atlas("assets/godot.json", "godot");
  setup() {
    this.setBackground([0, 0, 0, 0]);
    this.addChild(new AtlasSprite(this.test, 0, 0, "sprite1"));
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: false,
  transparent: true,
  removeDecorations: true,
  floating: true,
}, [Game]);

await test.start();
