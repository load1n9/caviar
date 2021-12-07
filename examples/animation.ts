import { World, Animation, Atlas } from '../mod.ts';


class Game extends World {
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