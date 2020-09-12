import TokenService from "../Local/TokenService";
import RequestClient from "../../Lib/RequestClient";
import Toast from "../Sys/Toast";
import Container from "../../Container/Container";
import { Message } from "../../Contracts/RetJson";

/**
 * 默认携带 token
 */
export default class ApiService {
  constructor() {}

  // json 响应拦截
  static interceptorJson = (res: Message) => {
    // 认证错误
    if (40102 == res.code) {
      new Toast().show({ message: res.error });
      Container.screen.navigation().replace("Auth");
      return Promise.reject(res.error);
    } else if (res.error) {
      // @TIP 抛出错误 key
      return Promise.reject(res.error);
    }
    return res;
  };

  /**
   * 默认添加 json 响应拦截
   */
  api() {
    const token = TokenService.getToken();
    let req = new RequestClient();
    if (TokenService.check(token)) {
      req.setHeader(token.key, token.token);
    }
    // 拦截成功响应后的 json
    return req.after(ApiService.interceptorJson);
  }
}
