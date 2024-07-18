<script>
import { getMapList } from "@/api";
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";

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
        console.log("this.allData ", this.allData);
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
          legend: {
            left: "5%",
            bottom: "5%",
            // data: ["张三", "里斯", "王五"],
            textStyle: {
              color: "#fff",
            },
            orient: "vertical",
          },
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
          // series: [
          //   {
          //     name: "张三",
          //     type: "effectScatter",
          //     coordinateSystem: "geo",
          //   },
          //   {
          //     name: "里斯",
          //     type: "effectScatter",
          //     coordinateSystem: "geo",
          //   },
          //   {
          //     name: "王五",
          //     type: "effectScatter",
          //     coordinateSystem: "geo",
          //   },
          // ],
        };

        // 渲染配置项
        this.echartsInstance.setOption(option);

        // 给地图绑定点击时间
        this.echartsInstance.on("click", async (arg) => {
          const data = getProvinceMapInfo(arg.name);

          try {
            const res = await axios({
              url: `http://localhost:8999/${data.path}`,
            });
            console.log("Res=>", res.data);

            this.$echarts.registerMap(data.key, res.data);

            const option = {
              geo: {
                map: data.key,
              },
            };

            this.echartsInstance.setOption(option);
          } catch (e) {
            console.log(e);
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    updateChart() {
      const legendArr = this.allData.map((item) => item.name);
      console.log("legendArr", legendArr);
      const seriesArr = this.allData.map((item) => {
        return {
          name: item.name,
          type: "effectScatter",
          coordinateSystem: "geo",
          data: item.children,
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
        };
      });
      const option = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
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
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.echartsInstance.setOption(option);
      this.echartsInstance.resize();
    },
    revertMap() {
      const option = {
        geo: {
          map: "china",
        },
      };
      this.echartsInstance.setOption(option);
    },
  },
};
</script>

<template>
  <div class="container" @dblclick="revertMap">
    <div ref="map_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped></style>
