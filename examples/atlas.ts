import { World, Scene, AtlasSprite, Atlas } from '../mod.ts';


class Game extends Scene {
    public test = new Atlas('assets/pixi.json', 'pixi');
    public setup() {
        const test = new AtlasSprite(this.test, 0, 0, 'skully.png');
        this.addChild(test);
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