const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8999,
    open: true,
    proxy: {
      // 配置跨域代理
    },
  },
});
