import { factorial } from "./factorial.ts";

export const bernstein = (n: number, i: number) =>
  factorial(n) / factorial(i) / factorial(n - i);
