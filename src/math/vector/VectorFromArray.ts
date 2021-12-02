import type { IVector } from './types.ts';

export const VectorFromArray = (dst: IVector, src = new Float32Array(), i = 0): IVector =>
    dst.set(
        src[i],
        src[i + 1]
    );
