import { World, Scene, Rectangle } from "../../mod.ts";
class Test extends Scene {
    public test = new Rectangle(0, 0, 100, 100, "#00ff00");
    public test2 = new Rectangle(100, 0, 100, 100, "#ff0000");
    
    public setup() {
        this.addChild([this.test, this.test2]);
    }
    public update() {
        this.test2.x += 1;
    }
}
const world = new World({
    width: 800,
    height: 600,
}, [Test]);
await world.start();