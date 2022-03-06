import { Scene, World, Rectangle } from "https://deno.land/x/caviar@2.3.4/web/dist/mod.js";
class Game extends Scene {
    test = new Rectangle(0, 0, 100, 100, "#00ff00");
    test2 = new Rectangle(0, 0, 100, 100, "#ff0000");
    setup() {
        this.setBackground("#000000");
        this.addChild([this.test, this.test2]);
    }
    update() {
        this.test.x += 5;
        this.test2.x += 2;
    }
}
const world = new World({ width: 600, height: 600 }, [Game]);
await world.start();