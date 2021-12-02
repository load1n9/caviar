import { Factorial } from "./mod.ts";
export const Bernstein = (n: number, i: number) => Factorial(n) / Factorial(i) / Factorial(n-1);
