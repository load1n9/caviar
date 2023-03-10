/**
 * An Entity represents any object that can be used in a scene
 */
export abstract class Entity {
  /**
   * Identifier for the entity
   */
  readonly id: string;
  #x: number;
  #y: number;
  #z: number;

  /**
   * Width of the entity
   */
  width = 0;

  /**
   * Height of the entity
   */
  height = 0;

  #interactive = false;

  constructor(x: number, y: number) {
    this.id = crypto.randomUUID();
    this.#x = x;
    this.#y = y;
    this.#z = 1;
  }

  set x(x: number) {
    this.#x = x;
  }

  /**
   * X coordinate of the entity
   */
  get x(): number {
    return this.#x;
  }

  set y(y: number) {
    this.#y = y;
  }

  /**
   * Y coordinate of the entity
   */
  get y() {
    return this.#y;
  }

  set z(z: number) {
    this.#z = z;
  }

  /**
   * Z coordinate of the entity
   */
  get z(): number {
    return this.#z;
  }

  /**
   * Whether or not the entity is interactive
   */
  get interactive() {
    return this.#interactive;
  }

  /**
   * Sets the interactivity to a boolean
   */
  setInteractive(interactive = true) {
    this.#interactive = interactive;
  }

  /**
   * Sets the entities position
   */
  setPosition(x: number, y: number, z?: number) {
    this.#x = x;
    this.#y = y;
    if (z) this.#z = z;
  }

  /**
   * Logic for determining mouse collision
   */
  collides(_x: number, _y: number) {
    return false;
  }

  /**
   * Runs when the entity is clicked
   */
  onClick() {
  }
}
