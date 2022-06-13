import { Clock } from "./Clock.ts";
import type { TimerEvent } from "./types.ts";

const NOOP = () => {};
export const Timer = (
  clock: Clock,
  config: Partial<{
    duration: number;
    repeat: number;
    elapsed: number;
    delay: number;
    update: (delta: number) => boolean;
    onStart: () => void;
    onUpdate: (delta: number, progress: number) => void;
    onRepeat: (repeatCount: number) => void;
    onComplete: () => void;
  }>,
): void => {
  const {
    duration = 0,
    repeat = 0,
    delay = -1,
    onStart = NOOP,
    onUpdate = NOOP,
    onRepeat = NOOP,
    onComplete = NOOP,
  } = config;

  const timer: TimerEvent = {
    elapsed: duration,
    duration,
    repeat,
    delay,
    update: null,
    onStart,
    onUpdate,
    onRepeat,
    onComplete,
  };

  timer.update = (delta: number): boolean => {
    if (timer.delay > 0) {
      timer.delay -= delta;

      if (timer.delay < 0) {
        timer.delay = 0;
      } else {
        return false;
      }
    }

    if (timer.delay === 0) {
      timer.onStart();
      timer.delay = -1;
    }

    if (timer.delay === -1) {
      timer.elapsed -= delta;

      timer.onUpdate(delta, timer.elapsed / timer.duration);

      if (timer.elapsed <= 0) {
        if (timer.repeat > 0) {
          timer.repeat--;

          timer.elapsed = timer.duration;

          timer.onRepeat(timer.repeat);
        } else {
          timer.elapsed = 0;

          timer.onComplete();
        }
      }
    }

    return (timer.elapsed === 0);
  };

  clock.events.add(timer);
};
