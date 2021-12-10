import { World, Scene, Image, Button} from '../mod.ts';


class Game extends Scene {
    public test = new Button(this, new Image(this, "assets/caviar.png", 200, 100, 414, 197));
    
    public setup() {
        this.addChild(this.test);
        this.test.onClick = () => {
            this.test.setX(Math.round(Math.random() * this.world.params.width));
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