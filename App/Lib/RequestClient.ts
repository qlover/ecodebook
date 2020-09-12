import { API } from "../Config/env";
import { stringify } from "qs";
import {
  RequestIon,
  RequestOptions,
  InterceptorType,
} from "../Contracts/Types/Service";
import { isObject, omitBy, isEmpty, pick, identity } from "lodash";

// null 和 undefined 一次性判断用 ==
export const filterParams = (param: any) => "" === param || undefined == param;

let Signal: AbortController;

const _Rejected = (err: any) => Promise.reject(err);

const _ResponseFulfilled = (res: Response) => {
  const { status } = res;
  if (500 == status) {
    return Promise.reject("net.request.error");
  }
  if (408 === status || 504 === status) {
    Signal && Signal.abort();
    return Promise.reject("net.request.timeout");
  }

  // 成功后响应为 JSON
  return res
    .json()
    .then(identity, (err) => Promise.reject("net.response.notjson"));
};
const _ResponseRejected = (res: Response) => {
  Signal && Signal.abort();
  return Promise.reject(res);
};

const timeoutPromise = (timeout: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response("timeout", { status: 504, statusText: "timeout" }));
    }, timeout);
  });
};

export const _RequestOptions: RequestOptions = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  mode: "cors",
  delay: 10,
  timeout: 5000,
};

/**
 * - timeout polyfill
 * @see https://github.com/robinpowered/react-native-fetch-polyfill/blob/master/fetch-polyfill.js
 *
 */
export default class RequestClient {
  interceptor = {
    request: [],
    response: [],
  };
  options = _RequestOptions;
  constructor(options?: RequestOptions) {
    this.options = { ...this.options, ...options };

    // 拦截超时响应
    this.after(_ResponseFulfilled, _ResponseRejected);
  }

  /**
   * 设置请求头
   * @param {string} key 键
   * @param {string} value 值
   */
  setHeader(key: string, value: string): this {
    // @ts-ignore@ps:prop
    this.options.headers[key] = value;
    return this;
  }

  /**
   * 注册请求拦截
   *
   * promise 参数默认接收 request 参数二
   *
   * @param {Function} onfulfilled
   * @param {object} args
   * @param {Function} onrejected
   */
  before(onfulfilled: Function, args = {}, onrejected = null) {
    // @ts-ignore@ps:type
    this.interceptor.request.unshift({ onfulfilled, onrejected, args });
    return this;
  }

  /**
   * 注册响应拦截
   * @param {Function} onfulfilled
   * @param {Function} onrejected
   */
  after(onfulfilled: Function, onrejected?: Function) {
    // @ts-ignore@ps:type
    this.interceptor.response.push({ onfulfilled, onrejected });
    return this;
  }

  /**
   * 获取请求前的拦截 promise
   * @param {any} params 参数
   */
  getRequestInterceptor(params: any): Promise<any> {
    let promise = Promise.resolve(params);
    this.interceptor.request.forEach((cept: InterceptorType) => {
      promise = promise.then(cept.onfulfilled, cept.onrejected);
    });
    return promise;
  }

  /**
   * 解析请求参数
   *
   * @param {RequestIon} ion
   * @param {object|null} params
   * @returns {object} {url, init}
   */
  parse(ion: RequestIon, params?: object) {
    let init = pick(this.options, "mode", "headers", "timeout");
    let url = API + ion.api;
    // @ts-ignore@ps:prop
    init.method = ion.method;

    if (!isEmpty(params) && isObject(params)) {
      // GET 和 HEAD 方法没有主体
      if ("GET" == ion.method || "HEAD" == ion.method) {
        const querystring = stringify(params);
        url = [url, querystring].join("?");
      } else if ((params = omitBy(params, filterParams))) {
        // 去掉为空的值, '' 和 null,其余可以有主体
        // @ts-ignore@ps:prop
        init.body = JSON.stringify(params);
      }
    }
    return { url, init };
  }

  request(ion: RequestIon, params?: object) {
    let promise: Promise<any>;
    const input = this.parse(ion, params);

    // 请求拦截
    if (this.interceptor.request.length) {
      // !!! 强制使用请求对象作为后面参数
      promise = this.getRequestInterceptor(params).then((args) => input);
    } else {
      promise = Promise.resolve(input);
    }

    // 发送请求
    promise = promise.then(RequestClient.send);

    // 响应拦截
    this.interceptor.response.forEach((cept: InterceptorType) => {
      promise = promise.then(cept.onfulfilled, cept.onrejected);
    });

    return promise;
  }

  // @ts-ignore@ps:type
  static send({ url, init }) {
    console.info(`[info][http send ${init.method}] ${url}`);
    // -FIXME 手动使用 AbortControler 中止
    Signal = new AbortController();
    init.signal = Signal.signal;
    return Promise.race([timeoutPromise(init.timeout), fetch(url, init)]);
  }
}
