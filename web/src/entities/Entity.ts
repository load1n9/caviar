export abstract class Entity {
  readonly id = crypto.randomUUID();
  #x: number;
  #y: number;
  #z = 1;
  width = 0;
  height = 0;

  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }
  set x(x: number) {
    this.#x = x;
  }
  get x(): number {
    return this.#x;
  }
  set z(z: number) {
    this.#z = z;
  }
  get z(): number {
    return this.#z;
  }
  set y(y: number) {
    this.#y = y;
  }
  get y() {
    return this.#y;
  }
  setPosition(x: number, y: number, z?: number) {
    this.#x = x;
    this.#y = y;
    if (z) this.#z = z;
  }
}
