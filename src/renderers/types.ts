import { Entity } from "../../mod.ts";

export interface Renderer {
    start(entities: Entity[]): void
    render(entities: Entity[]): void
}

export enum Context {
    Context2D,
    Context3D
}