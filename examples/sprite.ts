import { World, Scene, Sprite } from 'https://deno.land/x/caviar@1.1.5/mod.ts';


class Game extends Scene {
    public FPS = 5;
    public test = new Sprite(this, "assets/sample.png", 200, 100, 307, 127,{rows:1,cols:4});
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        this.test.nextFrame();
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