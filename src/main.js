import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入全局样式
import "./assets/css/global.css";
// 引入字体图标样式
import "./assets/font/iconfont.css";

Vue.config.productionTip = false;

// 引入flexible
import "amfe-flexible";

// 引入echarts
import * as Echarts from "echarts";

// 将echarts挂载到全局
Vue.prototype.$echarts = Echarts;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
