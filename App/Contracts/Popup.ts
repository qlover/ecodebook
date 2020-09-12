// 弹窗类型
// 关于弹出窗口,吐丝,或者是提示都应该实现该接口

declare type OptionsType = {
  message?: string;
};

export default class Popup {
  constructor() {}

  showText(text: string) {
    // alert(options.message);
    // console.log("[Toast]", text);
    alert("[Toast]" + text);
  }
  show(options: OptionsType) {
    // alert(options.message);
    // console.log("[Toast]", options.message);
    alert("[Toast]" + options.message);
  }
}
