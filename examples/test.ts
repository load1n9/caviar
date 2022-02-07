import { World, Scene } from '../mod.ts';


class Game extends Scene {

    public setup() {
        
    }
    public draw() {
        
    }

}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
}, [Game]);

await test.start();