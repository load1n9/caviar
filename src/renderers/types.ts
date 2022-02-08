import { Entity } from "../../mod.ts";

export interface Renderer {
    render(entities: Entity[]): void
}

export enum Context {
    Context2D,
    Context3D
}