import { Atlas, AtlasSprite, Scene, World } from "../mod.ts";

class Game extends Scene {
  test = new Atlas("assets/godot.json", "godot");
  override setup() {
    this.addChild(new AtlasSprite(this.test, 0, 0, "sprite1"));
  }
}

const test = new World({
  title: "Godot Atlas Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
