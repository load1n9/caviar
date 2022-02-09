export abstract class Entity {
    public id: string;
    public x: number;
    public y: number;
    public z: number | undefined;
    public width = 0;
    public height = 0;

    constructor(x: number, y: number) {
        this.id = crypto.randomUUID();
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