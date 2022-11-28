export const Factorial = (v: number): number => {
  if (v === 0) return 1;
  let res = v;
  while (--v) {
    res *= v;
  }
  return res;
};
