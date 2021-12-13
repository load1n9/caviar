import { World, Scene, Group, Rectangle } from '../mod.ts';
import { PerlinNoise } from "../src/utils/mod.ts";

class Game extends Scene {
    public test: any;
    public chunkSize = 16;
    public tileSize = 16;
    public group: Group | undefined;
    
    public setup() {
        this.group = new Group(this, 0,0);
        this.world.loadPlugin('perlin', PerlinNoise);

        this.test = this.world.usePlugin('perlin');
        this.test.setSeed(0);

        for (let x = 0; x < this.chunkSize; x++) {
            for (let y = 0; y < this.chunkSize; y++) {
                const tileX = (1 * (this.chunkSize * this.tileSize)) + (x * this.tileSize);
                const tileY = (1 * (this.chunkSize * this.tileSize)) + (y * this.tileSize);
                const perlinValue = this.test.perlin2(tileX / 100, tileY / 100);
                if (perlinValue < 0.2) {
                    this.group.addChild(new Rectangle(tileX, tileY, this.tileSize, this.tileSize, '#ff0000'));
                }
                else if (perlinValue >= 0.2 && perlinValue < 0.3) {
                    this.group.addChild(new Rectangle(tileX, tileY, this.tileSize, this.tileSize, '#00ff00'));
                }
                else if (perlinValue >= 0.3) {
                    this.group.addChild(new Rectangle(tileX, tileY, this.tileSize, this.tileSize, '#0000ff'));
                }
            }
        }
        this.addChild(this.group);
    }
    public draw() {
        
    }
}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    centered: true,
    fullscreen: false,
    hidden: false,
    resizable: true,
    minimized: false,
    maximized: false,
    flags: null,
}, [Game]);

await test.start();
