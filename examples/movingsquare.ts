import { World, Rectangle } from '../mod.ts';


class Game extends World {
    public test = new Rectangle(100, 100, 100, 100, "#00ff00");
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        this.test.setX(this.test.x + 5);
    }

}

const test = new Game({
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
});

await test.start();