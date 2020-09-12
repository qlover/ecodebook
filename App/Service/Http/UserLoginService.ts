import {
  API_USER_LOGIN,
  API_USER_REGISTER,
  API_USER_LOGOUT,
} from "../../Config/api";
import RequestClient from "../../Lib/RequestClient";
import UserLoginRequest from "../../Validation/UserLoginRequest";
import { jwtToken } from "../../Redux/TokenRedux";
import { Error, Message } from "../../Contracts/RetJson";
import ApiService from "./ApiService";

export const login = (
  username: string,
  password: string
): Promise<jwtToken & Error> => {
  return new RequestClient()
    .before(UserLoginRequest.validation)
    .after(ApiService.interceptorJson)
    .request(API_USER_LOGIN, { username, password });
};

export const signup = (
  username: string,
  password: string
): Promise<Message> => {
  return new RequestClient()
    .before(UserLoginRequest.validation)
    .after(ApiService.interceptorJson)
    .request(API_USER_REGISTER, {
      username,
      password,
    });
};

export const logout = (): Promise<Message> => {
  return new RequestClient()
    .after(ApiService.interceptorJson)
    .request(API_USER_LOGOUT);
};
