export abstract class Entity {
    public x: number;
    public y: number;
    public z: number | undefined;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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