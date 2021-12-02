export class Vector3 {
    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ){}

    public set (x = 0, y = 0, z = 0): this {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    public toArray (dst: Float32Array = new Float32Array(), i = 0): Float32Array {
        const { x, y, z } = this;

        dst[i] = x;
        dst[i + 1] = y;
        dst[i + 2] = z;
        return dst;
    }

    public fromArray (src: Float32Array, i = 0): this {
        return this.set(
            src[i],
            src[i + 1],
            src[i + 2]
        );
    }

    public toString (): string {
        const { x, y, z } = this;
        return `{ x=${x}, y=${y}, z=${z} }`;
    }
}