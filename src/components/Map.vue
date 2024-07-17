<script>
import { getMapList } from "@/api";
import axios from "axios";

export default {
  name: "Map",
  data() {
    return {
      allData: null,
      echartsInstance: null,
      titleFontSize: null,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.initChartInstance();
    this.initChart();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async getData() {
      try {
        const res = await getMapList();
        this.allData = res.data;
        console.log("this.allData", this.allData);
        this.updateChart();
      } catch (e) {
        console.log(e);
      }
    },
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.map_ref);
    },
    async initChart() {
      try {
        // 1. 获取china.json中国地图数据
        const res = await axios({
          url: "http://localhost:8999/static/map/china.json",
          method: "GET",
        });

        // 2. 注册地图
        this.$echarts.registerMap("china", res.data);

        // 配置地图
        const option = {
          backgroundColor: "#222733",
          title: {
            text: "▎ 商家分布",
            left: 20,
            top: 20,
            textStyle: {
              color: "#fff",
            },
          },
          geo: {
            type: "map",
            map: "china",
            itemStyle: {
              areaColor: "#2e72bf",
              borderColor: "#333",
            },
          },
        };

        // 渲染配置项
        this.echartsInstance.setOption(option);
      } catch (e) {
        console.log(e);
      }
    },
    updateChart() {
      const option = {};
      this.echartsInstance.setOption(option);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.map_ref.clientWidth / 100) * 3.6;
      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
      };
      this.echartsInstance.setOption(option);
      this.echartsInstance.resize();
    },
  },
};
</script>

<template>
  <div class="container">
    <div ref="map_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped></style>
