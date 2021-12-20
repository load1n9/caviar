import { World, Scene, Polygon, Point } from '../mod.ts';


class Game extends Scene {
    public test = new Polygon(100, 100, [
        new Point(40, 50),
        new Point(60, 30),
        new Point(80, 50),
        new Point(100, 70),
        new Point(80, 90),
        new Point(60, 110),
        new Point(40, 90),
        new Point(20, 70)
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