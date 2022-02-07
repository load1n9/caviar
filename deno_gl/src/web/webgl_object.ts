export const _name = Symbol("[[glObjectName]]");
export const _invalidated = Symbol("[[invalidated]]");

const cache = new Map<number, WebGLObject>();

export class WebGLObject {
  [_name]: number;
  [_invalidated]: boolean = false;

  constructor(name: number) {
    this[_name] = name;
    if (name === 0) {
      console.log("warn: GL object created with zero name");
    }
  }

  static make(name: number) {
    if (cache.has(name)) {
      return cache.get(name)!;
    } else {
      const obj = new this(name);
      cache.set(name, obj);
      return obj;
    }
  }

  toString() {
    return `WebGLObject(${this[_name]})`;
  }

  [Symbol.for("Deno.customInspect")]() {
    return this.toString();
  }
}
