<script>
import dayjs from "dayjs";
import Trend from "@/components/Trend.vue";
import Seller from "@/components/Seller.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Hot from "@/components/Hot.vue";
import Stock from "@/components/Stock.vue";
export default {
  name: "ScreenPage",
  data() {
    return {
      time: 0,
    };
  },
  components: {
    Trend,
    Seller,
    Map,
    Rank,
    Hot,
    Stock,
  },
  mounted() {
    this.getTime();
    this.startTime();
  },
  methods: {
    getTime() {
      this.time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    },
    startTime() {
      setInterval(() => {
        this.getTime();
      }, 1000);
      setInterval(() => {
        this.getTime();
      }, 1000);
    },
    handleToggleTheme() {
      this.$store.commit("changeTheme");
    },
  },
};
</script>

<template>
  <div class="screen-container">
    <!--头部-->
    <div class="screen-header">
      <div class="header-bg">
        <img alt="" src="@/assets/img/header_border_dark.png" />
      </div>
      <span class="title">电商平台实时监控系统</span>
      <div class="icon-group">
        <span class="iconfont icon-move"></span>
        <img
          alt=""
          class="qiehuan"
          src="@/assets/img/qiehuan_dark.png"
          @click="handleToggleTheme"
        />
        <span class="time">{{ time }}</span>
      </div>
    </div>
    <!--内容-->
    <div class="screen-body">
      <div class="column">
        <div class="left-top">
          <Trend></Trend>
        </div>
        <div class="left-bottom">
          <Seller></Seller>
        </div>
      </div>
      <div class="column">
        <div class="middle-top">
          <Map></Map>
        </div>
        <div class="middle-bottom">
          <Rank></Rank>
        </div>
      </div>
      <div class="column">
        <div class="right-top">
          <Hot></Hot>
        </div>
        <div class="right-bottom">
          <Stock></Stock>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen-container {
  background: #161522;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  //height: 0.3333rem;
  min-height: 64px;
  font-size: 20px;
  position: relative;
}
.header-bg img {
  width: 100%;
}
.screen-header .title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.icon-group {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-80%);
  display: flex;
  align-items: center;
}
.icon-move {
  font-size: 20px;
  //transform: rotate(75deg);
  cursor: pointer;
}
.qiehuan {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0 10px;
}
.time {
  font-size: 16px;
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
}
.column:nth-child(1) {
  //width: 3.125rem;
  width: 27.6%;
  //flex: 3;
  //width: 100%;

  .left-top {
    //height: 2.6042rem;
    height: 53%;
  }

  .left-bottom {
    //height: 2.03125rem;
    height: 31%;

    margin-top: 25px;
  }
}
.column:nth-child(2) {
  //flex: 4;

  width: 41.5%;
  //width: 4.1667rem;

  margin: 0 20px;

  .middle-top {
    height: 56%;
  }
  .middle-bottom {
    margin-top: 25px;

    height: 28%;
  }
}
.column:nth-child(3) {
  //flex: 3;
  //width: 100%;
  //width: 3.125rem;
  width: 27.6%;

  .right-top {
    height: 46%;
  }
  .right-bottom {
    margin-top: 25px;
    height: 38%;
  }
}
</style>
