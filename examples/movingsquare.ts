import { World, Scene, Rectangle } from '../mod.ts';


class Game extends Scene {
    public test = new Rectangle(0, 0, 100, 100, "#00ff00");
    public test2 = new Rectangle(0, 0, 100, 100, "#00ff00");
    
    public setup() {
        this.addChild(this.test);
        this.addChild(this.test2);
    }
    public update() {
        this.test.setX(this.test.x + 5);
        this.test2.setX(this.test2.x + 2);
    }

}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    // centered: true,
    // fullscreen: false,
    // hidden: false,
    resizable: true,
    // minimized: false,
    // maximized: false,
    // flags: null,
}, [Game]);

await test.start();