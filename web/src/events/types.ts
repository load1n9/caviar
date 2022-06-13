export interface TimerEvent {
  duration: number;
  repeat: number;
  elapsed: number;
  delay: number;
  update: ((delta: number) => boolean) | null;
  onStart: () => void;
  onUpdate: (delta: number, progress: number) => void;
  onRepeat: (repeatCount: number) => void;
  onComplete: () => void;
}
