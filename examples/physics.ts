import { World, PhysicsScene, PhysicsRectangle, Keys, KeyEvent } from '../mod.ts';


class Game extends PhysicsScene {
    public rect: any;
    public ground: any;
    public setup() {
        this.rect = new PhysicsRectangle(this, 400, 200, 100, 100, "#00ff00");
        this.ground = new PhysicsRectangle(this, 0, 500, 2000, 100, "#ff0000", { isStatic: true }); 

        this.addChild(this.rect);
        this.addChild(this.ground);

    }
    public keyDown(key: KeyEvent) {
        switch (key.keycode) {
            case Keys.ARROWLEFT: {
                this.rect.applyForce({x: -0.02, y: 0});
                break;
            }
            case Keys.ARROWRIGHT: {
                this.rect.applyForce({x: 0.02, y: 0});
                break;
            }

        }
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