import { World, Scene, Image, Keys, KeyEvent } from '../mod.ts';


class Game extends Scene {
    public test = new Image("assets/caviar.png", 0, 0);
    public test2 = new Image("assets/caviar.png", 0, 0, {x: 100, y: 50, width: 200, height: 100});
    
    public setup() {
        // this.addChild(this.test);
        this.addChild(this.test2);
    }
    public update() {
        
    }
    public keyDown(key: KeyEvent) {
        switch (key.keycode) {
            case Keys.ARROWUP: {
                this.test.setY(this.test.y - 10);
                break;
            }
            case Keys.ARROWDOWN: {
                this.test.setY(this.test.y + 10);
                break;
            }
            case Keys.ARROWLEFT: {
                this.test.setX(this.test.x - 10);
                break;
            }
            case Keys.ARROWRIGHT: {
                this.test.setX(this.test.x + 10);
                break;
            }

        }
    }

}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    resizable: true,
}, [Game]);

await test.start();