<template>
  <div class='qm_echarts' :id='id' ref="myEchart" style="height: 458px;"></div>
</template>

<script>
import request from '@/utils/frame/base/request'
import echarts from 'echarts'

export default {
  name: 'chart',
  data() {
    return {
      activeName: 'first',
      dataNameList: [],
      tableData: []
    }
  },
  props: {
    id: Number
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      request({
        url: '/api/warehouse/whEcharts/goodsPriceEcharts',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        this.tableData = []
        this.tableData = response.data
        this.tableData.forEach(element => {
          this.$set(element, 'value', element.restPrice)
          this.$set(element, 'name', element.productName)
          this.dataNameList.push(element.productName)
        })

        this.initChart()
      })
    },
    initChart() {
      echarts.dispose(this.$refs.myEchart)
      const myChart2 = this.$echarts.init(document.getElementById(this.id))
      window.onresize = myChart2.resize
      // 把配置和数据放这里
      myChart2.setOption({
        color: ['#92ccff', '#3fb1e3', '#5b8bc4', '#a5e7f0', '#a0a7e6', '#f2d643', '#ffb248'],
        title: {
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}(万元) ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          top: 20,
          left: 10,
          data: this.dataNameList
        },
        series: [
          {
            type: 'pie',
            roam: true,
            radius: '65%',
            center: ['55%', '50%'],
            data: this.tableData,
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c}万元 ({d}%)'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(data) {
                    var b = data.name
                    var d = data.percent
                    var q = data.data.restQuantity
                    return b + ':' + d + '%' + '\n' + q + '吨'
                  }
                },
                labelLine: { show: true }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

