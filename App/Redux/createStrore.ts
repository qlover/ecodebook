// @flow
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";

// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import AsyncStorage from "@react-native-community/async-storage";

// 根 reducer,整合了全部需要的 recuder
import rootReducer from "./rootReducer";

// 应用中间件
const middleware = applyMiddleware(thunk);
// 持久化配置
const persistConfig = {
  key: "ecodebook",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 状态存储树
const store = createStore(persistedReducer, middleware);

// 持久化
/**
 * #TIP ts-ignore rootReducer combineReducers 中注册的 reducer 中的 action 不是 AnyAction 类型
 */
// @ts-ignore
export const persistor = persistStore(store);

export default store;
