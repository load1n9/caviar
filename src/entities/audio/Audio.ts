import { Entity } from "../mod.ts";

export class Audio extends Entity {
  playing = false;
  constructor(public src: string) {
    super(0, 0);
  }
}
