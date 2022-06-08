export interface Coordinate {
  x: number;
  y: number;
}
export const distanceBetween = (a: Coordinate, b: Coordinate) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const distanceBetweenSquared = (
  a: Coordinate,
  b: Coordinate,
) => Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);

export const chebyshevDistance = (a: Coordinate, b: Coordinate) =>
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
