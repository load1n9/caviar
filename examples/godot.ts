import { World, AtlasSprite, Atlas } from '../mod.ts';


class Game extends World {
    public test = new Atlas('assets/godot.json');
    public setup() {
        const test = new AtlasSprite(this, 45, 45, this.test, 'sprite1');
        this.addChild(test);
    }
    public draw() {
        
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