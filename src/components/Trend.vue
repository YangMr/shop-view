<script>
/**
 * 1. 下载并引入echarts
 * 2. 创建渲染的dom元素
 * 3. 实例化echarts并制定渲染的dom节点
 * 4. 创建配置项
 * 5. 渲染配置项数据
 * 6. 图表自适应
 */
import { getTrendList } from "@/api";

export default {
  name: "Trend",
  data() {
    return {
      chartInstance: null,
      allData: null,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    // 初始化图表
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref);
      const option = {
        backgroundColor: "#222733",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
          top: "15%",
          left: 20,
          icon: "circle",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          top: "35%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      };
      this.chartInstance.setOption(option);
    },

    // 图表自适应方法
    screenAdapter() {
      this.chartInstance.resize();
    },

    // 初始化数据方法
    async getData() {
      try {
        const res = await getTrendList();
        console.log("Res=>", res);
        this.allData = res.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="title">
      <span>{{ "▎ " + "地区销量趋势" }}</span>
      <span class="iconfont icon-arrow-down"></span>
    </div>
    <div ref="trend_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped>
//.container {
//  background: #0077aa;
//}
.title {
  color: #f60;
  font-size: 0.3646rem;
  position: absolute;
  left: 0.1042rem;
  top: 0.1042rem;
  z-index: 10;
}

.title span:nth-child(2) {
  margin-left: 0.0521rem;
  font-size: 0.3646rem;
  cursor: pointer;
}
</style>
