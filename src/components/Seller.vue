<script>
import { getSellerList } from "@/api";
export default {
  name: "Seller",
  data() {
    return {
      echartsInstance: null,
      allData: null,
      currentPage: 1, // 页码
      totalPage: 0, // 总页码
      timer: null, // 定时器的标识
      titleFontSize: 0,
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
    clearInterval(this.timer);
  },
  methods: {
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.seller_ref);
    },
    initChart() {
      const option = {
        backgroundColor: "#222733",
        title: {
          text: "▎ 商家销售统计",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2D3443",
            },
          },
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          axisLabel: {
            color: "#fff",
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          type: "category",
          axisLabel: {
            color: "#fff",
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "2011",
            type: "bar",
            barWidth: 66,
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "#fff",
              },
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);

      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.echartsInstance.on("mouseout", () => {
        this.scroll();
      });
    },
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);

      // 获取y轴的数据
      const sellerNames = showData.map((item) => item.name);

      // 获取value的数据
      const sellerValues = showData.map((item) => item.value);

      const option = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };

      this.echartsInstance.setOption(option);
    },
    async getData() {
      try {
        const res = await getSellerList();

        this.allData = res.data;

        this.allData.sort((a, b) => {
          return a.value - b.value; // 从大到小排序
        });

        this.totalPage =
          this.allData.length % 5 === 0
            ? this.allData.length / 5
            : this.allData.length / 5 + 1;

        this.updateChart();

        this.scroll();
      } catch (e) {
        console.log(e);
      }
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.seller_ref.clientWidth / 100) * 3.6;

      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: this.titleFontSize,
            },
          },
        },

        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                0,
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
              ],
            },
          },
        ],
      };

      this.echartsInstance.setOption(option);

      this.echartsInstance.resize();
    },
    scroll() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;

        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }

        this.updateChart();
      }, 3000);
    },
  },
};
</script>

<template>
  <div class="container">
    <div ref="seller_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped></style>
