interface Item {
  id: string;
  completed: boolean;
  // deno-lint-ignore no-explicit-any
  data: any;
  type: "atlas";
  // deno-lint-ignore no-explicit-any
  callback: any;
}
export class Loader {
  static queue: Map<string, Item> = new Map();
  static completed: Map<string, Item> = new Map();

  static load(item: Item): void {
    Loader.queue.set(item.id, item);
    Loader.loadNext();
  }
  static loadNext() {
    if (Loader.queue.size === 0) {
      return;
    }
    const item = Loader.queue.values().next().value;
    if (item.type === "atlas") {
      // Loader.loadAtlas(item);
    }
  }
}
