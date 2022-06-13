import { Timer } from "./Timer.ts";
import { Clock } from "./Clock.ts";

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
