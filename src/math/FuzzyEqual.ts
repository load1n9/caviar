export const FuzzyEqual = (a: number, b: number, epsilon = 0.0001) =>
  Math.abs(a - b) < epsilon;
