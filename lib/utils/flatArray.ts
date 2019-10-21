export const flatArray = (arr: any[][]): any[] =>
  [].concat(...(arr as Array<[]>));
