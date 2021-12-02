export interface IVector{
    x: number;
    y: number;
    set (x?: number, y?: number): this;
}

export interface IVectorLike { 
    x: number;
    y: number;
}