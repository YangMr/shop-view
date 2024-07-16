<script>
export default {
  name: "Rank",
  data() {
    return {
      allData: null,
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
  },
  destroyed() {},
  methods: {
    // 初始化数据
    getData() {},
    // 初始化echarts实例对象
    initChartInstance() {
      this.echartsInstance = this.$echarts.init(this.$refs.rank_ref);
    },
    initChart() {
      const option = {};
      this.echartsInstance.setOption(option);
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
