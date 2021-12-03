import { World, Sprite, Keys, KeyEvent } from '../mod.ts';


class Game extends World {
    public test = new Sprite(this, "assets/caviar.png", 200, 100, 414, 197);
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        
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