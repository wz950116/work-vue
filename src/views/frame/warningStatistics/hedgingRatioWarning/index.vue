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
  name: 'hedgingRatioWarning',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: '电解铜'
          }
        },
        formData: [{
          label: '品种',
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
          data: [0.84, 0.72, 0.51, 0.82, 0.21, 0.63, 0.45, 0.92, 0.81, 0.34]
        },
        '铝锭': {
          data: [0.24, 0.52, 0.31, 0.22, 0.41, 0.63, 0.35, 0.76, 0.58, 0.94]
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
          text: '套保比例预警'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['2019-10-14', '2019-10-15', '2019-10-16', '2019-10-17', '2019-10-18', '2019-10-21', '2019-10-22', '2019-10-23', '2019-10-24', '2019-10-25']
        },
        yAxis: {
          name: '套保比例',
          type: 'value'
        },
        series: {
          name: '电解铜',
          type: 'line',
          data: this.listMap[this.form.listQuery.data.contract].data,
          markPoint: {
            data: [{
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }]
          },
          markLine: {
            data: [{
              yAxis: 0.90,
              name: '比例上限',
              lineStyle: {
                color: '#5793f3'
              }
            }, {
              yAxis: 0.25,
              name: '比例下限'
            }]
          }
        }
      })
    }
  }
}
</script>
