import { World, Scene, ParticleSystem } from '../mod.ts';


class Game extends Scene {
    public test = new ParticleSystem(this, {
        density: 10,
        particleSize: 10,
        startingX: 30,
        startingY: 30,
        gravity: 0.25,
        maxLife: 100,
    });
    
    public setup() {
        this.addChild(this.test);
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