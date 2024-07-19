import store from "@/store";
export default class SocketServices {
  // 通过单例模式优化socket实例重复的问题
  static instance = null;
  // websocket实例对象
  ws = null;
  // 标识websocket是否连接成功 false 不成功 true成功
  connected = false;

  // 记录重试发送次数
  sendRetryCount = 0;

  // 存储回调函数
  callBackMapping = {};

  // 重试连接的次数
  connectRetryCount = 0;

  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketServices();
    }
    return this.instance;
  }

  // 连接后端websocket的方法
  connect() {
    // 判断浏览器支不支持Websocket
    if (!window.WebSocket) {
      return console.log("您的浏览器不支持WebSocket");
    }

    // 连接服务端的websocket
    this.ws = new WebSocket("ws://ws.9yuecloud.com:9998");
    // this.ws = new WebSocket("ws://127.0.0.1:9998");

    // 监听客户端连接服务端成功触发的事件
    this.ws.onopen = () => {
      console.log("连接服务端成功了");

      // 设置当前连接的状态为成功
      this.connected = true;

      store.commit("setSocketConnected", true);

      // 重置重新连接的次数
      this.connectRetryCount = 0;
    };

    // 监听客户端连接失败触发的事件
    this.ws.onclose = () => {
      console.log("连接服务端失败");
      // 设置当前连接的状态为失败
      this.connected = false;
      store.commit("setSocketConnected", false);

      // 断线重连
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect();
      }, 500 * this.connectRetryCount);
    };

    // 接受服务端主动给客户端发送的消息
    this.ws.onmessage = (msg) => {
      console.log("从服务端获取到了数据");

      const recvData = JSON.parse(msg.data);
      const socketType = recvData.socketType;
      if (this.callBackMapping[socketType]) {
        const action = recvData.action;
        if (action === "getData") {
          const realData = JSON.parse(recvData.data);
          this.callBackMapping[socketType].call(this, realData);
        } else if (action === "fullScreen") {
          this.callBackMapping[socketType].call(this, recvData);
        } else if (action === "themeChange") {
          this.callBackMapping[socketType].call(this, recvData);
        }
      }
    };
  }

  // 主动给服务端发消息(发请求)
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws.send(JSON.stringify(data));
    } else {
      this.sendRetryCount++;
      // 断线重复发送数据
      setTimeout(() => {
        this.send(data);
      }, 500 * this.sendRetryCount);
    }
  }

  // 注册回调函数的方法
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack;
  }

  // 销毁注册的回调函数方法
  unregisterCallBack(socketType) {
    this.callBackMapping[socketType] = null;
  }
}

/**
 * action :
 *  getData 获取的是图表的数据
 *  fullScreen 获取的全屏的数据
 *  themeChange  获取的主题切换的数据
 *
 * socketType : 前端请求的标识
 * socketType : "a"
 *
 * chartName:trend / seller | map
 *
 * value :
 *  action : getData value  = ''
 *  action : fullScreen value = true / false
 *  action : themeChange value = "chalk | verial"
 */
