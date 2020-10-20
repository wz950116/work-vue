<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>

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
  name: 'stopProfitLossWarning',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: '电解铜套利'
          }
        },
        formData: [{
          label: '策略',
          element: 'base-select',
          prop: 'contract',
          list: [{
            label: '电解铜套利',
            value: '电解铜套利'
          }, {
            label: '铝锭套利',
            value: '铝锭套利'
          }],
          attrs: {
            clearable: true
          },
          event: {
            change: this.onChange
          }
        }]
      },
      listMap: {
        '电解铜套利': {
          data: [1000, 2001, 4002, 3003, 1357, -2200, 2353, 3200, 1000, -800]
        },
        '铝锭套利': {
          data: [1000, 2001, 4002, 3003, 2004, -200, 1369, 3200, 1000, -800]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    chartHeight() {
      // 防止底部滚动条遮挡
      return this.clientWidth < 1366 ? this.clientHeight - 161 : this.clientHeight - 144
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    onChange() {
      this.initEchart()
    },
    initEchart() {
      const myChart1 = this.$echarts.init(
        document.getElementById('myChart1')
      )
      window.onresize = myChart1.resize
      myChart1.setOption({
        title: {
          text: '止盈止损预警'
        },
        color: ['#003366', '#006699'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {}
        },
        calculable: false,
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          data: ['2019-10-14', '2019-10-15', '2019-10-16', '2019-10-17', '2019-10-18', '2019-10-21', '2019-10-22', '2019-10-23', '2019-10-24', '2019-10-25']
        }],
        yAxis: [{
          name: '盈亏（万元）',
          type: 'value'
        }],
        series: [{
          type: 'bar',
          barGap: 0,
          data: this.listMap[this.form.listQuery.data.contract].data,
          markLine: {
            data: [{
              yAxis: 5000,
              name: '止盈线'
            }, {
              yAxis: -3000,
              name: '止损线',
              lineStyle: {
                color: 'red'
              }
            }]
          }
        }]
      })
    }
  }
}
</script>
