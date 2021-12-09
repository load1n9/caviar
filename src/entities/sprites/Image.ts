import { Entity } from '../mod.ts';
import { Scene } from '../../../mod.ts';
export class Image extends Entity {
    public width: number;
    public height: number
    public surface: any;
    public texture: any;
    constructor(scene: Scene, texture: string, x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.surface = scene.world.loadSurface(texture);
        this.texture = scene.world.createTextureFromSurface(this.surface);
    }
}