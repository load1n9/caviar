export const Average = (values: Array<number>): number => {
  let sum = 0;
  values.forEach((e: number) => {
    sum += +e;
  });
  return sum / values.length;
};
