import { World, Scene, Animation, Atlas } from '../mod.ts';


class Game extends Scene {
    public test = new Atlas('assets/klutzy.json');
    public setup() {
        const test = new Animation(this, 45, 45, this.test, [
            'sprite1',
            'sprite2',
            'sprite3',
            'sprite4',
            'sprite5',
            'sprite6',
            'sprite7',
            'sprite8'
        ]);
        this.addChild(test);
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