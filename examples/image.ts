import { World, Scene, Image, Keys, KeyEvent } from '../mod.ts';


class Game extends Scene {
    public test = new Image("assets/caviar.png", 0, 0);
    
    public setup() {
        this.addChild(this.test);
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