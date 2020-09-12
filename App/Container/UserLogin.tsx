import * as React from "react";
import { connect } from "react-redux";
import { View, ImageBackground, Image, Text } from "react-native";
import { login } from "../Service/Http/UserLoginService";
import getMsgByKey from "../Config/error";
import TokenService from "../Service/Local/TokenService";
import Container from "./Container";
import {
  Button,
  TextInput,
  Checkbox,
  IconButton,
  Colors,
} from "react-native-paper";
import Toast from "../Service/Sys/Toast";
import { createAction, Auth } from "../Redux/AuthRedux";
import { trimAll } from "../Lib/Utils";
import { RootReducersType } from "../Redux/rootReducer";

export interface Props {
  auth: Auth;
  remember: (info: Auth) => any;
}

export interface State {
  remember: boolean;
  loading: boolean;
  isSecureTextEntry: boolean;
  username: string;
  password: string;
}

class UserLogin extends Container {
  state: State = {
    remember: false,
    loading: false,
    isSecureTextEntry: true,
    username: "",
    password: "",
  };
  constructor(props: Props) {
    super(props);
    this.state = { ...this.state, ...props.auth };
  }

  onToRegister() {
    this.navigation().navigate("register");
  }

  onRemember() {
    const { username, password } = this.state;
    // @ts-ignore:@ps:redux-mapToProps
    this.props.remember({ username, password });
  }

  onToggleSecureEntry() {
    this.setState({ isSecureTextEntry: !this.state.isSecureTextEntry });
  }

  _onLogin() {
    const { username, password } = this.state;
    this.setState({ loading: true });
    login(username, password)
      .then((res) => {
        this.setState({ loading: false });
        if (!res.token && !res.void) {
          return Promise.reject("auth.token.fail");
        }
        if (this.state.remember) {
          this.onRemember();
        }
        new Toast().showText("登录成功");
        const state = TokenService.setToken(res);
        this.navigation().replace("Main");
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.error) {
          new Toast().showText(getMsgByKey(error.error));
        } else {
          new Toast().showText("登录失败" + error);
        }
      });
  }

  // renderIcon = () => (
  //   <Ionicons
  //     onPress={() => this.onToggleSecureEntry()}
  //     name={this.state.isSecureTextEntry ? "eye-off" : "eye"}
  //   />
  // );

  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Source/container-boot.png")}
      >
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Image source={require("../Source/container-login-logo.png")} />
        </View>
        <View style={{ flex: 3, padding: 20, margin: 20 }}>
          {/* @ts-ignore:@ps:comp-attr */}
          <TextInput
            mode="outlined"
            dense={true}
            value={this.state.username}
            placeholder="请输入用户名"
            onChangeText={(username) => {
              this.setState({ username: trimAll(username) });
            }}
          />
          <View style={{ position: "relative", justifyContent: "center" }}>
            {/* @ts-ignore:@ps:comp-attr */}
            <TextInput
              style={{ zIndex: 1 }}
              mode="outlined"
              secureTextEntry={this.state.isSecureTextEntry}
              dense={true}
              value={this.state.password}
              placeholder="请输入密码"
              maxLength={32}
              onChangeText={(password) => {
                this.setState({ password: trimAll(password) });
              }}
            />
            {/* @ts-ignore:@ps:comp-attr */}
            <IconButton
              style={{
                position: "absolute",
                right: 0,
                zIndex: 2,
                bottom: 0,
                backgroundColor: "#eee",
              }}
              icon={this.state.isSecureTextEntry ? "eye-off" : "eye"}
              color={Colors.deepPurple800}
              size={20}
              onPress={() => this.onToggleSecureEntry()}
            />
          </View>

          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                color="#6200ee"
                status={this.state.remember ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ remember: !this.state.remember });
                }}
              />
              <Text>记住密码</Text>
            </View>
            <View>
              <Text onPress={() => this.onToRegister()}>去注册</Text>
            </View>
          </View>
          {/* @tip 属性没给全 */}
          {/* @ts-ignore */}
          <Button
            loading={this.state.loading}
            mode="contained"
            style={{ marginVertical: 10 }}
            onPress={() => this._onLogin()}
            labelStyle={{ fontSize: 16 }}
          >
            登 录
          </Button>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state: RootReducersType) => {
  return {
    auth: state.AuthReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  remember: (info: Auth) => dispatch(createAction(info)),
});

// @ts-ignore:@ps:redux-connect
export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
