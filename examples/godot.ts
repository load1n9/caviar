import { World, Scene, AtlasSprite, Atlas } from '../mod.ts';


class Game extends Scene {
    public test = new Atlas('assets/godot.json', 'godot');
    public setup() {
        const _test = new AtlasSprite(this.test, 0, 0, 'sprite1');
        this.addChild(_test);
    }
    public draw() {
        
    }
}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    resizable: true,
}, [Game]);

await test.start();