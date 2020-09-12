export const guid = (g = 10): string =>
  Math.random().toString(16).substr(2, Math.max(5, g)).toUpperCase();

export const unionKey = (key?: string) => Symbol(key ? key : guid(5));

export const diffTimestamp = (t1: number, t2: number) => t1 - t2;

export const trimAll = (str: string) => str.replace(" ", "");
