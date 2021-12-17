import { World, PhysicsScene, PhysicsRectangle } from '../mod.ts';


class Game extends PhysicsScene {
    public test: any;
    public setup() {
        this.test = new PhysicsRectangle(this, 400, 200, 100, 100, "#00ff00");
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