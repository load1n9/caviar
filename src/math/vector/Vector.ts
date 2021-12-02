import type { IVector } from './types.ts';
import { VectorFromArray, VectorToArray} from './mod.ts';

export class Vector implements IVector {
    constructor (
        public x: number = 0,
        public y: number = 0
    ) {}

    public set(x = 0, y = 0): this {
        this.x = x;
        this.y = y;

        return this;
    }

    public toArray (dst: Float32Array = new Float32Array(), i = 0): Float32Array {
        return VectorToArray(this, dst, i);
    }

    public fromArray (src: Float32Array, i = 0): this {
        VectorFromArray(this, src, i);
        return this;
    }

    public toString (): string {
        return `{ x=${this.x}, y=${this.y} }`;
    }
}
