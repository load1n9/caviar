export const bezier = (
  a: number,
  b: number,
  c: number,
  d: number,
  t: number,
) => {
  const inverseFactor = 1 - t;
  const inverseFactorTimesTwo = inverseFactor * inverseFactor;
  const factorTimes2 = t * t;
  const factor = [
    inverseFactorTimesTwo * inverseFactor,
    3 * t * inverseFactorTimesTwo,
    3 * factorTimes2 * inverseFactor,
    factorTimes2 * t,
  ];
  return a * factor[0] + b * factor[1] + c * factor[2] + d * factor[3];
};
