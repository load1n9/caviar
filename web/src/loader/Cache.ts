const caches = new Map();

export const Cache = {
  get: (type: string): Map<string, unknown> => {
    if (!caches.has(type)) {
      caches.set(type, new Map());
    }

    return caches.get(type);
  },

  getEntry: (cache: string, entry: string): unknown => {
    if (caches.has(cache)) {
      return caches.get(cache).get(entry);
    }
  },
};
