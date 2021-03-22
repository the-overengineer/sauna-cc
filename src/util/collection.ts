export const sum = (xs: number[]): number => xs.reduce((acc, num) => acc + num, 0);

export const count = <T>(xs: T[], predicate: (x: T) => boolean): number =>
  xs.reduce((acc, x) => predicate(x) ? acc + 1 : acc, 0);

