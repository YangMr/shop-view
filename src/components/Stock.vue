<script>
import { getStockList } from "@/api";

export default {
  name: "Stock",
  data() {
    return {
      allData: null,
      echartsInstance: null,
      timer: null,
      titleFontSize: 0,
      currentIndex: 0,
      totalPage: 0,
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
    async getData() {
      try {
        const res = await getStockList();
        this.allData = res.data;

        this.totalPage =
          this.allData.length % 5 === 0
            ? parseInt((this.allData.length / 5).toString())
            : parseInt((this.allData.length / 5 + 1).toString());

        this.updateChart();
        this.startInterval();
      } catch (e) {
        console.log(e);
      }
    },
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.stock_ref);
    },
    initChart() {
      const option = {
        backgroundColor: "#222733",
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },
      };
      this.echartsInstance.setOption(option);

      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.echartsInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    updateChart() {
      // 饼图的位置
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      // 饼图的颜色
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];

      // 处理图表所需要的数据
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);

      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          // radius: ["20%", "30%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            show: true,
            position: "center",
            color: colorArr[index][0],
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: item.sales,
              name: item.name + "\n\n" + item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });

      const option = {
        series: seriesArr,
      };
      this.echartsInstance.setOption(option);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.stock_ref.clientWidth / 100) * 3.6;
      const innerRadius = this.titleFontSize * 2.8;
      const outerRadius = innerRadius * 1.125;

      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: this.titleFontSize / 2,
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);
      this.echartsInstance.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex >= this.totalPage) {
          this.currentIndex = 0;
        }

        this.updateChart();
      }, 3000);
    },
  },
};
</script>

<template>
  <div class="container">
    <div ref="stock_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped></style>
