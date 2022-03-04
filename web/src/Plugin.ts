import { World } from "./World.ts";

export abstract class Plugin {
    public name = "";
    public description = "";
    public version = "";
    public author = "";
    constructor(_world: World) {}
    public onStart(): void {}
}