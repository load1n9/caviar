import { Entity } from '../mod.ts';
import { World } from '../../../mod.ts';



export class FrameBuffer extends Entity {
    public width: number;
    public height: number
    public rawData = new Uint8Array(0);
    public requestStart = true;
    constructor(
        world: World,
        buffer: Uint8Array,
        width?: number,
        height?: number,
    ) {
        super(0, 0);
        this.width = width || world.width;
        this.height = height || world.height;
        this.rawData = buffer;
    }

    public load() {
        return new Promise<FrameBuffer>((res, _rej) => {
            res(this);
        })
    }
    public setBuffer(buffer: Uint8Array) {
        this.rawData = buffer;
        this.requestStart = true;
    }
}