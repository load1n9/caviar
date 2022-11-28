import { MATH_CONST, Vector } from "../mod.ts";

// https://github.com/photonstorm/phaser/blob/master/src/gameobjects/components/TransformMatrix.js
export interface IVectorLike {
  x: number;
  y: number;
}

interface IDecomposed {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export class TransformMatrix {
  matrix: Float32Array;
  decomposedMatrix: IDecomposed;
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);
    this.decomposedMatrix = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
  }

  get a(): number {
    return this.matrix[0];
  }
  set a(value: number) {
    this.matrix[0] = value;
  }
  get b(): number {
    return this.matrix[1];
  }
  set b(value: number) {
    this.matrix[1] = value;
  }
  get c(): number {
    return this.matrix[2];
  }
  set c(value: number) {
    this.matrix[2] = value;
  }
  get d(): number {
    return this.matrix[3];
  }
  set d(value: number) {
    this.matrix[3] = value;
  }
  get e(): number {
    return this.matrix[4];
  }
  set e(value: number) {
    this.matrix[4] = value;
  }
  get f(): number {
    return this.matrix[5];
  }
  set f(value: number) {
    this.matrix[5] = value;
  }
  get tx(): number {
    return this.matrix[4];
  }
  set tx(value: number) {
    this.matrix[4] = value;
  }
  get ty(): number {
    return this.matrix[5];
  }
  set ty(value: number) {
    this.matrix[5] = value;
  }
  get rotation(): number {
    return Math.acos(this.a / this.scaleX) *
      ((Math.atan(-this.c / this.a) < 0) ? -1 : 1);
  }
  get rotationNormalized(): number {
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];

    if (a || b) {
      return (b > c) ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
    } else if (c || d) {
      return MATH_CONST.TAU -
        ((d > 0) ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY));
    }
    return 0;
  }
  get scaleX(): number {
    return Math.sqrt((this.a * this.a) + (this.b * this.b));
  }
  get scaleY(): number {
    return Math.sqrt((this.c * this.c) + (this.d * this.d));
  }
  loadIdentity(): TransformMatrix {
    this.matrix[0] = 1;
    this.matrix[1] = 0;
    this.matrix[2] = 0;
    this.matrix[3] = 1;
    this.matrix[4] = 0;
    this.matrix[5] = 0;
    return this;
  }
  translate(x: number, y: number): TransformMatrix {
    this.matrix[4] = this.matrix[0] * x + this.matrix[2] * y + this.matrix[4];
    this.matrix[5] = this.matrix[1] * x + this.matrix[3] * y + this.matrix[5];
    return this;
  }
  scale(x: number, y: number): TransformMatrix {
    this.matrix[0] *= x;
    this.matrix[1] *= x;
    this.matrix[2] *= y;
    this.matrix[3] *= y;
    return this;
  }
  rotate(angle: number): TransformMatrix {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const a = this.matrix[0];
    const b = this.matrix[1];
    const c = this.matrix[2];
    const d = this.matrix[3];
    this.matrix[0] = a * cos + c * sin;
    this.matrix[1] = b * cos + d * sin;
    this.matrix[2] = a * -sin + c * cos;
    this.matrix[3] = b * -sin + d * cos;
    return this;
  }
  multiply(rhs: TransformMatrix, out?: TransformMatrix): TransformMatrix {
    const matrix = this.matrix;
    const source = rhs.matrix;
    const localA = matrix[0];
    const localB = matrix[1];
    const localC = matrix[2];
    const localD = matrix[3];
    const localE = matrix[4];
    const localF = matrix[5];

    const sourceA = source[0];
    const sourceB = source[1];
    const sourceC = source[2];
    const sourceD = source[3];
    const sourceE = source[4];
    const sourceF = source[5];

    const destinationMatrix = out ? out : this;
    destinationMatrix.a = (sourceA * localA) + (sourceB * localC);
    destinationMatrix.b = (sourceA * localB) + (sourceB * localD);
    destinationMatrix.c = (sourceC * localA) + (sourceD * localC);
    destinationMatrix.d = (sourceC * localB) + (sourceD * localD);
    destinationMatrix.e = (sourceE * localA) + (sourceF * localC) + localE;
    destinationMatrix.f = (sourceE * localB) + (sourceF * localD) + localF;
    return destinationMatrix;
  }
  multiplyWithOffset(
    src: TransformMatrix,
    offsetX: number,
    offsetY: number,
  ): TransformMatrix {
    const matrix = this.matrix;
    // the matrix your wife told you not to worry about.
    const otherMatrix = src.matrix;

    const a0 = matrix[0];
    const b0 = matrix[1];
    const c0 = matrix[2];
    const d0 = matrix[3];
    const tx0 = matrix[4];
    const ty0 = matrix[5];

    const pse = offsetX * a0 + offsetY * c0 + tx0;
    const psf = offsetX * b0 + offsetY * d0 + ty0;

    const a1 = otherMatrix[0];
    const b1 = otherMatrix[1];
    const c1 = otherMatrix[2];
    const d1 = otherMatrix[3];
    const tx1 = otherMatrix[4];
    const ty1 = otherMatrix[5];

    matrix[0] = a1 * a0 + b1 * c0;
    matrix[1] = a1 * b0 + b1 * d0;
    matrix[2] = c1 * a0 + d1 * c0;
    matrix[3] = c1 * b0 + d1 * d0;
    matrix[4] = tx1 * a0 + ty1 * c0 + pse;
    matrix[5] = tx1 * b0 + ty1 * d0 + psf;
    return this;
  }

  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  ): TransformMatrix {
    const matrix = this.matrix;
    const a0 = matrix[0];
    const b0 = matrix[1];
    const c0 = matrix[2];
    const d0 = matrix[3];
    const tx0 = matrix[4];
    const ty0 = matrix[5];

    matrix[0] = a * a0 + b * c0;
    matrix[1] = a * b0 + b * d0;
    matrix[2] = c * a0 + d * c0;
    matrix[3] = c * b0 + d * d0;
    matrix[4] = tx * a0 + ty * c0 + tx0;
    matrix[5] = tx * b0 + ty * d0 + ty0;
    return this;
  }

  transformPoint(
    x: number,
    y: number,
    point: IVectorLike = { x: 0, y: 0 },
  ): IVectorLike {
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];
    point.x = x * a + y * c + tx;
    point.y = x * b + y * d + ty;
    return point;
  }

  invert(): TransformMatrix {
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];
    const determinant = a * d - b * c;
    matrix[0] = d / determinant;
    matrix[1] = -b / determinant;
    matrix[2] = -c / determinant;
    matrix[3] = a / determinant;
    matrix[4] = (c * ty - d * tx) / determinant;
    matrix[5] = -(a * ty - b * tx) / determinant;
    return this;
  }

  copyFrom(src: TransformMatrix): TransformMatrix {
    const matrix = this.matrix;
    matrix[0] = src.a;
    matrix[1] = src.b;
    matrix[2] = src.c;
    matrix[3] = src.d;
    matrix[4] = src.e;
    matrix[5] = src.f;
    return this;
  }

  copyFromArray(src: number[]): TransformMatrix {
    const matrix = this.matrix;
    matrix[0] = src[0];
    matrix[1] = src[1];
    matrix[2] = src[2];
    matrix[3] = src[3];
    matrix[4] = src[4];
    matrix[5] = src[5];
    return this;
  }

  copyToArray(dest: number[]): number[] {
    const matrix = this.matrix;
    dest[0] = matrix[0];
    dest[1] = matrix[1];
    dest[2] = matrix[2];
    dest[3] = matrix[3];
    dest[4] = matrix[4];
    dest[5] = matrix[5];
    return dest;
  }

  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  ): TransformMatrix {
    const matrix = this.matrix;
    matrix[0] = a;
    matrix[1] = b;
    matrix[2] = c;
    matrix[3] = d;
    matrix[4] = tx;
    matrix[5] = ty;
    return this;
  }

  decomposeMatrix(): IDecomposed {
    const decomposedMatrix = this.decomposedMatrix;
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const determinant = a * d - b * c;
    decomposedMatrix.translateX = matrix[4];
    decomposedMatrix.translateY = matrix[5];

    if (a || b) {
      const r = Math.sqrt(a * a + b * b);
      decomposedMatrix.rotation = (b > 0)
        ? Math.acos(a / r)
        : -Math.acos(a / r);
      decomposedMatrix.scaleX = r;
      decomposedMatrix.scaleY = determinant / r;
    } else if (c || d) {
      const s = Math.sqrt(c * c + d * d);
      decomposedMatrix.rotation = Math.PI * 0.5 -
        (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      decomposedMatrix.scaleX = determinant / s;
      decomposedMatrix.scaleY = s;
    } else {
      decomposedMatrix.rotation = 0;
      decomposedMatrix.scaleX = 0;
      decomposedMatrix.scaleY = 0;
    }
    return decomposedMatrix;
  }

  applyITRS(
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number,
  ): TransformMatrix {
    const matrix = this.matrix;

    const radianSin = Math.sin(rotation);
    const radianCos = Math.cos(rotation);

    matrix[4] = x;
    matrix[5] = y;

    matrix[0] = radianCos * scaleX;
    matrix[1] = radianSin * scaleX;
    matrix[2] = -radianSin * scaleY;
    matrix[3] = radianCos * scaleY;

    return this;
  }

  applyInverse(x: number, y: number, output: Vector = new Vector()): Vector {
    const matrix = this.matrix;
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const tx = matrix[4];
    const ty = matrix[5];
    const id = 1 / ((a * d) + (-b * c));
    output.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
    output.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);
    return output;
  }

  getX(x: number, y: number): number {
    return x * this.a + y * this.c + this.e;
  }

  getY(x: number, y: number): number {
    return x * this.b + y * this.d + this.f;
  }

  getXRound(x: number, y: number, round = false): number {
    const v = this.getX(x, y);
    return round ? Math.round(v) : v;
  }

  getYRound(x: number, y: number, round = false): number {
    const v = this.getY(x, y);
    return round ? Math.round(v) : v;
  }

  getCSSMatrix(): string {
    return `matrix(${this.matrix[0]}, ${this.matrix[1]}, ${this.matrix[2]}, ${
      this.matrix[3]
    }, ${this.matrix[4]}, ${this.matrix[5]})`;
  }
}
