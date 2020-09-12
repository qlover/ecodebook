// 根 reducer
// 对所有的 reducer 做整合
import { combineReducers } from "redux";
import { TokenReducer } from "./TokenRedux";
import { AuthReducer } from "./AuthRedux";

// 类型注册(键名注册)
export declare type RootReducersType = {
  TokenReducer: any;
  AuthReducer: any;
};

// reducers 注册
const RootReducers: RootReducersType = {
  //every modules reducer should be define here
  // TODO: TOKEN 的 reducer 和其它的 reducer 不同是单独的本地 Local，所以到时候应该单独华分出去
  TokenReducer,
  AuthReducer,
};

export default combineReducers(RootReducers);
