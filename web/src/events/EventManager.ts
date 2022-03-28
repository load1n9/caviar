export type Event = string | unknown;

// deno-lint-ignore no-explicit-any
export type IEvent = string | any;
export type EventHandler<T extends IEvent = IEvent> = (data: T) => void;

export class EventManager {
  listeners: Map<string, Set<EventHandler>> = new Map();
  keys: Array<string> = [];

  on(event: string, listener: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);
  }

  off(event: string, listener: EventHandler): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(listener);
    }
  }
  emit(event: string, data: IEvent): void {
    if (this.listeners.has(event)) {
      for (const listener of this.listeners.get(event)!) {
        listener(data);
      }
    }
  }
  clear(): void {
    this.listeners.clear();
  }
}
