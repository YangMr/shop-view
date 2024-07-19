<script>
import { getRankList } from "@/api";
import { mapState } from "vuex";

export default {
  name: "Rank",
  data() {
    return {
      allData: null,
      echartsInstance: null,
      titleFontSize: 0,
      startValue: 0,
      endValue: 9,
      timer: null,
    };
  },
  created() {
    // this.getData();
    this.$socket.registerCallBack("rankData", this.getData);
  },
  computed: {
    ...mapState["socket_connected"],
  },
  watch: {
    socket_connected(value) {
      if (value) {
        this.$socket.send({
          action: "getData",
          socketType: "trendData",
          chartName: "trend",
          value: "",
        });
      }
    },
  },
  mounted() {
    this.initChartInstance();
    this.initChart();
    // 通过websocket发送请求
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
    this.$socket.unregisterCallBack("rankData");
  },
  methods: {
    // 初始化数据
    async getData(res) {
      try {
        // const res = await getRankList();

        this.allData = res;

        this.allData.sort((a, b) => b.value - a.value);

        this.updateChart();
        this.startInterval();
      } catch (e) {
        console.log(e);
      }
    },
    // 初始化echarts实例对象
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.rank_ref);
    },
    // 初始化图表配置
    initChart() {
      const option = {
        backgroundColor: "#222733",
        title: {
          text: "▎ 地区销售排行",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          top: "40%",
          left: "5%",
          bottom: "5%",
          right: "5%",
          containLabel: true,
        },
        tooltip: {
          type: "category",
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    // 图表自适应
    screenAdapter() {
      this.titleFontSize = (this.$refs.rank_ref.clientWidth / 100) * 3.6;

      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
                0,
              ],
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);

      this.echartsInstance.resize();
    },
    // 更新图表方法
    updateChart() {
      // 获取x轴数据
      const provinceArr = this.allData.map((item) => item.name);
      // 获取y轴数据
      const valueArr = this.allData.map((item) => item.value);
      // 柱状图颜色
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const option = {
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColor = null;

                if (arg.value > 300) {
                  targetColor = colorArr[0];
                } else if (arg.value > 200) {
                  targetColor = colorArr[1];
                } else {
                  targetColor = colorArr[2];
                }
                return {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: targetColor[0], // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: targetColor[1], // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                };
              },
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    // 定时器
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 1000);
    },
  },
};
</script>

<template>
  <div class="container">
    <div ref="rank_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped></style>
