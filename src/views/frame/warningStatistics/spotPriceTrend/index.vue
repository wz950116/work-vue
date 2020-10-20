<template>
  <div class="app-container">
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin-bottom': '22px'}">
      <div class='qm_echarts'>
        <div id="myChart1" :style="{width: '100%', height: chartHeight + 'px'}"></div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'spotPriceTrend',
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    chartHeight() {
      // 防止底部滚动条遮挡
      return this.clientWidth < 1366 ? this.clientHeight - 121 : this.clientHeight - 104
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      const myChart1 = this.$echarts.init(
        document.getElementById('myChart1')
      )
      window.onresize = myChart1.resize
      myChart1.setOption({
        title: {
          text: '现货价格走势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['电解铜', '铝锭', '热卷']
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '15%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2019-10-14', '2019-10-15', '2019-10-16', '2019-10-17', '2019-10-18', '2019-10-21', '2019-10-22', '2019-10-23', '2019-10-24', '2019-10-25']
        },
        yAxis: {
          name: '价格（元）',
          type: 'value'
        },
        series: [{
          name: '电解铜',
          type: 'line',
          data: [47050, 47160, 47180, 47100, 47150, 47000, 46100, 47060, 47090, 47110]
        }, {
          name: '铝锭',
          type: 'line',
          data: [14000, 13970, 13900, 13890, 13910, 13940, 14000, 13800, 13910, 13970]
        }, {
          name: '热卷',
          type: 'line',
          data: [3770, 3600, 3700, 3670, 3700, 3750, 3540, 3710, 3700, 3740]
        }]
      })
    }
  }
}
</script>
