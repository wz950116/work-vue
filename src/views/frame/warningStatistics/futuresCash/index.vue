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
  name: 'futuresCash',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: 'Cu1910'
          }
        },
        formData: [{
          label: '合约',
          element: 'base-select',
          prop: 'contract',
          list: [{
            label: 'Cu1910',
            value: 'Cu1910'
          }, {
            label: 'AL1910',
            value: 'AL1910'
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
        'Cu1910': {
          data1: [1000, 2001, 4002, 3003, 4004, 2200, 5000, 3200, 1000, 800],
          data2: [1200, 8000, 3002, 5003, 7000, 2200, 5000, 3500, 6000, 4800]
        },
        'AL1910': {
          data1: [1000, 4001, 3002, 2003, 1890, 2500, 4000, 3800, 7000, 1800],
          data2: [1200, 8000, 3002, 5003, 7000, 2200, 5000, 3500, 6000, 4800]
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
          text: '期货头寸'
        },
        color: ['#003366', '#006699'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['套保', '未套保']
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
          name: '套保',
          type: 'bar',
          barGap: 0,
          data: this.listMap[this.form.listQuery.data.contract].data1
        }, {
          name: '未套保',
          type: 'bar',
          data: this.listMap[this.form.listQuery.data.contract].data2
        }]
      })
    }
  }
}
</script>
