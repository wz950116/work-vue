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
  name: 'priceTrend',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: '电解铜期现价差'
          }
        },
        formData: [{
          label: '价差名称',
          element: 'base-select',
          prop: 'contract',
          list: [{
            label: '电解铜期现价差',
            value: '电解铜期现价差'
          }, {
            label: '铝锭期现价差',
            value: '铝锭期现价差'
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
        '电解铜期现价差': {
          data: [50, 60, 80, 100, 150, 30, 100, 60, 90, 110]
        },
        '铝锭期现价差': {
          data: [60, 70, 90, 150, 100, 40, 80, 50, 10, 70]
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
          text: '价差走势'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2019-10-14', '2019-10-15', '2019-10-16', '2019-10-17', '2019-10-18', '2019-10-21', '2019-10-22', '2019-10-23', '2019-10-24', '2019-10-25']
        },
        yAxis: {
          name: '价差（元）',
          type: 'value'
        },
        series: [{
          data: this.listMap[this.form.listQuery.data.contract].data,
          type: 'line',
          areaStyle: {}
        }]
      })
    }
  }
}
</script>
