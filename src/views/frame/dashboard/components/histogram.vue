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
      productNameList: [],
      warehouseNameList: [],
      stockColumnarDtoList: [],
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
        url: '/api/warehouse/whEcharts/goodsEcharts',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        this.tableData = []
        var dataList = response.data
        this.productNameList = dataList.productNameList
        this.warehouseNameList = dataList.warehouseNameList
        this.stockColumnarDtoList = dataList.stockColumnarDtoList

        this.productNameList.forEach(element => {
          var object = {
            name: element,
            type: 'bar',
            label: {
              show: false,
              formatter: function(params) {
                if (params.value !== 0) {
                  return params.value
                } else {
                  return ''
                }
              }
            },
            data: []
          }
          if (element !== '总量') {
            object = {
              name: element,
              type: 'bar',
              label: {
                show: false,
                formatter: function(params) {
                  if (params.value !== 0) {
                    return params.value
                  } else {
                    return ''
                  }
                }
              },
              stack: '分开',
              data: []
            }
          }
          var dataQua = []
          this.warehouseNameList.forEach(element2 => {
            var quantity = 0
            this.stockColumnarDtoList.forEach(element1 => {
              if (element1.productName === element && element1.warehouseName === element2) {
                quantity = element1.restQuantity
              }
            })
            dataQua.push(quantity)
            object.data = dataQua
          })
          this.tableData.push(object)
        })

        this.initChart()
      })
    },
    initChart() {
      echarts.dispose(this.$refs.myEchart)
      const myChart1 = this.$echarts.init(document.getElementById(this.id))
      window.onresize = myChart1.resize
      myChart1.setOption({
        color: ['#92ccff', '#3fb1e3', '#5b8bc4', '#a5e7f0', '#a0a7e6', '#f2d643', '#ffb248'],
        title: {
          textColor: 'red'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          },
          // 自定义tooltip数据展示，将value为0的数据不展示
          formatter: function(datas) {
            var dataStr = ''
            datas.forEach(function(data, index) {
              if (data.value !== 0) {
                dataStr += data.marker + data.seriesName + ' : ' + data.value + '吨' + '<br/>'
              }
            })
            return dataStr
          }
        },
        legend: {
          top: '1%',
          color: ['#92ccff', '#3fb1e3', '#5b8bc4', '#a5e7f0', '#a0a7e6', '#f2d643', '#ffb248'],
          data: this.productNameList
        },
        grid: {
          containLabel: true,
          top: '30%' // 距上边距
        },
        xAxis: [
          {
            type: 'category',
            data: this.warehouseNameList,
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            name: '库存量(吨)',
            type: 'value'
          }
        ],
        series: this.tableData
      })
    }
  }
}
</script>

