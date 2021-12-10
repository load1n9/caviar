import { World } from "../mod.ts";
export class Plugin {
    public name = "";
    public description = "";
    public version = "";
    public author = "";
    constructor(public world: World) {}
}