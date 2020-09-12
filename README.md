requireNativeComponent: "RNCSafeAreaProvider" was not found in th UIManager

错误原因不明，

但目前的解决方法能解决

```
npm i react-native-safe-area-context
```

附上当前 package.json 的 dependencies: 

```
"dependencies": {
  "@react-native-community/masked-view": "^0.1.10",
  "@react-navigation/native": "^5.1.7",
  "@react-navigation/stack": "^5.2.14",
  "expo": "~38.0.9",
  "expo-splash-screen": "^0.5.0",
  "expo-status-bar": "^1.0.0",
  "expo-updates": "~0.2.8",
  "react": "~16.11.0",
  "react-dom": "~16.11.0",
  "react-native": "~0.62.2",
  "react-native-gesture-handler": "~1.6.0",
  "react-native-reanimated": "~1.9.0",
  "react-native-safe-area-context": "^3.1.7",
  "react-native-screens": "~2.9.0",
  "react-native-unimodules": "~0.10.0",
  "react-native-web": "~0.11.7"
},
"devDependencies": {
  "@babel/core": "~7.9.0",
  "@types/react": "~16.9.23",
  "@types/react-dom": "~16.9.8",
  "@types/react-native": "~0.61.23",
  "babel-preset-expo": "~8.2.0",
  "jest-expo": "~38.0.0",
  "typescript": "~3.9.5"
},
```