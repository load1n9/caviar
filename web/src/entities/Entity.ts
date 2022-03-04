export abstract class Entity {
    public id: string;
    #x: number;
    #y: number;
    #z: number;
    public width = 0;
    public height = 0;

    constructor(x: number, y: number) {
        // deno-lint-ignore no-explicit-any
        this.id = (crypto as any).randomUUID();
        this.#x = x;
        this.#y = y;
        this.#z = 1;
    }
    public set x(x:number) {
        this.#x = x;
    }
    public get x(): number {
        return this.#x;
    }
    public set y(y:number) {
        this.#y = y;
    }
    public get y() {
        return this.#y;
    }
    public set z(z: number) {
        this.#z = z;
    }
    public get z(): number {
        return this.#z;
    }
    
    public setPosition(x:number, y:number, z?:number) {
        this.#x = x;
        this.#y = y; 
        if (z) this.#z = z;
    }
}