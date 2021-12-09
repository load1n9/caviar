import { World, Scene, Rectangle } from '../mod.ts';


class Game extends Scene {
    public test = new Rectangle(100, 100, 100, 100, "#00ff00");
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        this.test.setX(this.test.x + 5);
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