import { World, Scene, AtlasSprite, Atlas } from '../mod.ts';


class Game extends Scene {
    public test = new Atlas('assets/pixi.json');
    public setup() {
        const test = new AtlasSprite(this, 45, 45, this.test, 'skully.png');
        this.addChild(test);
    }
    public draw() {
        
    }
}

const test = new World ({
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