import { World, Scene, Sprite } from '../mod.ts';


class Game extends Scene {
    public FPS = 5;
    public test = new Sprite("assets/sample.png", 0, 0, {rows:1,cols:4}, 1);
    
    public setup() {
        this.setKeys(['a','b'])
        this.addChild(this.test);
    }
    public keyDown(key: any) {
        console.log(key)
    }
}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    resizable: true,
}, [Game]);

await test.start();