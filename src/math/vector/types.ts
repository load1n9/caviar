export interface IVector{
    x: number;
    y: number;
    copy(src: IVector | IVectorLike): any;
    clone(): any;
    set(x: number, y: number): any;
    setToPolar(azimuth: number, radius?: number): any;
    equals(vector: IVector | IVectorLike): boolean;
    fuzzyEquals(vector: IVector | IVectorLike, epsilon: number): boolean;
    angle(): number;
    setAngle(angle: number): any;
    add(vector: IVector | IVectorLike): any;
    subtract(vector: IVector | IVectorLike): any;
    multiply(vector: IVector | IVectorLike): any;
    divide(vector: IVector | IVectorLike): any;
    negate(): any;
    distance(vector: IVector | IVectorLike): number;
    distanceSq(vector: IVector | IVectorLike): number;
    length(): number;
    setLength(length: number): any;
    lengthSq(): number;
    normalize(): any;
    normalizeRightHand(): any;
    normalizeLeftHand(): any;
    dot(vector: IVector | IVectorLike): number;
    cross(vector: IVector | IVectorLike): number;
    lerp(vector: IVector | IVectorLike, alpha: number): any;
    reset(): any;
    limit(max: number): any;
    reflect(vector: IVector | IVectorLike): any;
    mirror(axis: IVector | IVectorLike) : any;
    rotate(delta: number): any;

}

export interface IVectorLike { 
    x: number;
    y: number;
}