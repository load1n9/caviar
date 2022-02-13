export type Event = string | unknown

export type EventHandler<T extends Event = Event> = (data: T) => void;

export class EventManager {
    public listeners: Map<string, Set<EventHandler>> = new Map();
    public keys: Array<string> = [];
    
    public on(event: string, listener: EventHandler): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(listener);
    }
    
    public off(event: string, listener: EventHandler): void {
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.delete(listener);
        }
    }
    public emit(event: string, data: Event): void {
        if (this.listeners.has(event)) {
            for (const listener of this.listeners.get(event)!) {
                listener(data);
            }
        }
    }
    public clear(): void {
        this.listeners.clear();
    }
}