import { Canvas } from "../deps.ts";
import { Entity, Rectangle, Line, Point } from "../mod.ts";
import { WorldOptions } from './types.ts';


export abstract class World extends Canvas {
    public entities: Array<Entity | Rectangle> = [];
    public params: WorldOptions;
    constructor(params: WorldOptions) {
        super(params);
        this.params = params;
    }

    public async start() {
        this.setup();
        for await (const event of this) {
            switch (event.type) {
                case "draw":
                    this._draw()
                    break;
                case "quit":
                    this.quit();
                    break;
                case "key_down":
                    this.keyDown(event);
                    break;
                default:
                    break;
            }
        }
    }
    public addChild(e: Entity) {
        this.entities.push(e);
    }
    private _draw() {
        this.setDrawColor(0, 0, 0, 255);
        this.clear();
        for (const entity of this.entities) {
            if (entity instanceof Rectangle) {
                this.setDrawColor(entity.fill[0], entity.fill[1], entity.fill[2], entity.fill[3]);
                this.fillRect(entity.x, entity.y, entity.width, entity.height);
            } else if (entity instanceof Line) {
                this.drawLine(entity.p1, entity.p2);
            }


        }
        this.draw();
        this.present();
        Deno.sleepSync(10);

    }
    public keyDown(event: any): void {
        return;
    }
    public abstract setup(): void;
    public abstract draw(): void;
}

