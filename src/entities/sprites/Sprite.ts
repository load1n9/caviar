import { Entity } from '../mod.ts';
import { spriteConfig, Frame } from '../../types.ts';
import { generateFrames } from "../../utils/mod.ts";
import { Image as HTMLImage } from '../../../deno_gl/mod.ts';

export class Sprite extends Entity {
    public width: number;
    public height: number;
    public image: HTMLImage;
    public url: string;
    public rows: number;
    public cols: number;
    // deno-lint-ignore no-explicit-any
    public frames: Array<Frame> | any;
    // deno-lint-ignore no-explicit-any
    public frame: Frame | any;
    private _frame: number;
    constructor(
        url: string,
        x: number,
        y: number,
        { rows, cols, }: spriteConfig,
        _frame: number = 0,
    ) {
        super(x, y);
        this.image = new HTMLImage;
        this.url = `file:///${Deno.cwd()}/${url}`;
        this.width = 0;
        this.height = 0;
        this.rows = rows;
        this.cols = cols;
        this._frame = _frame;
    }
    public load(): Promise<Sprite> {
        return new Promise<Sprite>((res, rej) => {
            this.image.src = this.url
            this.image.onload = () => {
                this.width = this.image.width;
                this.height = this.image.height;
                this.frames = generateFrames(this.width, this.height, this.rows, this.cols);
                this.frame = this.frames[this._frame];
                res(this)
            }
            this.image.onerror = rej
        })
    }

    public nextFrame(): void {
        this.frame = this.frames[(this.frames.indexOf(this.frame) + 1) % this.frames.length];
    }
    public previousFrame(): void {
        this.frame = this.frames[(this.frames.indexOf(this.frame) - 1 + this.frames.length) % this.frames.length];
    }
    public setFrame(frame: number): void {
        this.frame = this.frames[frame];
    }

}