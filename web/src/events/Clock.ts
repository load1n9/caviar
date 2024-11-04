import type { World } from "../World.ts";
import type { TimerEvent } from "./types.ts";
export class Clock {
  now?: number;
  timeScale = 1;

  events: Set<TimerEvent> = new Set();

  constructor(public world: World) {}

  update(delta: number, time: number): void {
    this.now = time;
    delta *= this.timeScale;
    this.events.forEach((event) => {
      if (event.update!(delta)) {
        this.events.delete(event);
      }
    });
  }
}
