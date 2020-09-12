import * as React from "react";

/**
 * 所有容器，所有页面的基类
 */
export default class Container extends React.Component {
  static screen: Container;
  constructor(props: any) {
    super(props);
    // 记录当前页
    Container.screen = this;
  }

  navigation() {
    // @ts-ignore
    return this.props.navigation;
  }
}
