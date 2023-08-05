export const flatArray = <T>(arr: T[][]): T[] =>
  [].concat(...(arr as Array<[]>));
