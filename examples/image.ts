import { World, Scene, Image } from '../mod.ts';


class Game extends Scene {
    public test = new Image("assets/caviar.png", 0, 0);
    
    public setup() {
        this.addChild(this.test);
    }
    public update() {
        this.test.x += 1;
    }
    public keyDown(key: any) {
        console.log(key)
    }

}

const test = new World({
    title: "test",
    width: 1800,
    height: 1600,
    resizable: true,
}, [Game]);

await test.start();