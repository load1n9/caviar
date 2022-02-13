import { World, Scene, Image, Keys, KeyEvent } from '../mod.ts';


class Game extends Scene {
    public test = new Image("assets/caviar.png", 0, 0);
    
    public setup() {
        this.addChild(this.test);
    }
    public update() {
        
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