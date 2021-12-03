import { World, Sprite } from '../mod.ts';


class Game extends World {
    public test = new Sprite(this, "assets/sample.png", 200, 100, 307, 127,{rows:1,cols:4});
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        this.test.nextFrame();
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