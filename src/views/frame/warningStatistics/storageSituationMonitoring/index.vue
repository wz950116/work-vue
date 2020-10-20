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
  name: 'storageSituationMonitoring',
  data() {
    return {
      form: {
        listQuery: {
          data: {
            contract: '北京仓库'
          }
        },
        formData: [
          {
            label: '仓库',
            element: 'base-select',
            prop: 'contract',
            list: [
              {
                label: '北京仓库',
                value: '北京仓库'
              },
              {
                label: '上海仓库',
                value: '上海仓库'
              },
              {
                label: '广州仓库',
                value: '广州仓库'
              }
            ],
            attrs: {
              clearable: true
            },
            event: {
              change: this.onChange
            }
          }
        ]
      },
      listMap: {
        北京仓库: {
          data1: [234, 211, 478, 134],
          data2: [1100.97, 972.71, 140.53, 107.2],
          data3: [500, 300, 600, 400]
        },
        上海仓库: {
          data1: [312, 423, 134, 637],
          data2: [1471.39, 592.2, 38.86, 515.97],
          data3: [350, 300, 800, 1000]
        },
        广州仓库: {
          data1: [541, 156, 534, 836],
          data2: [2552.44, 219.65, 154.33, 660.44],
          data3: [1000.0, 300.0, 800.0, 1000.0]
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
      const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      window.onresize = myChart1.resize
      const colors = ['#5793f3', '#d14a61', '#675bba']
      myChart1.setOption({
        color: colors,
        title: {
          text: '库存情况监控'
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
          data: ['货量', '货值', '货量限额']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['电解铜', '铝锭', '氧化铝', '铜精矿']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '货量（吨）',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            }
          },
          {
            type: 'value',
            name: '货值（万元）',
            position: 'right',
            offset: 80,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            }
          }
        ],
        series: [
          {
            name: '货量',
            type: 'bar',
            data: this.listMap[this.form.listQuery.data.contract].data1
          },
          {
            name: '货值',
            type: 'bar',
            yAxisIndex: 1,
            data: this.listMap[this.form.listQuery.data.contract].data2
          },
          {
            name: '货量限额',
            type: 'line',
            yAxisIndex: 0,
            data: this.listMap[this.form.listQuery.data.contract].data3
          }
        ]
      })
    }
  }
}
</script>
