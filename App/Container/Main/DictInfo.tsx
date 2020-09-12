import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Dict as DictPlaceholder } from "../../Config/Lang";
import { keys, pick } from "lodash";
import DictService, {
  _DictEntity,
  DictEntity,
} from "../../Service/Http/DictService";
import Container from "../Container";
import Toast from "../../Service/Sys/Toast";
import { TextInput, Button } from "react-native-paper";
import { RootReducersType } from "../../Redux/rootReducer";
import { RouteProp } from "@react-navigation/native";

/**
 * 是保存还是修改
 *
 * @private
 * @property {Boolean} isUpdate true: 修改 false: 增加
 */
let isUpdate: Boolean;

export interface Props {}

export interface State {
  isSaving: boolean;
  dict: DictEntity;
}

export class DictInfo extends Container {
  service = new DictService();
  state = {
    isSaving: false,
    dict: _DictEntity,
  };
  constructor(props: Props) {
    super(props);
    // @ts-ignore@ps:prop
    const { route } = this.props;
    // 用ID判断是修改还是增加
    isUpdate = route.params && route.params.id && route.params.id > 0;
    const dict = isUpdate ? route.params : _DictEntity;

    this.state = { ...this.state, dict };
  }

  onSaveDict() {
    if (this.state.isSaving) {
      new Toast().show({ message: "点击频繁" });
      return;
    }
    this.setState({ isSaving: true });
    const promise = isUpdate
      ? this.service.updateDict(this.state.dict)
      : this.service.addDict(this.state.dict);
    return promise
      .then((res) => {
        this.navigation().pop();
        new Toast().show({ message: "保存成功" });
      })
      .catch((message) => {
        this.setState({ isSaving: false });
        new Toast().show({ message });
      });
  }

  renderDictInput() {
    return keys(pick(this.state.dict, Object.keys(_DictEntity))).map((_key) => (
      // @ts-ignore:@ps:comp-attr
      <TextInput
        mode="outlined"
        dense={true}
        keyboardType="url"
        placeholder={
          // @ts-ignore@ps:prop
          DictPlaceholder[_key] ? DictPlaceholder[_key] : "请输入文本"
        }
        key={_key}
        // @ts-ignore@ps:prop
        value={this.state.dict[_key]}
        onChangeText={(text) => {
          this.setState({ dict: { ...this.state.dict, [_key]: text } });
        }}
      />
    ));
  }

  render() {
    return (
      <View style={{ padding: 20 }}>
        {this.renderDictInput()}
        {/* @ts-ignore:@ps:comp-attr */}
        <Button
          loading={this.state.isSaving}
          style={{ marginTop: 20 }}
          mode="contained"
          onPress={() => this.onSaveDict()}
        >
          保存
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state: RootReducersType) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DictInfo);
