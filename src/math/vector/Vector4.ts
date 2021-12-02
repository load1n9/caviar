export class Vector4 {
    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 1
    ){}

    public set(x = 0, y = 0, z = 0, w = 1): this {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    public toArray(dst: Float32Array = new Float32Array(), i = 0): Float32Array {
        const { x, y, z,w } = this;

        dst[ i ] = x;
        dst[i + 1] = y;
        dst[i + 2] = z;
        dst[i + 3] = w;

        return dst;
    }

    public fromArray(src: Float32Array, i = 0): this {
        return this.set(
            src[i],
            src[i + 1],
            src[i + 2],
            src[i + 3] 
        );
    }

    public toString(): string {
        const { x, y, z, w } = this;
        return `{ x=${x}, y=${y}, z=${z}, w=${w} }`;
    }
}