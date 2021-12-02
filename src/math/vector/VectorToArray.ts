import type { IVectorLike } from './types.ts';

export const VectorToArray = (v: IVectorLike, dst = new Float32Array(), i = 0): Float32Array =>{
    dst[i] = v.x;
    dst[i+1] = v.y;
    return dst;
}