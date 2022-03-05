import { World, Scene, Rectangle, Image } from "../../mod.ts";
class Test extends Scene {
    public test = new Rectangle(0, 0, 100, 100, "#00ff00");
    public test2 = new Image("./deno_logo.png", 0, 100);
    
    public setup() {
        this.addChild([this.test2]);
        this.addChild([this.test]);
    }
    public update() {
    }
}
const world = new World({
    width: 800,
    height: 600,
}, [Test]);
await world.start();