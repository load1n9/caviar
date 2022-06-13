export * from "./distance.ts";
export * from "./factorial.ts";
export * from "./bernstein.ts";
export * from "./bezier.ts";
export const average = (...values: number[]) => {
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  return sum / values.length;
};
