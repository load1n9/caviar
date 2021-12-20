import { World, Scene, Polygon, Point } from '../mod.ts';


class Game extends Scene {
    public test = new Polygon(300, 300, [
        new Point(40, 50),
        new Point(80, 90),
        new Point(80, 130),
        new Point(120, 130)
    ], "#00ff00");
    
    public setup() {
        this.addChild(this.test);
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