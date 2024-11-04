import { Timer } from "./Timer.ts";
import type { Clock } from "./Clock.ts";

export const DelayedCall = (
  clock: Clock,
  delay: number,
  callback: () => void,
): void => {
  Timer(clock, {
    duration: 0,
    delay,
    onComplete: callback,
  });
};
