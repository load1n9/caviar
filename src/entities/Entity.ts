export abstract class Entity {
    public x: number;
    public y: number;
    public z: number | undefined;
    public width: number | undefined;
    public height: number | undefined;

    constructor(x: number, y: number, width?: number, height?: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    public setX(pos:number) {
        this.x = pos;
    }
    public setY(pos:number) {
        this.y = pos;
    }
    public setZ(pos: number) {
        this.z = pos;
    }
    public setPosition(x:number, y:number, z?:number) {
        this.setX(x);
        this.setY(y); 
        if (z) this.setZ(z);
    }
}