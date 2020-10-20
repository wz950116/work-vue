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
  name: 'creditLimitMonitoring',
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
      const colors = ['#5793f3', '#d14a61']
      myChart1.setOption({
        color: colors,
        title: {
          text: '信用额度监控'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        legend: {
          data: ['占用额度', '预警阈值']
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: ['紫金矿业', '世纪商贸', '包头矿产', '青海商贸', '瑞思贸易', '莱芜商贸', '天津远洋', '青岛实业', '大连贸易', '广州贸易', '重庆商贸']
        }],
        yAxis: [{
          type: 'value',
          name: '占用额度（万元）',
          axisLine: {
            lineStyle: {
              color: colors[0]
            }
          }
        }],
        series: [{
          name: '占用额度',
          type: 'bar',
          data: [634.23, 1235.43, 200.43, 5746.00, 1780.34, 3456.65, 2000.50, 265.70, 2321.50, 2000.00, 4356.67]
        }, {
          name: '预警阈值',
          type: 'line',
          yAxisIndex: 0,
          data: [1000, 2000, 5000, 10000, 3000, 5000, 4000, 2000, 3000, 3500, 6000]
        }]
      })
    }
  }
}
</script>
