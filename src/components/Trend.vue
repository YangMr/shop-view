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
      choiceType: "map",
      titleFontSize: 0,
      showChoice: false,
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
  computed: {
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
      };
    },
  },
  methods: {
    initChartInstance() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref);
    },
    // 初始化图表
    initChart() {
      const option = {
        backgroundColor: "#222733",
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "15%",
          left: 20,
          icon: "circle",
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
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#fff",
            },
            type: "category",
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            axisLine: {
              show: true,
            },
            axisLabel: {
              color: "#fff",
            },
            axisTick: {
              show: false,
            },
            splitLine: { show: false },
            type: "value",
          },
        ],
      };

      this.chartInstance.setOption(option);
    },

    // 图表自适应方法
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.clientWidth / 100) * 3.6;

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };

      this.chartInstance.setOption(adapterOption);

      this.chartInstance.resize();
    },

    // 初始化数据方法
    async getData() {
      try {
        const res = await getTrendList();

        this.allData = res.data;
        console.log("this.allData", this.allData);

        this.updateChart();
      } catch (e) {
        console.log(e);
      }
    },

    // 下啦选项切换
    handleSelect(key) {
      this.choiceType = key;
      this.showChoice = false;
      this.updateChart();
    },

    // 更新图表的方法
    updateChart() {
      // x轴的数据
      const timeArr = this.allData.common.month;

      // y轴的数据
      const valueArr = this.allData[this.choiceType].data;

      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];

      const legendArr = valueArr.map((item) => item.name);

      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
          stack: this.choiceType,
          showSymbol: false,
          emphasis: {
            focus: "series",
          },
          data: item.data,
          smooth: true,
        };
      });

      const option = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
          textStyle: {
            color: "#fff",
          },
        },
        series: seriesArr,
      };

      this.chartInstance.setOption(option);
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="title">
      <span>{{ "▎ " + showTitle }}</span>
      <span
        class="iconfont icon-arrow-down"
        @click="showChoice = !showChoice"
      ></span>
      <div v-if="showChoice" class="select-con">
        <div
          v-for="(item, index) in selectTypes"
          :key="index"
          class="select-item"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div ref="trend_ref" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped>
//.container {
//  background: #0077aa;
//}
.title {
  color: #fff;
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
.select-con {
  background: #222733;
  margin-left: 0.4583rem;
}
</style>
