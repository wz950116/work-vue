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
  name: 'spotCash',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: '电解铜'
          }
        },
        formData: [{
          label: '合约',
          element: 'base-select',
          prop: 'contract',
          list: [{
            label: '电解铜',
            value: '电解铜'
          }, {
            label: '铝锭',
            value: '铝锭'
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
        '电解铜': {
          data1: [1000, 2001, 4002, 3003, 4004, 2200, 5000, 3200, 1000, 800],
          data2: [1200, 8000, 3002, 5003, 7000, 2200, 5000, 3500, 6000, 4800],
          data3: [500, 3001, 4002, 2003, 5004, 1200, 6000, 4200, 1000, 800]
        },
        '铝锭': {
          data1: [2000, 3001, 4400, 2003, 5004, 1200, 6000, 4200, 1000, 800],
          data2: [1000, 2001, 4002, 3003, 4004, 2200, 5500, 3400, 1300, 900],
          data3: [1250, 8500, 3002, 5003, 7000, 2200, 5000, 3500, 6000, 4800]
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
          text: '现货头寸'
        },
        color: ['#003366', '#006699'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['非敞口', '套保', '未套保']
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
          data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日']
        }],
        yAxis: [{
          name: '持仓量（吨）',
          type: 'value'
        }],
        series: [{
          name: '非敞口',
          type: 'bar',
          barGap: 0,
          data: this.listMap[this.form.listQuery.data.contract].data1
        }, {
          name: '套保',
          type: 'bar',
          barGap: 0,
          data: this.listMap[this.form.listQuery.data.contract].data2
        }, {
          name: '未套保',
          type: 'bar',
          data: this.listMap[this.form.listQuery.data.contract].data3
        }]
      })
    }
  }
}
</script>
