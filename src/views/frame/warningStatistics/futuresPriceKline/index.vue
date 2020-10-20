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
  name: 'futuresPriceKline',
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
          data: [[47050, 48050, 47000, 48050],
            [47160, 47180, 47160, 48000],
            [47180, 47190, 47180, 47220],
            [47100, 47000, 46900, 47170],
            [47150, 47100, 47100, 47180],
            [47000, 46900, 46900, 47080],
            [46100, 46000, 46000, 46160],
            [47060, 48000, 47050, 48050],
            [47090, 47090, 47070, 48000],
            [47110, 47130, 47110, 47150]],
          min: 45000,
          max: 50000
        },
        'AL1910': {
          data: [[14050, 14080, 14000, 14100],
            [13970, 14000, 13970, 14070],
            [13900, 14000, 13880, 14090],
            [13890, 13880, 13880, 13920],
            [13910, 13950, 13900, 13990],
            [13940, 13990, 13940, 14000],
            [14000, 14060, 13980, 14100],
            [13800, 13860, 13805, 13900],
            [13910, 13980, 13910, 14010],
            [13970, 14080, 13950, 14090]],
          min: 13000,
          max: 15000
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
          text: '期货价格K线图'
        },
        xAxis: {
          data: ['2019-10-14', '2019-10-15', '2019-10-16', '2019-10-17', '2019-10-18', '2019-10-21', '2019-10-22', '2019-10-23', '2019-10-24', '2019-10-25']
        },
        yAxis: {
          name: '价格（元）',
          min: this.listMap[this.form.listQuery.data.contract].min,
          max: this.listMap[this.form.listQuery.data.contract].max
        },
        series: [{
          type: 'k',
          data: this.listMap[this.form.listQuery.data.contract].data
        }]
      })
    }
  }
}
</script>
