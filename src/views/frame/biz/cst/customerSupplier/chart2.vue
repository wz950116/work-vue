<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>

    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin-bottom': '22px'}">
      <div class='qm_echarts' id="myChart1"></div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: 'custNewNumReport',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            custNo: '',
            custName: '',
            type: '',
            classify: '',
            date: '',
            status: '',
            usingFlag: '',
            isBlacklist: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'cst.customerSupplier.form.date',
            props: ['startDate', 'endDate'],
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: false,
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取初始化数据
    getList() {
      request({
        url: '/api/cust/customer/getChartDataByNewUser',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      }).then(response => {
        const legendSet = new Set()
        const resDataMap = new Map()
        response.data.forEach(element => {
          legendSet.add(element.typeCode)

          if (resDataMap.get(element.mon)) {
            const dataMap = resDataMap.get(element.mon)
            dataMap.set(element.typeCode, element.countNum)
            resDataMap.set(element.mon, dataMap)
          } else {
            const dataMap = new Map()
            dataMap.set(element.typeCode, element.countNum)
            resDataMap.set(element.mon, dataMap)
          }
        })
        const timeList = []
        let startMon = this.form.listQuery.data.startDate
        startMon = startMon.substring(0, 4) + '.' + startMon.substring(4, 6)
        let endMon = this.form.listQuery.data.endDate
        endMon = endMon.substring(0, 4) + '.' + endMon.substring(4, 6)
        let currMon = startMon
        timeList.push(currMon)
        while (currMon < endMon) {
          currMon = this.getNextMonth(currMon)
          timeList.push(currMon)
        }
        const seriesList = []
        legendSet.forEach(value => {
          const item = {
            name: value,
            type: 'line',
            data: []
          }
          timeList.forEach(time => {
            if (resDataMap.get(time) && resDataMap.get(time).get(value)) {
              item.data.push(resDataMap.get(time).get(value))
            } else {
              item.data.push(0)
            }
          })
          seriesList.push(item)
        })

        const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
        myChart1.setOption({
          title: {
            text: '新增客户数量统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            top: 20,
            right: '10%',
            iconStyle: {
              normal: {
                textPosition: 'right'
              },
              emphasis: {
                textPosition: 'top'
              }
            },
            feature: {
              restore: {
                show: true
              },
              saveAsImage: {
                show: true,
                title: '下载'
              }
            }
          },
          grid: {
            left: '20%',
            right: '20%',
            bottom: '20%',
            scontainLabel: true
          },
          dataZoom: {
            show: true,
            start: 0,
            end: 100
          },
          legend: {
            data: [...legendSet]
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeList
          },
          yAxis: {
            type: 'value'
          },
          series: seriesList
        })
      })
    },
    getNextMonth(date) {
      var arr = date.split('.')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var year2 = year
      var month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }

      var t2 = year2 + '.' + month2
      return t2
    }
  }
}
</script>
