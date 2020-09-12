import React from "react";
import { StyleSheet, View, Text, FlatList, RefreshControl } from "react-native";
import {
  Button,
  Portal,
  FAB,
  Surface,
  Provider,
  Dialog,
  ActivityIndicator,
  Colors,
} from "react-native-paper";
import Ionicons from "react-native-vector-icons/AntDesign";
import { throttle, identity } from "lodash";

import DictService, {
  DictEntity,
  _DictEntity,
} from "../../Service/Http/DictService";
import TokenService from "../../Service/Local/TokenService";
import Container from "../Container";
import Toast from "../../Service/Sys/Toast";
import { logout } from "../../Service/Http/UserLoginService";

let page = {
  page: 1,
  limit: 10,
};

let loadOver = false;
let dict: DictEntity;

export interface Props {}

export interface State {
  visible: false;
  isLoading: false;
  animating: false;
  isRefreshing: false;
  dictlist: DictEntity[];
}

export default class DictHome extends Container {
  service = new DictService();

  state = {
    visible: false,
    isLoading: false,
    isRefreshing: false,
    animating: false,
    dictlist: [],
  };

  constructor(props: Props) {
    super(props);
  }

  _onLoading = throttle(this.__onLoading, 1500);

  /**
   *
   * 解决以下问题
   * ```
   * Warning: Can't perform a React state update on an unmounted component.
   * This is a no-op, but it indicates a memory leak in your application.
   * To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
   * ```
   */
  componentWillUnmount() {
    this.setState = () => false;
  }

  componentDidMount() {
    this.__onLoading(true);
  }

  changeStatus(isLoading = false, isRefreshing = false) {
    this.setState({ isLoading, isRefreshing });
  }

  /**
   * 增加页数或重置页数
   *
   * @param {boolean} rest 是否重置页数
   * @param {number} inc 每次增加的页数,默认1
   */
  incrementPage(rest: Boolean = false, inc: number = 1) {
    return (page.page = rest ? 1 : page.page + Math.max(0, inc));
  }

  onPressDict(params = _DictEntity) {
    this.navigation().navigate({
      name: "DcitInfo",
      params,
    });
  }

  onPressDeleteDict(params: DictEntity) {
    dict = params;
    this.onToggleDialog(true);
  }

  onToggleDialog(visible = false) {
    this.setState({ visible });
  }

  _onDeleteDict() {
    this.setState({ isRefreshing: true });
    const state = { isRefreshing: false, visible: false };
    this.service
      .deleteDict([dict.id])
      .then((res) => {
        const dictlist = this.state.dictlist.filter(
          (_dict: DictEntity) => _dict.id !== dict.id
        );
        this.setState({ ...state, dictlist });
        new Toast().showText("删除成功");
      })
      .catch((err) => {
        this.setState(state);
        new Toast().showText(err);
      });
  }

  __onLoading(isRefreshing = false) {
    if (isRefreshing) {
      // 刷新
      loadOver = false;
      this.setState({ isRefreshing });
    } else {
      // 加载
      if (loadOver) {
        return 0;
      }
      this.setState({ isLoading: true });
    }

    const state = { isRefreshing: false, isLoading: false };
    this.incrementPage(isRefreshing);

    this.service
      .getList(page, { sort: "id", sortBy: 1 })
      .then((res) => {
        const { data } = res.dicts;
        // 放置是否加载完毕
        loadOver = !data || data.length < page.limit;
        const dictlist = isRefreshing
          ? data
          : [...this.state.dictlist, ...data];
        this.setState({ ...state, dictlist });
      })
      .catch((message) => {
        this.setState(state);
        new Toast().show({ message });
      });
  }

  onLogout() {
    logout()
      .then(identity)
      .catch(identity)
      .finally(() => {
        TokenService.invaldToken();
        this.navigation().reset({
          routes: [{ name: "Auth" }],
        });
      });
  }

  renderPullLoading = () => {
    if (loadOver) {
      return (
        <View style={{ margin: 15 }}>
          <Text style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
            没有更多了
          </Text>
        </View>
      );
    }
    if (this.state.isLoading) {
      return (
        <View style={{ margin: 15 }}>
          {/* @ts-ignore:@ps:comp-attr */}
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, { height: 20 }]}
            size="small"
          />
        </View>
      );
    }
    return null;
  };

  renderListHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 10,
          marginVertical: 5,
        }}
      >
        {/* @ts-ignore:@ps:comp-attr */}
        <Button
          style={{ borderColor: "#eee", flex: 1, marginRight: 20 }}
          mode="contained"
          onPress={() => this.onPressDict()}
        >
          添加
        </Button>
        {/* @ts-ignore:@ps:comp-attr */}
        <Button
          style={{ borderColor: "#eee", flex: 1, marginLeft: 20 }}
          mode="contained"
          onPress={() => this.onLogout()}
        >
          退出
        </Button>
      </View>
    );
  };

  // @ts-ignore@ps:type
  renderDict = ({ item }) => (
    // @ts-ignore:@ps:comp-attr
    <Surface style={{ margin: 10 }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          flexDirection: "row",
          zIndex: 1,
        }}
      >
        <View style={{ width: 50 }}>
          <Ionicons
            onPress={() => this.onPressDict(item)}
            size={50}
            name="lock"
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16 }}>
            {item.id}.{item.title}
          </Text>
          <Text>username: {item.username}</Text>
          <Text>password: {item.password}</Text>
        </View>

        <Ionicons
          onPress={() => this.onPressDeleteDict(item)}
          style={styles.delIcon}
          name="delete"
        />
      </View>
    </Surface>
  );

  render() {
    return (
      <Provider>
        <FlatList
          data={this.state.dictlist}
          renderItem={this.renderDict}
          keyExtractor={(item, index) => "" + index}
          ListHeaderComponent={this.renderListHeader}
          refreshControl={
            <RefreshControl
              colors={[Colors.deepPurpleA400, Colors.purpleA400]}
              tintColor={"orange"}
              titleColor={"red"} //只有ios有效
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this._onLoading(true);
              }}
            />
          }
          ListFooterComponent={() => this.renderPullLoading()} //上拉加载更多视图
          onEndReached={() => this._onLoading()} // TODO:待解决滑动频繁调用 loading
          onEndReachedThreshold={0.1} // 这个属性的意思是 当滑动到距离列表内容底部不足 0.1*列表内容高度时触发onEndReached函数 为啥要加这个属性 因为不加的话滑动一点点就会立即触发onReached函数，看不到菊花加载中
        />

        <Portal>
          {/* @ts-ignore:@ps:comp-attr */}
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => this.onPressDict()}
          />

          <Dialog
            visible={this.state.visible}
            onDismiss={() => this.onToggleDialog()}
          >
            <Dialog.Content>
              <Text style={{ fontSize: 18 }}>确定是否删除？</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {/* @ts-ignore:@ps:comp-attr */}
              <Button color="red" onPress={() => this._onDeleteDict()}>
                确定
              </Button>
              {/* @ts-ignore:@ps:comp-attr */}
              <Button onPress={() => this.onToggleDialog()}>取消</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: Colors.pink200,
    position: "absolute",
    right: 25,
    bottom: 50,
  },
  delIcon: {
    position: "absolute",
    zIndex: 2,
    right: 15,
    top: 15,
    color: Colors.pink200,
    fontSize: 20,
  },
  centering: {
    justifyContent: "center",
  },
});
