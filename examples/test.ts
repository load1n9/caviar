import { World, PhysicsScene } from '../mod.ts';


class Game extends PhysicsScene {

    public setup() {
        
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