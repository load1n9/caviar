const width = 800;
const height = 600;
const buffer = new Uint8Array(width * height * 4).fill(255, 300000, 600000);
    import { World, Scene, FrameBuffer} from '../mod.ts';


    class Game extends Scene {
        public test = new FrameBuffer(this.world, buffer);
        
        public setup() {
            this.addChild(this.test);
        }
    
    }
    
    const test = new World({
        title: "test",
        width: 800,
        height: 600,
        resizable: true,
    }, [Game]);
    
    await test.start();