import { Group, Rectangle, Scene, World } from "../mod.ts";
import { PerlinNoise } from "../src/plugins/Perlin.ts";

class Game extends Scene {
  chunkSize = 16;
  tileSize = 16;

  setup() {
    const group = new Group(this, 0, 0);
    this.world.loadPlugin("perlin", PerlinNoise);

    const perlin = this.world.usePlugin("perlin");
    perlin.setSeed(1000);

    for (let x = -40; x < this.chunkSize; x++) {
      for (let y = -40; y < this.chunkSize; y++) {
        const tileX = (1 * (this.chunkSize * this.tileSize)) +
          (x * this.tileSize);
        const tileY = (1 * (this.chunkSize * this.tileSize)) +
          (y * this.tileSize);
        const perlinValue = perlin.perlin2(tileX / 100, tileY / 100);
        if (perlinValue < 0.2) {
          group.addChild(
            new Rectangle(
              tileX,
              tileY,
              this.tileSize,
              this.tileSize,
              "#ff0000",
            ),
          );
        } else if (perlinValue >= 0.2 && perlinValue < 0.3) {
          group.addChild(
            new Rectangle(
              tileX,
              tileY,
              this.tileSize,
              this.tileSize,
              "#00ff00",
            ),
          );
        } else if (perlinValue >= 0.3) {
          group.addChild(
            new Rectangle(
              tileX,
              tileY,
              this.tileSize,
              this.tileSize,
              "#0000ff",
            ),
          );
        }
      }
    }
    this.addChild(group);
  }
}

const test = new World({
  title: "Perlin Noise Plugin Example",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
