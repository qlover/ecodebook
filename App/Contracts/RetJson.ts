// 通用的响应实体类型

export interface RetCode {
  code: number;
}

export interface ByKey extends RetCode {
  [key: string]: any;
}

export interface Error {
  error?: string;
}

export interface Msg extends Error {}

export interface Single {}

export interface Message extends Error {
  code: number;
  msg: string;
}
