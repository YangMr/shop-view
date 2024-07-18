<script>
import { getHotList } from "@/api";

export default {
  name: "Hot",
  data() {
    return {
      allData: null,
      currentIndex: 0,
      echartsInstance: null,
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
  },
  computed: {
    titleSize() {
      return this.titleFontSize + "px";
    },
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
  },
  methods: {
    async getData() {
      try {
        const res = await getHotList();
        this.allData = res.data;

        console.log(" this.allData ", this.allData);
        this.updateChart();
      } catch (e) {
        console.log(e);
      }
    },
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.hot_ref);
    },
    initChart() {
      const option = {
        backgroundColor: "#222733",
        title: {
          text: "▎ 热销商品的占比",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const children = arg.data.children;
            let total = 0;
            children.forEach((item) => {
              total += item.value;
            });
            let str = "";

            children.forEach((item) => {
              str += `${item.name}: ${parseInt(
                ((item.value / total) * 100).toString()
              )}% <br/>`;
            });

            return str;
          },
        },
        labelLine: {
          show: false,
        },
        legend: {
          top: "15%",
          icon: "circle",
          textStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "pie",
            // radius: "50%",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    updateChart() {
      const colorArr = ["green", "blue", "pink", "#f60", "purple", "yellow"];

      const seriesData = this.allData[this.currentIndex].children.map(
        (item, index) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
            itemStyle: {
              color: colorArr[index],
            },
          };
        }
      );
      const option = {
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.clientWidth / 100) * 3.6;

      const option = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
      };

      this.echartsInstance.setOption(option);

      this.echartsInstance.resize();
    },
    handleLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    handleRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
  },
};
</script>

<template>
  <div class="container">
    <div ref="hot_ref" class="chart"></div>
    <span class="iconfont left icon-arrow-lift" @click="handleLeft"></span>
    <span class="iconfont right icon-arrow-right" @click="handleRight"></span>
    <div :style="{ fontSize: this.titleSize }" class="cat-name">
      {{ catName }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left {
  position: absolute;
  left: 10%;
  top: 50%;
  color: #fff;
  z-index: 9999;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.234375rem;
}

.right {
  position: absolute;
  transform: translateY(-50%);
  right: 10%;
  top: 50%;
  color: #fff;
  z-index: 9999;
  cursor: pointer;
  font-size: 0.234375rem;
}
.cat-name {
  position: absolute;
  right: 5%;
  bottom: 20px;
  //font-size: 0.3125rem;
  color: #fff;
}
</style>
